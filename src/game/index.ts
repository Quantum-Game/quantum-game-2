import Photon from './Photon.vue';
import QCell from './QCell.vue';

interface IComponentsList {
	[index: string]: Object;
}

export { QCell, Photon };

const typedComponentsList: IComponentsList = { QCell, Photon };

export default typedComponentsList;
