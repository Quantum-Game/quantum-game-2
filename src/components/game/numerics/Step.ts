// create state
// loop of
// - make it pass through U
// - propagate
// - note detection ptobabilities

import _ from "lodash";
import Vector from "./Vector";
import Operator from "./Operator";
import Dimension from "./Dimension";
import { Cx } from "./Complex";

export default class Photons {
	readonly sizeX: number;
	readonly sizeY: number;
	vector: Vector;
	nPhotons: number;
	readonly dimX: Dimension;
	readonly dimY: Dimension;

	constructor(sizeX: number, sizeY: number) {
		this.sizeX = sizeX;
		this.sizeY = sizeY;
		this.vector = new Vector([], []);
		this.nPhotons = 0;
		this.dimX = Dimension.position(sizeX, "x");
		this.dimY = Dimension.position(sizeY, "y");
	}

	createPhoton(posX: number, posY: number, dir: string, pol: string): Vector {
		const dimensions = [this.dimX, this.dimY, Dimension.direction(), Dimension.polarization()];
		const state = [posX.toString(), posY.toString(), dir, pol];

		return Vector.indicator(dimensions, state);
	}

	addPhotonIndicator(posX: number, posY: number, dir: string, pol: string) {
		// for now, let's assume these are:
		// - perpendicular (otherwise would need creation-operator-like weightging)
		// - just two (otherwise would need dimension permutation OR outer with positios inside)
		const newPhoton = this.createPhoton(posX, posY, dir, pol);
		const oldPhotons = this.vector;
		this.nPhotons += 1;
		if (this.nPhotons === 1) {
			this.vector = newPhoton;
		} else if (this.nPhotons === 2) {
			if (!newPhoton.dot(this.vector).isZero) {
				throw `Adding photons not yet implemented for non-ortogonal states. Old photon:\n${this.vector}\nand new photon:\n${newPhoton}`;
			}
			this.vector = Vector.add([oldPhotons.outer(newPhoton), newPhoton.outer(oldPhotons)]).mulConstant(
				Cx(Math.SQRT1_2)
			);
		} else {
			throw `Adding 3 or more particles not yet implemented`;
		}
	}

	createPhotonPropagator() {
		const dir = Dimension.direction();
		const dimX = this.dimX;
		const dimY = this.dimY;

		return Operator.add([
			Operator.outer([Operator.shift(dimX, +1), Operator.identity([dimY]), Operator.indicator([dir], [">"])]),
			Operator.outer([Operator.shift(dimX, -1), Operator.identity([dimY]), Operator.indicator([dir], ["<"])]),
			Operator.outer([Operator.identity([dimX]), Operator.shift(dimY, +1), Operator.indicator([dir], ["v"])]),
			Operator.outer([Operator.identity([dimX]), Operator.shift(dimY, -1), Operator.indicator([dir], ["^"])])
		]);
	}

	propagatePhotons() {
		const photonPropagator = this.createPhotonPropagator();
		_.range(this.nPhotons).forEach(i => {
			this.vector = photonPropagator.mulVecPartial([4 * i, 4 * i + 1, 4 * i + 2], this.vector);
		});
	}

	createLocalizedOperator(op: Operator, posX: number, posY: number) {
		return Operator.outer([Operator.indicator([this.dimX, this.dimY], [`${posX}`, `${posY}`]), op]);
	}

	createSinglePhotonInteraction(opsWithPos: [number, number, Operator][]) {
		// some space for improvement with avoiding identity (direct sum structure)
		const localizedOpsShifted = opsWithPos.map((x: [number, number, Operator]) => {
			const [posX, posY, op] = x;
			const shiftedOp = op.sub(Operator.identity([Dimension.direction(), Dimension.polarization()]));
			return this.createLocalizedOperator(shiftedOp, posX, posY);
		});

		return Operator.add([
			Operator.identity([this.dimX, this.dimY, Dimension.direction(), Dimension.polarization()]),
			...localizedOpsShifted
		]);
	}

	actOnSinglePhotons(opsWithPos: [number, number, Operator][]) {
		const singlePhotonInteraction = this.createSinglePhotonInteraction(opsWithPos);
		_.range(this.nPhotons).forEach(i => {
			this.vector = singlePhotonInteraction.mulVecPartial([4 * i, 4 * i + 1, 4 * i + 2, 4 * i + 3], this.vector);
		});
	}
}
