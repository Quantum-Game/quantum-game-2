import { assertUnreachable } from '@/types'
import { Vec2 } from './level'

export const enum Rotation {
  Right,
  UpRight,
  Up,
  UpLeft,
  Left,
  DownLeft,
  Down,
  DownRight,
}

const diag = 1 / Math.SQRT2

// Generate unit vector with given rotation.
// X points right, Y points up.
export function unitVector(rot: Rotation): Vec2 {
  switch (rot) {
    case Rotation.Right:
      return { x: 1, y: 0 }
    case Rotation.UpRight:
      return { x: diag, y: -diag }
    case Rotation.Up:
      return { x: 0, y: -1 }
    case Rotation.UpLeft:
      return { x: -diag, y: -diag }
    case Rotation.Left:
      return { x: -1, y: 0 }
    case Rotation.DownLeft:
      return { x: -diag, y: diag }
    case Rotation.Down:
      return { x: 0, y: 1 }
    case Rotation.DownRight:
      return { x: diag, y: diag }
    default:
      assertUnreachable(rot)
  }
}

export function rotationFromDegrees(rot: number): Rotation {
  switch ((rot + 360) % 360) {
    case 0:
      return Rotation.Right
    case 45:
      return Rotation.UpRight
    case 90:
      return Rotation.Up
    case 135:
      return Rotation.UpLeft
    case 180:
      return Rotation.Left
    case 225:
      return Rotation.DownLeft
    case 270:
      return Rotation.Down
    case 315:
      return Rotation.DownRight
    default:
      throw new Error(`Invalid rotation angle ${rot}`)
  }
}

export function rotationToDegrees(rot: Rotation): number {
  switch (rot) {
    case Rotation.Right:
      return 0
    case Rotation.UpRight:
      return 45
    case Rotation.Up:
      return 90
    case Rotation.UpLeft:
      return 135
    case Rotation.Left:
      return 180
    case Rotation.DownLeft:
      return 225
    case Rotation.Down:
      return 270
    case Rotation.DownRight:
      return 315
  }
}
