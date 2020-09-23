import { Elem, Group } from './interfaces'

interface ElementData {
  description: string
  group: Group
  ascii: string[]
  angles: number[]
}

export const elementsData: Record<Elem, ElementData> = {
  [Elem.Void]: {
    group: Group.Basic,
    description: 'The void...',
    ascii: ['.'],
    angles: [0],
  },
  [Elem.Wall]: {
    group: Group.Absorption,
    description: 'Another brick in the wall.',
    ascii: ['▓'],
    angles: [0],
  },
  [Elem.Gate]: {
    group: Group.Absorption,
    description: 'A gate that can be opened if next to a fed plant.',
    ascii: ['M'],
    angles: [0],
  },
  [Elem.Laser]: {
    group: Group.Source,
    description: 'An on-demand single photon source.',
    ascii: ['>', '^', '<', 'v'],
    angles: [0, 90, 180, 270],
  },
  [Elem.NonLinearCrystal]: {
    group: Group.Source,
    description: 'A BBO crystal.',
    ascii: ['>', '^', '<', 'v'],
    angles: [0, 90, 180, 270],
  },
  [Elem.Mirror]: {
    group: Group.Direction,
    description: 'Metallic or dielectric mirror.',
    ascii: ['-', '/', '|', '\\', '-', '/', '|', '\\'],
    angles: [0, 45, 90, 135, 180, 225, 270, 315],
  },
  [Elem.BeamSplitter]: {
    group: Group.Direction,
    description:
      'A thin slab of glass reflecting half the beam, and transmitting other half of it.',
    ascii: ['→', '↗', '↑', '↖', '←', '↙', '↓', '↘'],
    angles: [0, 45, 90, 135, 180, 225, 270, 315],
  },
  [Elem.PolarizingBeamSplitter]: {
    group: Group.Direction,
    description: 'Reflects vertical polarization (↕), transmits horizonal polarization (↔).',
    ascii: ['⬲', '⟴'],
    angles: [0, 90, 180, 270],
  },
  [Elem.CoatedBeamSplitter]: {
    group: Group.Direction,
    description:
      'A thin slab of glass with a reflective layer - reflecting half the beam and transmitting the other half of it.',
    ascii: ['⇒', '⇗', '⇑', '⇖', '⇐', '⇙', '⇓', '⇘'],
    angles: [0, 45, 90, 135, 180, 225, 270, 315],
  },
  [Elem.CornerCube]: {
    group: Group.Direction,
    description: 'Reflects any incoming photon.',
    ascii: ['X'],
    angles: [0],
  },
  [Elem.Detector]: {
    group: Group.Absorption,
    description:
      'Detects and amplifies electric signal from each single photon, from a single direction. Your goal is to get photon there!',
    ascii: ['⭲', '⭱', '⭰', '⭳'],
    angles: [0, 90, 180, 270],
  },
  [Elem.Rock]: {
    group: Group.Absorption,
    description:
      "Dark and immersive as your sweetheart's depth of eyes. Absorbs light. And is sensitive.",
    ascii: ['♜'],
    angles: [0],
  },
  [Elem.Mine]: {
    group: Group.Absorption,
    description:
      'Once it absorbs a single photon, it sets off. Old french submarine captains can sometimes disarm them.',
    ascii: ['!'],
    angles: [0],
  },
  [Elem.Absorber]: {
    group: Group.Absorption,
    description: 'Filter with 50% absorption probability.',
    ascii: ['A'],
    angles: [0],
  },
  [Elem.DetectorFour]: {
    group: Group.Absorption,
    description:
      'Detects and amplifies electric signal from each single photon, from all directions. Typically, it is the goal to get the photon here.',
    ascii: ['O'],
    angles: [0],
  },
  [Elem.Polarizer]: {
    group: Group.Polarization,
    description:
      'A polarization filter... Anisotropic polymer strands capture electric oscillations parallel to them. Used in photography.',
    ascii: ['▤', '▨', '▥', '▧', '▤', '▨', '▥', '▧'],
    angles: [0, 45, 90, 135, 180, 225, 270, 315],
  },
  [Elem.QuarterWavePlate]: {
    group: Group.Polarization,
    description:
      'It delays one polarization (with darker lines) by λ/4. When applied correctly, it can change linear polarization into circular, and vice versa.',
    ascii: ['▤', '▨', '▥', '▧', '▤', '▨', '▥', '▧'],
    angles: [0, 45, 90, 135, 180, 225, 270, 315],
  },
  [Elem.HalfWavePlate]: {
    group: Group.Polarization,
    description: 'It delays one polarization (with darker lines) by λ/2.',
    ascii: ['▤', '▨', '▥', '▧', '▤', '▨', '▥', '▧'],
    angles: [0, 45, 90, 135, 180, 225, 270, 315],
  },
  [Elem.SugarSolution]: {
    group: Group.Polarization,
    description:
      'Table sugar is a chiral molecule – it does not look the same as its mirror reflection. We put it in an amount, so it rotates polarization by 45°.',
    ascii: ['S'],
    angles: [0],
  },
  [Elem.FaradayRotator]: {
    group: Group.Polarization,
    description:
      'Rotates polarization with magnetic field by 45°. Has different symmetries than Sugar Solution. A building block for optical diodes.',
    ascii: ['🠶', '🠵', '🠴', '🠷'],
    angles: [0, 90, 180, 270],
  },
  [Elem.Glass]: {
    group: Group.Phase,
    description:
      'Higher refractive index makes light slower. We set its thickness so it retards the phase by λ/4. Useful for changing interference.',
    ascii: ['↜'],
    angles: [0],
  },
  [Elem.VacuumJar]: {
    group: Group.Phase,
    description:
      'Even air retards light a bit. We set the thickness of vacuum so it advances the phase by λ/4. Useful for changing interference.',
    ascii: ['↝'],
    angles: [0],
  },
}
