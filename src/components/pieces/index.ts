import Absorber from './Absorber.vue';
import BeamSplitter from './BeamSplitter.vue';
import Bomb from './Bomb.vue';
import CoatedBeamSplitter from './CoatedBeamSplitter.vue';
import Detector from './Detector.vue';
import Laser from './Laser.vue';
import GlassSlab from './GlassSlab.vue';
import Mirror from './Mirror.vue';
import OmniDetector from './OmniDetector.vue';
import PolarizerV from './PolarizerV.vue';
import Polarizer45 from './Polarizer45.vue';
import PolarizerH from './PolarizerH.vue';
import Polarizer135 from './Polarizer135.vue';
import PolarizingBeamSplitter from './PolarizingBeamSplitter.vue';
import Rock from './Rock.vue';
import SugarSolution from './SugarSolution.vue';
import VacuumJar from './VacuumJar.vue';
import WavePlateV from './WavePlateV.vue';
import WavePlate45 from './WavePlate45.vue';
import WavePlateH from './WavePlateH.vue';
import WavePlate135 from './WavePlate135.vue';

export { Absorber };
export { BeamSplitter };
export { Bomb };
export { CoatedBeamSplitter };
export { Detector };
export { Laser };
export { GlassSlab };
export { Mirror };
export { OmniDetector };
export { PolarizerV };
export { Polarizer45 };
export { PolarizerH };
export { Polarizer135 };
export { PolarizingBeamSplitter };
export { Rock };
export { SugarSolution };
export { VacuumJar };
export { WavePlateV };
export { WavePlate45 };
export { WavePlateH };
export { WavePlate135 };

interface IPiecesList {
	[index: string]: Object;
}

const PiecesList: IPiecesList = {
	Absorber,
	BeamSplitter,
	Bomb,
	CoatedBeamSplitter,
	Detector,
	Laser,
	GlassSlab,
	Mirror,
	OmniDetector,
	PolarizerV,
	Polarizer45,
	PolarizerH,
	Polarizer135,
	PolarizingBeamSplitter,
	Rock,
	SugarSolution,
	VacuumJar,
	WavePlateV,
	WavePlate45,
	WavePlateH,
	WavePlate135
};

export default PiecesList;
