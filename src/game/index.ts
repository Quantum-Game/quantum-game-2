import Photon from './Photon.vue';
import QCell from './QCell.vue';
import SpeechBubble from './SpeechBubble.vue';

interface IComponentsList {
	[index: string]: Object;
}

export { QCell, Photon, SpeechBubble };

const typedComponentsList: IComponentsList = { QCell, Photon, SpeechBubble };

export default typedComponentsList;
