// VECTOR CLASS
// Tensor-aware named sparse complex vector

// VECTOR CLASS
// add
// dot product
// permute

import Complex, { Cx } from "./Complex";
import { VectorEntry } from "./Entry";
import Dimension from "./Dimension";
import _ from "lodash";

export default class Vector {
	cells: VectorEntry[];
	dimensions: Dimension[];

	// TODO: assume the cells are ordered
	constructor(cells: VectorEntry[], dimensions: Dimension[]) {
		this.cells = cells;
		this.dimensions = dimensions;
	}

	// Getters for dimensions
	get size() {
		return this.dimensions.map(dimension => dimension.size);
	}
	get totalSize() {
		return this.size.reduce((a, b) => a * b);
	}
	get names() {
		return this.dimensions.map(dimension => dimension.name);
	}
	get coordNames() {
		return this.dimensions.map(dimension => dimension.coordNames);
	}

	// Conjugate
	conj() {
		const entries = this.cells.map(cell => new VectorEntry([...cell.coord], cell.value.conj()));
		return new Vector(entries, this.dimensions);
	}

	add(v2: Vector) {
		// NOTE: may be overengineered for adding 2 vectors with this map-reduce approach

		const v1 = this;

		Dimension.checkDimensions(v1.dimensions, v2.dimensions);

		const entries = _.chain(v1.cells.concat(v2.cells))
			.groupBy((entry: VectorEntry) => entry.coord.toString())
			.values()
			.map((grouped: VectorEntry[]) => {
				const coord = [...grouped[0].coord];
				const value = grouped.map(entry => entry.value).reduce((a, b) => a.add(b));
				return new VectorEntry(coord, value);
			})
			.value();

		return new Vector(entries, v1.dimensions);
	}

	mulConstant(c: Complex): Vector {
		const entries = this.cells.map(entry => new VectorEntry(entry.coord, entry.value.mul(c)));
		return new Vector(entries, this.dimensions);
	}

	sub(v2: Vector) {
		return this.add(v2.mulConstant(Cx(-1)));
	}

	dot(v2: Vector): Complex {
		const v1 = this;

		Dimension.checkDimensions(v1.dimensions, v2.dimensions);

		const result = _.chain(v1.cells.concat(v2.cells))
			.groupBy((entry: VectorEntry) => entry.coord.toString())
			.values()
			.map((grouped: VectorEntry[]) => {
				if (grouped.length === 2) {
					return grouped[0].value.mul(grouped[1].value);
				} else {
					return Cx(0, 0);
				}
			})
			.reduce((a, b) => a.add(b))
			.value();

		return result;
	}

	// Outer product of vectors
	outer(v2: Vector): Vector {
		const v1 = this;
		const dimensions: Dimension[] = v1.dimensions.concat(v2.dimensions);
		const cells: VectorEntry[] = [];
		v1.cells.forEach((cell1: VectorEntry) =>
			v2.cells.forEach((cell2: VectorEntry) => cells.push(cell1.outer(cell2)))
		);
		return new Vector(cells, dimensions);
	}

	// TODO: Dense matrix visualisation
	toString(complexFormat = "cartesian", precision = 2, separator = " + "): string {
		const introStr = `Vector of max size [${this.size}] with dimensions [${this.names}]`;
		let valueStr = this.cells
			.map(cell => {
				const coordStr = cell.coord.map((i: number, dim: number) => this.coordNames[dim][i]);
				return `${cell.value.toString(complexFormat, precision)} |${coordStr}⟩`;
			})
			.join(separator);

		return `${introStr}\n${valueStr}\n`;
	}

	// Loading from dense array list of cells
	static fromArray(denseArray: Complex[], dimensions: Dimension[], removeZeros: boolean = true): Vector {
		// Get size vector from dimensions
		const sizes = dimensions.map(dimension => dimension.size);
		const totalSize = sizes.reduce((a, b) => a * b);
		if (denseArray.length !== totalSize) {
			throw new Error(`Dimension inconsistency: cell count ${denseArray.length} != total: ${totalSize}`);
		}

		// Map values to cells indices in a dense representation
		const cells: VectorEntry[] = denseArray
			.map((value: Complex, index: number): [number, Complex] => [index, value])
			.filter(([_index, value]: [number, Complex]): boolean => !removeZeros || !value.isZero())
			.map(([index, value]: [number, Complex]): VectorEntry => VectorEntry.fromIndexValue(index, sizes, value));

		return new Vector(cells, dimensions);
	}

	// a vector with only one 1, rest zeros
	static indicator(dimensions: Dimension[], which: string[]): Vector {
		if (dimensions.length !== which.length) {
			throw `dimensions.length (${dimensions.length}) !== which.length (${which.length})`;
		}

		const coords = _.range(dimensions.length).map(i => {
			const pos = dimensions[i].coordNames.indexOf(which[i]);
			if (pos < 0) {
				throw `${which[i]} not in ${dimensions[i].coordNames}`;
			}
			return pos;
		});

		const cells = [new VectorEntry(coords, Cx(1))];
		return new Vector(cells, dimensions);
	}

	// outer product for more
	static outer(vectors: Vector[]): Vector {
		return vectors.reduce((acc, x) => acc.outer(x));
	}

	// add for more (can be optimized)
	static add(vectors: Vector[]): Vector {
		return vectors.reduce((acc, x) => acc.add(x));
	}
}
