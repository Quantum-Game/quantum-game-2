import Absorber from './Absorber.vue';
import BeamSplitter from './BeamSplitter.vue';
import Mine from './Mine.vue';
import CoatedBeamSplitter from './CoatedBeamSplitter.vue';
import CornerCube from './CornerCube.vue';
import Detector from './Detector.vue';
import Laser from './Laser.vue';
import Glass from './Glass.vue';
import Mirror from './Mirror.vue';
import DetectorFour from './DetectorFour.vue';
import Polarizer from './Polarizer.vue';
import PolarizingBeamSplitter from './PolarizingBeamSplitter.vue';
import Rock from './Rock.vue';
import SugarSolution from './SugarSolution.vue';
import VacuumJar from './VacuumJar.vue';
import QuarterWavePlate from './QuarterWavePlate.vue';
import FaradayRotator from './FaradayRotator.vue';

export { Absorber };
export { BeamSplitter };
export { Mine };
export { CoatedBeamSplitter };
export { CornerCube };
export { Detector };
export { Laser };
export { Glass };
export { Mirror };
export { DetectorFour };
export { Polarizer };
export { PolarizingBeamSplitter };
export { Rock };
export { SugarSolution };
export { VacuumJar };
export { QuarterWavePlate };
export { FaradayRotator };

interface ICellList {
	[index: string]: Object;
}

const CellList: ICellList = {
	Laser,
	Mirror,
	BeamSplitter,
	PolarizingBeamSplitter,
	CoatedBeamSplitter,
	CornerCube,
	Detector,
	Rock,
	Mine,
	Absorber,
	DetectorFour,
	Polarizer,
	QuarterWavePlate,
	SugarSolution,
	Glass,
	VacuumJar,
	FaradayRotator
};

export default CellList;
