import { Elem, Rotation } from './model'

interface ElementData {
  description: string
  ascii: string[]
}

export const ElemVoid = Symbol('Void')

const rot1 = [Rotation.Right]
const rot4 = [Rotation.Right, Rotation.Up, Rotation.Left, Rotation.Down]
const rot8 = [
  Rotation.Right,
  Rotation.UpRight,
  Rotation.Up,
  Rotation.UpLeft,
  Rotation.Left,
  Rotation.DownLeft,
  Rotation.Down,
  Rotation.DownRight,
]

export function nextElementRotation(elem: Elem, rotation: Rotation): Rotation {
  const angles = elementAngles(elem)
  const index = (angles.findIndex((r) => r === rotation) + 1) % angles.length
  return angles[index]
}

export function elementAngles(elem: Elem): Rotation[] {
  switch (elementsData[elem].ascii.length) {
    case 1:
      return rot1
    case 4:
      return rot4
    case 8:
      return rot8
  }
  throw new Error(`invalid ascii definition size for element '${Elem[elem]}'`)
}

export const elementsData: Record<Elem | typeof ElemVoid, ElementData> = {
  [ElemVoid]: {
    description: 'The void...',
    ascii: ['.'],
  },
  [Elem.Wall]: {
    description: 'Another brick in the wall.',
    ascii: ['▓'],
  },
  [Elem.Gate]: {
    description: 'A gate that can be opened if next to a fed plant.',
    ascii: ['M'],
  },
  [Elem.Laser]: {
    description: 'An on-demand single photon source.',
    ascii: ['>', '^', '<', 'v'],
  },
  [Elem.NonLinearCrystal]: {
    description: 'A BBO crystal.',
    ascii: ['>', '^', '<', 'v'],
  },
  [Elem.Mirror]: {
    description: 'Metallic or dielectric mirror.',
    ascii: ['-', '/', '|', '\\', '-', '/', '|', '\\'],
  },
  [Elem.BeamSplitter]: {
    description:
      'A thin slab of glass reflecting half the beam, and transmitting other half of it.',
    ascii: ['→', '↗', '↑', '↖', '←', '↙', '↓', '↘'],
  },
  [Elem.PolarizingBeamSplitter]: {
    description: 'Reflects vertical polarization (↕), transmits horizonal polarization (↔).',
    ascii: ['⬲', '⟴'],
  },
  [Elem.CoatedBeamSplitter]: {
    description:
      'A thin slab of glass with a reflective layer - reflecting half the beam and transmitting the other half of it.',
    ascii: ['⇒', '⇗', '⇑', '⇖', '⇐', '⇙', '⇓', '⇘'],
  },
  [Elem.CornerCube]: {
    description: 'Reflects any incoming photon.',
    ascii: ['X'],
  },
  [Elem.Detector]: {
    description:
      'Detects and amplifies electric signal from each single photon, from a single direction. Your goal is to get photon there!',
    ascii: ['⭲', '⭱', '⭰', '⭳'],
  },
  [Elem.Rock]: {
    description:
      "Dark and immersive as your sweetheart's depth of eyes. Absorbs light. And is sensitive.",
    ascii: ['♜'],
  },
  [Elem.Mine]: {
    description:
      'Once it absorbs a single photon, it sets off. Old french submarine captains can sometimes disarm them.',
    ascii: ['!'],
  },
  [Elem.Absorber]: {
    description: 'Filter with 50% absorption probability.',
    ascii: ['A'],
  },
  [Elem.DetectorFour]: {
    description:
      'Detects and amplifies electric signal from each single photon, from all directions. Typically, it is the goal to get the photon here.',
    ascii: ['O'],
  },
  [Elem.Polarizer]: {
    description:
      'A polarization filter... Anisotropic polymer strands capture electric oscillations parallel to them. Used in photography.',
    ascii: ['▤', '▨', '▥', '▧', '▤', '▨', '▥', '▧'],
  },
  [Elem.QuarterWavePlate]: {
    description:
      'It delays one polarization (with darker lines) by λ/4. When applied correctly, it can change linear polarization into circular, and vice versa.',
    ascii: ['▤', '▨', '▥', '▧', '▤', '▨', '▥', '▧'],
  },
  [Elem.HalfWavePlate]: {
    description: 'It delays one polarization (with darker lines) by λ/2.',
    ascii: ['▤', '▨', '▥', '▧', '▤', '▨', '▥', '▧'],
  },
  [Elem.SugarSolution]: {
    description:
      'Table sugar is a chiral molecule – it does not look the same as its mirror reflection. We put it in an amount, so it rotates polarization by 45°.',
    ascii: ['S'],
  },
  [Elem.FaradayRotator]: {
    description:
      'Rotates polarization with magnetic field by 45°. Has different symmetries than Sugar Solution. A building block for optical diodes.',
    ascii: ['🠶', '🠵', '🠴', '🠷'],
  },
  [Elem.Glass]: {
    description:
      'Higher refractive index makes light slower. We set its thickness so it retards the phase by λ/4. Useful for changing interference.',
    ascii: ['↜'],
  },
  [Elem.VacuumJar]: {
    description:
      'Even air retards light a bit. We set the thickness of vacuum so it advances the phase by λ/4. Useful for changing interference.',
    ascii: ['↝'],
  },
}
