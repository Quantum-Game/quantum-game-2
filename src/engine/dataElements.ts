import { Elem, ElementInterface } from '@/engine/interfaces';

const jsonElements: ElementInterface[] = [
  {
    // name: "Laser",
    name: Elem.Laser,
    group: 'Source',
    description: 'An on-demand single photon source.',
    active: true,
    absorption: 0,
    phase: 0,
    id: 0,
    ascii: ['>', '^', '<', 'v']
  },
  {
    // name: "Rock",
    name: Elem.Rock,
    group: 'Absorption',
    description:
      "Dark and immersive as your sweetheart's depth of eyes. Absorbs light. And is sensitive.",
    active: false,
    absorption: 1,
    phase: 0,
    id: 1,
    ascii: ['♜']
  },
  {
    // name: "PolarizerH",
    name: Elem.PolarizerH,
    group: 'Polarization',
    description:
      'A polarization filter WE...Anisotropic polymer strands capture electric oscillations parallel to them. Used in photography.',
    active: false,
    absorption: 0,
    phase: 0,
    id: 2,
    ascii: ['🡢', '🡥', '🡡', '🡤', '🡠', '🡧', '🡣', '🡦']
  },
  {
    // name: "PolarizerH",
    name: Elem.PolarizerV,
    group: 'Polarization',
    description:
      'A polarization filter NS...Anisotropic polymer strands capture electric oscillations parallel to them. Used in photography.',
    active: false,
    absorption: 0,
    phase: 0,
    id: 2,
    ascii: ['🡢', '🡥', '🡡', '🡤', '🡠', '🡧', '🡣', '🡦']
  },
  {
    // name: "QuarterWavePlateH",
    name: Elem.QuarterWavePlateH,
    group: 'Polarization',
    description:
      'It delays one polarization (with darker lines) by λ/4. When applied correctly, it can change linear polarization into circular, and vice versa.',
    active: false,
    absorption: 0,
    phase: 0,
    id: 3,
    ascii: ['🡪', '🡭', '🡩', '🡬', '🡨', '🡯', '🡫', '🡮']
  },
  {
    // name: "QuarterWavePlateH",
    name: Elem.QuarterWavePlateV,
    group: 'Polarization',
    description:
      'It delays one polarization (with darker lines) by λ/4. When applied correctly, it can change linear polarization into circular, and vice versa.',
    active: false,
    absorption: 0,
    phase: 0,
    id: 3,
    ascii: ['🡪', '🡭', '🡩', '🡬', '🡨', '🡯', '🡫', '🡮']
  },
  {
    // name: "Detector",
    name: Elem.Detector,
    group: 'Absorption',
    description:
      'Detects and amplifies electric signal from each single photon, from a single direction. Your goal is to get photon there!',
    active: false,
    absorption: 1,
    phase: 0,
    id: 4,
    ascii: ['⭲', '⭱', '⭰', '⭳']
  },
  {
    // name: "DetectorFour",
    name: Elem.DetectorFour,
    group: 'Absorption',
    description:
      'Detects and amplifies electric signal from each single photon, from all directions. Typically, it is the goal to get the photon here.',
    active: false,
    absorption: 1,
    phase: 0,
    id: 7,
    ascii: ['O']
  },
  {
    // name: "SugarSolution",
    name: Elem.SugarSolution,
    group: 'Polarization',
    description:
      'Table sugar is a chiral molecule – it does not look the same as its mirror reflection. We put it in an amount, so it rotates polarization by 45°.',
    active: false,
    absorption: 0,
    phase: 0,
    id: 8,
    ascii: ['S']
  },
  {
    // name: "CoatedBeamSplitter",
    name: Elem.CoatedBeamSplitter,
    group: 'Direction',
    description:
      'A thin slab of glass with a reflective layer - reflecting half the beam and transmitting the other half of it.',
    active: false,
    absorption: 0,
    phase: 0,
    id: 9,
    ascii: ['⇒', '⇗', '⇑', '⇖', '⇐', '⇙', '⇓', '⇘']
  },
  {
    // name: "Mine",
    name: Elem.Mine,
    group: 'Absorption',
    description:
      'Once it absorbs a single photon, it sets off. Old french submarine captains can sometimes disarm them.',
    active: false,
    absorption: 1,
    phase: 0,
    id: 11,
    ascii: ['!']
  },
  {
    // name: "PolarizingBeamSplitter",
    name: Elem.PolarizingBeamSplitter,
    group: 'Direction',
    description: 'Reflects vertical polarization (↕), transmitts horizonal polarization (↔).',
    active: false,
    absorption: 0,
    phase: 0,
    id: 12,
    ascii: ['⬲', '⟴']
  },
  {
    // name: "CornerCube",
    name: Elem.CornerCube,
    group: 'Direction',
    description: 'Reflects any incoming photon.',
    active: false,
    absorption: 0,
    phase: 0,
    id: 13,
    ascii: ['*']
  },
  {
    // name: "Mirror",
    name: Elem.Mirror,
    group: 'Direction',
    description: 'Metallic or dielectric mirror.',
    active: false,
    absorption: 0,
    phase: 0,
    id: 14,
    ascii: ['-', '/', '|', '\\', '-', '/', '|', '\\']
  },
  {
    // name: "BeamSplitter",
    name: Elem.BeamSplitter,
    group: 'Direction',
    description:
      'A thin slab of glass reflecting half the beam, and transmitting other half of it.',
    active: false,
    absorption: 0,
    phase: 0,
    id: 15,
    ascii: ['→', '↗', '↑', '↖', '←', '↙', '↓', '↘']
  },
  {
    // name: "Glass",
    name: Elem.Glass,
    group: 'Phase',
    description:
      'Higher refractive index makes light slower. We set its thickness so it retards the phase by λ/4. Useful for changing interference.',
    active: false,
    absorption: 0,
    phase: -0.25,
    id: 16,
    ascii: ['↜']
  },
  {
    // name: "VacuumJar",
    name: Elem.VacuumJar,
    group: 'Phase',
    description:
      'Even air retards light a bit. We set the thickness of vacuum so it advances the phase by λ/4. Useful for changing interference.',
    active: false,
    absorption: 0,
    phase: 0.25,
    id: 17,
    ascii: ['↝']
  },
  {
    // name: "Absorber",
    name: Elem.Absorber,
    group: 'Absorption',
    description: 'Filter with 50% absorption probability.',
    active: false,
    absorption: 0.5,
    phase: 0,
    id: 18,
    ascii: ['░']
  },
  {
    // name: "Void",
    name: Elem.Void,
    group: 'Basic',
    description: 'The void...',
    active: false,
    absorption: 0,
    phase: 0,
    id: 19,
    ascii: ['.']
  },
  {
    // name: "Wall",
    name: Elem.Wall,
    group: 'Basic',
    description: 'A standard wall.',
    active: false,
    absorption: 1,
    phase: 0,
    id: 20,
    ascii: ['▓']
  },
  {
    // name: "Gate",
    name: Elem.Gate,
    group: 'Basic',
    description: 'A gate that opens when an adjacent detector is active.',
    active: false,
    absorption: 1,
    phase: 0,
    id: 21,
    ascii: ['W', 'M']
  },
  {
    // name: "FaradayRotator",
    name: Elem.FaradayRotator,
    group: 'Polarization',
    description:
      'Rotates polarization with magnetic field by 45°. Has different symmetries than Sugar Solution. A building block for optical diodes.',
    active: false,
    absorption: 0,
    phase: -0.25,
    id: 30,
    ascii: ['🠶', '🠵', '🠴', '🠷']
  }
];

export default jsonElements;
