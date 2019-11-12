import { Elem, ElementInterface } from '@/engine/interfaces';

const jsonElements: ElementInterface[] = [
  {
    name: Elem.Laser,
    group: 'Source',
    description: 'An on-demand single photon source.',
    ascii: ['>', '^', '<', 'v']
  },
  {
    name: Elem.NonLinearCrystal,
    group: 'Source',
    description: 'A BBO crystal.',
    ascii: ['>', '^', '<', 'v']
  },
  {
    name: Elem.Rock,
    group: 'Absorption',
    description:
      "Dark and immersive as your sweetheart's depth of eyes. Absorbs light. And is sensitive.",
    ascii: ['♜']
  },
  {
    name: Elem.PolarizerH,
    group: 'Polarization',
    description:
      'A polarization filter WE...Anisotropic polymer strands capture electric oscillations parallel to them. Used in photography.',
    ascii: ['🡢', '🡥', '🡡', '🡤', '🡠', '🡧', '🡣', '🡦']
  },
  {
    name: Elem.PolarizerV,
    group: 'Polarization',
    description:
      'A polarization filter NS...Anisotropic polymer strands capture electric oscillations parallel to them. Used in photography.',
    ascii: ['🡢', '🡥', '🡡', '🡤', '🡠', '🡧', '🡣', '🡦']
  },
  {
    name: Elem.QuarterWavePlateH,
    group: 'Polarization',
    description:
      'It delays one polarization (with darker lines) by λ/4. When applied correctly, it can change linear polarization into circular, and vice versa.',
    ascii: ['🡪', '🡭', '🡩', '🡬', '🡨', '🡯', '🡫', '🡮']
  },
  {
    name: Elem.QuarterWavePlateV,
    group: 'Polarization',
    description:
      'It delays one polarization (with darker lines) by λ/4. When applied correctly, it can change linear polarization into circular, and vice versa.',
    ascii: ['🡪', '🡭', '🡩', '🡬', '🡨', '🡯', '🡫', '🡮']
  },
  {
    name: Elem.Detector,
    group: 'Absorption',
    description:
      'Detects and amplifies electric signal from each single photon, from a single direction. Your goal is to get photon there!',
    ascii: ['⭲', '⭱', '⭰', '⭳']
  },
  {
    name: Elem.DetectorFour,
    group: 'Absorption',
    description:
      'Detects and amplifies electric signal from each single photon, from all directions. Typically, it is the goal to get the photon here.',
    ascii: ['O']
  },
  {
    name: Elem.SugarSolution,
    group: 'Polarization',
    description:
      'Table sugar is a chiral molecule – it does not look the same as its mirror reflection. We put it in an amount, so it rotates polarization by 45°.',
    ascii: ['S']
  },
  {
    name: Elem.CoatedBeamSplitter,
    group: 'Direction',
    description:
      'A thin slab of glass with a reflective layer - reflecting half the beam and transmitting the other half of it.',
    ascii: ['⇒', '⇗', '⇑', '⇖', '⇐', '⇙', '⇓', '⇘']
  },
  {
    name: Elem.Mine,
    group: 'Absorption',
    description:
      'Once it absorbs a single photon, it sets off. Old french submarine captains can sometimes disarm them.',
    ascii: ['!']
  },
  {
    name: Elem.PolarizingBeamSplitter,
    group: 'Direction',
    description: 'Reflects vertical polarization (↕), transmitts horizonal polarization (↔).',
    ascii: ['⬲', '⟴']
  },
  {
    name: Elem.CornerCube,
    group: 'Direction',
    description: 'Reflects any incoming photon.',
    ascii: ['*']
  },
  {
    name: Elem.Mirror,
    group: 'Direction',
    description: 'Metallic or dielectric mirror.',
    ascii: ['-', '/', '|', '\\', '-', '/', '|', '\\']
  },
  {
    name: Elem.BeamSplitter,
    group: 'Direction',
    description:
      'A thin slab of glass reflecting half the beam, and transmitting other half of it.',
    ascii: ['→', '↗', '↑', '↖', '←', '↙', '↓', '↘']
  },
  {
    name: Elem.Glass,
    group: 'Phase',
    description:
      'Higher refractive index makes light slower. We set its thickness so it retards the phase by λ/4. Useful for changing interference.',
    ascii: ['↜']
  },
  {
    name: Elem.VacuumJar,
    group: 'Phase',
    description:
      'Even air retards light a bit. We set the thickness of vacuum so it advances the phase by λ/4. Useful for changing interference.',
    ascii: ['↝']
  },
  {
    name: Elem.Absorber,
    group: 'Absorption',
    description: 'Filter with 50% absorption probability.',
    ascii: ['░']
  },
  {
    name: Elem.Void,
    group: 'Basic',
    description: 'The void...',
    ascii: ['.']
  },
  {
    name: Elem.Wall,
    group: 'Basic',
    description: 'A standard wall.',
    ascii: ['▓']
  },
  {
    name: Elem.Gate,
    group: 'Basic',
    description: 'A gate that opens when an adjacent detector is active.',
    ascii: ['W', 'M']
  },
  {
    name: Elem.FaradayRotator,
    group: 'Polarization',
    description:
      'Rotates polarization with magnetic field by 45°. Has different symmetries than Sugar Solution. A building block for optical diodes.',
    ascii: ['🠶', '🠵', '🠴', '🠷']
  }
];

export default jsonElements;
