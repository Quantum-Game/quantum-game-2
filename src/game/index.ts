import Photon from './Photon.vue';
import Piece from './Piece.vue';
import Tile from './Tile.vue';
import Grid from './Grid.vue';

interface IComponentsList {
	[index: string]: Object;
}

export { Tile };
export { Piece };
export { Grid };

const typedComponentsList: IComponentsList = { Piece, Tile, Photon };

export default typedComponentsList;
