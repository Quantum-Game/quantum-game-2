import Photon from './Photon.vue';
import Cell from './Cell.vue';

interface IComponentsList {
	[index: string]: Object;
}

export { Cell, Photon };

const typedComponentsList: IComponentsList = { Cell, Photon };

export default typedComponentsList;
