import Absorber from './Absorber.vue';
import BeamSplitter from './BeamSplitter.vue';
import Mine from './Mine.vue';
import CoatedBeamSplitter from './CoatedBeamSplitter.vue';
import Detector from './Detector.vue';
import Laser from './Laser.vue';
import Glass from './Glass.vue';
import Mirror from './Mirror.vue';
import DetectorFour from './DetectorFour.vue';
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
export { Mine };
export { CoatedBeamSplitter };
export { Detector };
export { Laser };
export { Glass };
export { Mirror };
export { DetectorFour };
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
	Laser,
	Mirror,
	BeamSplitter,
	PolarizingBeamSplitter,
	CoatedBeamSplitter,
	Absorber,
	Mine,
	Detector,
	Glass,
	DetectorFour,
	PolarizerV,
	Polarizer45,
	PolarizerH,
	Polarizer135,
	Rock,
	SugarSolution,
	VacuumJar,
	WavePlateV,
	WavePlate45,
	WavePlateH,
	WavePlate135
};

export default PiecesList;
