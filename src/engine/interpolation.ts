import { Easing } from '@/mixins'
import {
  Complex,
  Coord,
  Direction,
  directionChangeMask,
  Particle,
  reverseDirection,
  Rotation,
  unitVector,
} from './model'

const cxZero = new Complex(0, 0)

function complexPolarLerp(a: Complex, b: Complex, t: number): Complex {
  const revt = 1 - t
  return Complex.fromPolar(a.r * revt + b.r * t, a.phi * revt + b.phi * t)
}

function lerpCoord(a: Coord, b: Coord, t: number): { x: number; y: number } {
  const revt = 1 - t
  return {
    x: a.x * revt + b.x * t,
    y: a.y * revt + b.y * t,
  }
}

export interface InterpolatedParticle {
  // Source particle coord, null for purely visual particles
  readonly coord: Coord | null
  // visually accurate particle coordinate
  readonly position: { x: number; y: number }
  readonly direction: Direction
  readonly a: Complex
  readonly b: Complex
  // Angle for mask through cell center.
  // Used for masking out
  readonly maskRotation: ClipPlane[]
}

export interface ClipPlane {
  origin: Coord
  rotation: Rotation
}

export function interpolateParticle(
  t: number,
  prevs: Particle[],
  p: Particle,
  nexts: Particle[],
  allCurrentParticles: Particle[]
): InterpolatedParticle[] {
  const particles: InterpolatedParticle[] = []
  const masks = []

  const fromPrevPropagation = prevs.find((pPrev) => p.direction === pPrev.direction)
  const forwardPropagation = nexts.find((n) => n.direction === p.direction)

  // emit reflection particles back
  for (const pPrev of prevs) {
    const rotation = directionChangeMask(pPrev.direction, p.direction)
    if (rotation != null) {
      const mask = {
        origin: p.coord,
        rotation,
      }
      const coord1 = pPrev.coord.neighbour(pPrev.direction)
      const coord2 = coord1.neighbour(pPrev.direction)

      // if there already is a particle with the same propagation in the current list,
      // ignore, as it would be drawn twice
      const fromForwardPropagation = allCurrentParticles.some(
        (p) => p.coord === coord1 && p.direction === pPrev.direction
      )

      if (fromPrevPropagation == null) {
        masks.push(mask)
      }

      if (!fromForwardPropagation) {
        particles.push({
          coord: null,
          a: pPrev.a,
          b: pPrev.b,
          direction: pPrev.direction,
          maskRotation: [mask],
          position: lerpCoord(coord1, coord2, t),
        })
      }
    }
  }
  if (forwardPropagation == null) {
    for (const pNext of nexts) {
      const rotation = directionChangeMask(p.direction, pNext.direction)
      if (rotation != null) {
        masks.push({
          origin: pNext.coord,
          rotation,
        })
      }
    }
  }

  let a = p.a
  let b = p.b

  if (t < 0.5) {
    // interpolate from half of previous frame towards current frame
    const subt = t + 0.5
    if (fromPrevPropagation != null || prevs.length === 0) {
      const fromA = fromPrevPropagation?.a ?? cxZero
      const fromB = fromPrevPropagation?.b ?? cxZero
      const ease = Easing.Quartic.InOut(subt)
      a = complexPolarLerp(fromA, p.a, ease)
      b = complexPolarLerp(fromB, p.b, ease)
    }
  } else {
    // interpolate from current frame towards half of the next frame
    const subt = t - 0.5
    if (forwardPropagation != null || nexts.length === 0) {
      const toA = forwardPropagation?.a ?? cxZero
      const toB = forwardPropagation?.b ?? cxZero
      const ease = Easing.Quartic.InOut(subt)
      a = complexPolarLerp(p.a, toA, ease)
      b = complexPolarLerp(p.b, toB, ease)
    }
  }

  particles.push({
    coord: p.coord,
    a,
    b,
    direction: p.direction,
    maskRotation: masks,
    position: lerpCoord(p.coord, p.coord.neighbour(p.direction), t),
  })

  for (const pNext of nexts) {
    const rotation = directionChangeMask(p.direction, pNext.direction)
    if (rotation != null) {
      const coord1 = pNext.coord.neighbour(reverseDirection(pNext.direction))
      const coord2 = pNext.coord
      particles.push({
        coord: null,
        a: pNext.a,
        b: pNext.b,
        direction: pNext.direction,
        maskRotation: [
          {
            origin: pNext.coord,
            rotation,
          },
        ],
        position: lerpCoord(coord1, coord2, t),
      })
    }
  }

  return particles
}

const spread = 1.2
const clipSelf = `M${-spread} ${-spread} ${-spread} ${+spread} ${+spread} ${+spread} ${+spread} ${-spread}`

/**
 * Generate half-plane clip path, visible area in the provided rotation direction.
 * Path is in the photon inner svg space.
 */
export function clipPlanePath(clips: ClipPlane[], offset: { x: number; y: number }): string | null {
  if (clips.length === 0) return null

  const x = offset.x
  const y = offset.y

  return (
    clips
      .map(({ rotation, origin }) => {
        const v = unitVector(rotation)
        const cx = (origin.x - x) * 2.4 // viewbox size
        const cy = (origin.y - y) * 2.4

        if (v.x === 0 || v.y === 0) {
          // head on, just draw a minimal box around 1.5 cells
          const vx = -v.x * 1.2
          const vy = -v.y * 1.2
          const x1 = cx + vy
          const y1 = cy - vx
          const x2 = cx - vy
          const y2 = cy + vx
          const x3 = cx - vy + vx * 3
          const y3 = cy + vx + vy * 3
          const x4 = cx + vy + vx * 3
          const y4 = cy - vx + vy * 3
          return `M${x1} ${y1} ${x2} ${y2} ${x3} ${y3} ${x4} ${y4}`
        } else {
          // diagonal, draw a wide 3.5 cell box with cut corner
          const vx = -v.x * 1.7
          const vy = -v.y * 1.7
          const x1 = cx + vy
          const y1 = cy - vx
          const x2 = cx - vy
          const y2 = cy + vx
          const x3 = cx - vy - vy + vx
          const y3 = cy + vx + vx + vy
          const x4 = cx + vx * 3
          const y4 = cy + vy * 3
          const x5 = cx + vy + vy + vx
          const y5 = cy - vx - vx + vy
          return `M${x1} ${y1} ${x2} ${y2} ${x3} ${y3} ${x4} ${y4} ${x5} ${y5}`
        }
      })
      .join(' ') + clipSelf
  )
}
