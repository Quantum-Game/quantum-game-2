// VECTOR CLASS
// Tensor-aware named sparse complex vector

// VECTOR CLASS
// add
// dot product
// permute

import Complex, { Cx } from "./Complex";
import { VectorEntry, OperatorEntry } from "./Entry";
import Vector from "./Vector";
import Dimension from "./Dimension";
import _ from "lodash";

export default class Operator {
	entries: OperatorEntry[];
	dimensionsOut: Dimension[];
	dimensionsIn: Dimension[];

	// TODO: assume the entries are ordered
	constructor(entries: OperatorEntry[], dimensionsOut: Dimension[], dimensionsIn: Dimension[]) {
		this.entries = entries;
		this.dimensionsOut = dimensionsOut;
		this.dimensionsIn = dimensionsIn;
		// NOTE: usually out==in, how to account for that?
	}

	get dimensions() {
		return [this.dimensionsOut, this.dimensionsIn];
	}

	// Out/In nasty, but I don;t have a clear idea how to to it

	get sizeOut() {
		return this.dimensionsOut.map(dimension => dimension.size);
	}

	get sizeIn() {
		return this.dimensionsIn.map(dimension => dimension.size);
	}

	get totalSizeOut() {
		return this.sizeOut.reduce((a, b) => a * b);
	}

	get totalSizeIn() {
		return this.sizeIn.reduce((a, b) => a * b);
	}

	get namesOut() {
		return this.dimensionsOut.map(dimension => dimension.name);
	}

	get namesIn() {
		return this.dimensionsIn.map(dimension => dimension.name);
	}

	get coordNamesOut() {
		return this.dimensionsOut.map(dimension => dimension.coordNames);
	}

	get coordNamesIn() {
		return this.dimensionsIn.map(dimension => dimension.coordNames);
	}

	// Conjugate
	conj() {
		const entries = this.entries.map(
			entry => new OperatorEntry([...entry.coordOut], [...entry.coordIn], entry.value.conj())
		);
		return new Operator(entries, this.dimensionsOut, this.dimensionsIn);
	}

	// Transpose
	transpose() {
		const entries = this.entries.map(
			entry => new OperatorEntry([...entry.coordIn], [...entry.coordOut], entry.value)
		);
		return new Operator(entries, this.dimensionsIn, this.dimensionsOut);
	}

	// Transpose
	dag() {
		const entries = this.entries.map(
			entry => new OperatorEntry([...entry.coordIn], [...entry.coordOut], entry.value.conj())
		);
		return new Operator(entries, this.dimensionsIn, this.dimensionsOut);
	}

	// Outer product of vectors
	outer(m2: Operator): Operator {
		const m1 = this;
		const dimensionsOut: Dimension[] = m1.dimensionsOut.concat(m2.dimensionsOut);
		const dimensionsIn: Dimension[] = m1.dimensionsIn.concat(m2.dimensionsIn);
		const entries: OperatorEntry[] = [];

		m1.entries.forEach((entry1: OperatorEntry) =>
			m2.entries.forEach((entry2: OperatorEntry) => entries.push(entry1.outer(entry2)))
		);

		// local issues with TypeScipt/npm/NVM make it harder
		// const entries: OperatorEntry[] = m1.entries
		//  .flatMap((entry1: OperatorEntry) =>
		//     (m2.entries).map((entry2: OperatorEntry) =>
		//         entry1.outer(entry2)
		//     )
		// )
		return new Operator(entries, dimensionsOut, dimensionsIn);
	}

	add(m2: Operator) {
		// NOTE: may be overengineered for adding 2 vectors with this map-reduce approach

		const m1 = this;

		Dimension.checkDimensions(m1.dimensionsIn, m2.dimensionsIn);
		Dimension.checkDimensions(m1.dimensionsOut, m2.dimensionsOut);

		const entries = _.chain(m1.entries.concat(m2.entries))
			.groupBy((entry: OperatorEntry) => `${entry.coordOut.toString()}-${entry.coordIn.toString()} `)
			.values()
			.map((grouped: OperatorEntry[]) => {
				const coordOut = [...grouped[0].coordOut];
				const coordIn = [...grouped[0].coordIn];
				const value = grouped.map(entry => entry.value).reduce((a, b) => a.add(b));
				return new OperatorEntry(coordOut, coordIn, value);
			})
			.value();

		return new Operator(entries, m1.dimensionsOut, m1.dimensionsIn);
	}

	mulConstant(c: Complex): Operator {
		const entries = this.entries.map(entry => new OperatorEntry(entry.coordOut, entry.coordIn, entry.value.mul(c)));
		return new Operator(entries, this.dimensionsOut, this.dimensionsIn);
	}

	sub(m2: Operator) {
		return this.add(m2.mulConstant(Cx(-1)));
	}

	mulVec(v: Vector): Vector {
		const m: Operator = this;

		Dimension.checkDimensions(m.dimensionsIn, v.dimensions);

		const vValueMap = new Map<string, Complex>();
		v.cells.forEach(entry => {
			vValueMap.set(entry.coord.toString(), entry.value);
		});

		const entries = _.chain(m.entries)
			.groupBy((entry: OperatorEntry) => entry.coordOut.toString())
			.values()
			.map(
				(entries: OperatorEntry[]): VectorEntry => {
					const coordOut = entries[0].coordOut;
					const sum = entries
						.map(entry => {
							const coordInStr = entry.coordIn.toString();
							const val = vValueMap.get(coordInStr) || Cx(0);
							return entry.value.mul(val);
						})
						.reduce((a, b) => a.add(b));
					return new VectorEntry(coordOut, sum);
				}
			)
			.filter(entry => !entry.value.isZero())
			.value();

		return new Vector(entries, m.dimensionsOut);
	}

	mulVecPartial(coordIndices: number[], v: Vector) {
		// for now, the inside part is much from mulVec

		const m = this;

		// we can relax the sorted considtion later
		// it will involve some transposes
		// or maybe we can relax the sorted condition?
		if (
			!_.chain(coordIndices)
				.sortBy()
				.sortedUniq()
				.isEqual(coordIndices)
		) {
			throw `Entries of coordIndices ${coordIndices} are not sorted unique.`;
		}

		Dimension.checkDimensions(m.dimensionsIn, _.at(v.dimensions, coordIndices));

		const complementIndices = _.range(v.dimensions.length).filter(i => _.includes(coordIndices, i));

		// if m.dimensionsOut !== m.dimensionsIn
		const newDimensions = _.cloneDeep(v.dimensions);
		_.range(coordIndices.length).forEach(i => (newDimensions[coordIndices[i]] = m.dimensionsOut[i]));

		const newEntries = _.chain(v.cells)
			.groupBy(entry => _.at(entry.coord, complementIndices))
			.values()
			.map(vecEntries => {
				const vValueMap = new Map<string, Complex>();
				vecEntries.forEach(entry => {
					const reducedCoords = _.at(entry.coord, coordIndices);
					vValueMap.set(reducedCoords.toString(), entry.value);
				});

				return _.chain(m.entries)
					.groupBy((entry: OperatorEntry) => entry.coordOut.toString())
					.values()
					.map(
						(opEntries: OperatorEntry[]): VectorEntry => {
							// we need to create a full out coord
							// now it is lightly haky
							const coordOutPart = opEntries[0].coordOut;
							const coordOut = [...vecEntries[0].coord];
							_.range(coordIndices.length).forEach(i => (coordOut[coordIndices[i]] = coordOutPart[i]));

							const sum = opEntries
								.map(entry => {
									const coordInStr = entry.coordIn.toString();
									const val = vValueMap.get(coordInStr) || Cx(0);
									return entry.value.mul(val);
								})
								.reduce((a, b) => a.add(b));
							return new VectorEntry(coordOut, sum);
						}
					)
					.filter(entry => !entry.value.isZero())
					.value();
			})
			.flatten()
			.value();

		return new Vector(newEntries, v.dimensions);
	}

	// mulOp(m2: Operator): Operator {
	//     const m1 = this
	//     // TODO: check dimensions here
	//     const result = _
	//         .chain(v1.cells.concat(v2.cells))
	//         .groupBy((entry: VectorEntry) => entry.coord.toString())
	//         .values()
	//         .map((grouped: VectorEntry[]) => {
	//             if (grouped.length === 2) {
	//                 return (grouped[0].value).mul(grouped[1].value)
	//             } else {
	//                 return Cx(0, 0)
	//             }
	//         })
	//         .reduce((a, b) => a.add(b))
	//         .value()

	//     return result

	// }

	// TODO: Dense matrix visualisation
	toString(complexFormat = "cartesian", precision = 2, separator = " + "): string {
		const introStr = `Operator of max size [[${this.sizeOut}], [${this.sizeIn}]] with dimensions [[${this.namesOut}], [${this.namesIn}]]`;
		const valueStr = this.entries
			.map(entry => {
				const coordStrOut = entry.coordOut.map((i: number, dim: number) => this.coordNamesOut[dim][i]);
				const coordStrIn = entry.coordIn.map((i: number, dim: number) => this.coordNamesIn[dim][i]);
				return `${entry.value.toString(complexFormat, precision)} |${coordStrOut}⟩⟨${coordStrIn}|`;
			})
			.join(separator);

		return `${introStr}\n${valueStr}\n`;
	}

	static identity(dimensions: Dimension[]) {
		const sizes = dimensions.map(dimension => dimension.size);
		const totalSize = sizes.reduce((a, b) => a * b);

		const entries = _.range(totalSize).map(index =>
			OperatorEntry.fromIndexIndexValue(index, index, sizes, sizes, Cx(1, 0))
		);
		return new Operator(entries, dimensions, dimensions);
	}

	// https://en.wikipedia.org/wiki/Shift_matrix
	static shift(dimension: Dimension, shift: number) {
		const start = Math.max(0, -shift);
		const end = Math.min(dimension.size, dimension.size - shift);

		const entries = _.range(start, end).map(index =>
			OperatorEntry.fromIndexIndexValue(index + shift, index, [dimension.size], [dimension.size], Cx(1, 0))
		);
		return new Operator(entries, [dimension], [dimension]);
	}

	static zeros(dimensionsOut: Dimension[], dimensionsIn: Dimension[]) {
		return new Operator([], dimensionsOut, dimensionsIn);
	}

	// Loading from dense array list of cells
	static fromArray(
		denseArray: Complex[][],
		dimensionsOut: Dimension[],
		dimensionsIn: Dimension[],
		removeZeros: boolean = true
	): Operator {
		// Get size vector from dimensions
		const sizesOut = dimensionsOut.map(dimension => dimension.size);
		const totalSizeOut = sizesOut.reduce((a, b) => a * b);

		const sizesIn = dimensionsIn.map(dimension => dimension.size);
		const totalSizeIn = sizesIn.reduce((a, b) => a * b);

		const rowLengths = denseArray.map(row => row.length);
		if (_.min(rowLengths) !== _.max(rowLengths)) {
			throw new Error(`Is not a rectangular array. Row sizes ${_.min(rowLengths)} to ${_.max(rowLengths)}.`);
		}

		if (denseArray.length !== totalSizeOut || denseArray[0].length !== totalSizeIn) {
			throw new Error(
				`Dimension inconsistency: array is [${denseArray.length}, ${denseArray[0].length}] and dimensions total sizes are [${totalSizeOut}, ${totalSizeIn}]`
			);
		}

		const flatlist: [number, number, Complex][] = [];
		denseArray.forEach((row: Complex[], indexOut: number) =>
			row.forEach((value: Complex, indexIn: number) => flatlist.push([indexOut, indexIn, value]))
		);

		// Broken TypeScript on my compy, so
		// const entries: OperatorEntry[] = denseArray
		//     .flatMap((row: Complex[], indexOut: number): [number, number, Complex][] =>
		//         row.map((value: Complex, indexIn: number): [number, number, Complex] =>
		//             [indexOut, indexIn, value]
		//         )
		//     )
		const entries: OperatorEntry[] = flatlist
			.filter(([_indexOut, _indexIn, value]: [number, number, Complex]): boolean => !removeZeros || !value.isZero())
			.map(
				([indexOut, indexIn, value]: [number, number, Complex]): OperatorEntry =>
					OperatorEntry.fromIndexIndexValue(indexOut, indexIn, sizesOut, sizesIn, value)
			);

		return new Operator(entries, dimensionsOut, dimensionsIn);
	}

	// a operator with only one 1 on one diagonal element, rest zeros
	static indicator(dimensions: Dimension[], which: string[]): Operator {
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

		const entries = [new OperatorEntry(coords, coords, Cx(1))];
		return new Operator(entries, dimensions, dimensions);
	}

	// outer product for more
	static outer(ops: Operator[]): Operator {
		return ops.reduce((acc, x) => acc.outer(x));
	}

	// (can be optimized if needed)
	static add(ops: Operator[]): Operator {
		return ops.reduce((acc, x) => acc.add(x));
	}
}
