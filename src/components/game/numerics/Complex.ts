// COMPLEX NUMBER CLASS

const TAU = 2 * Math.PI;

export function Cx(re: number, im: number = 0): Complex {
	return new Complex(re, im);
}

export default class Complex {
	re: number;
	im: number;

	constructor(re: number, im: number = 0) {
		this.re = re;
		this.im = im;
	}

	get r(): number {
		return this.abs();
	}

	get phi(): number {
		return this.arg();
	}

	abs2(): number {
		return Math.pow(this.re, 2) + Math.pow(this.im, 2);
	}

	abs(): number {
		return Math.sqrt(Math.pow(this.re, 2) + Math.pow(this.im, 2));
	}

	arg(): number {
		let arg = Math.atan2(this.im, this.re);
		if (arg < 0) {
			arg += 2 * Math.PI;
		}
		return arg;
	}

	// Addition
	add(z2: Complex): Complex {
		const z1 = this;
		return new Complex(z1.re + z2.re, z1.im + z2.im);
	}

	//  Multiply
	mul(z2: Complex): Complex {
		const z1 = this;
		return new Complex(z1.re * z2.re - z1.im * z2.im, z1.re * z2.im + z1.im * z2.re);
	}

	// Complex conjugate
	conj(): Complex {
		return new Complex(this.re, -this.im);
	}

	// Normalize
	normalize(): Complex {
		const r = this.abs();
		return new Complex(this.re / r, this.im / r);
	}

	// Equality checker
	equal(z2: Complex): boolean {
		return this.re === z2.re && this.im === z2.im;
	}

	// Check for zero
	isZero(): boolean {
		return this.re === 0 && this.im === 0;
	}

	// Override toString() method
	toString(complexFormat: string = "cartesian", precision = 2): string {
		switch (complexFormat) {
			case "cartesian":
				return this.toStringCartesian(precision);
			case "polar":
				return this.toStringPolar(precision);
			case "polarTau":
				return this.toStringPolarTau(precision);
			default:
				throw new Error(`complexFormat '${complexFormat}' is not in ['cartesian', 'polar', 'polarTau'].`);
		}

		// NOTE: one below is not favoured by TypeScript
		// const mapping = {
		//     "cartesian": this.toStringCartesian,
		//     "radial": this.toStringPolar,
		//     "radialTau": this.toStringPolarTau,
		// }
		// return mapping[complexFormat](precision)
	}

	toStringCartesian(precision = 2): string {
		return `(${this.re.toFixed(precision)} ${this.im >= 0 ? "+" : ""}${this.im.toFixed(precision)}i)`;
	}

	toStringPolar(precision = 2): string {
		return `${this.r.toFixed(precision)} exp(${this.phi.toFixed(precision)}i)`;
	}

	toStringPolarTau(precision = 2): string {
		const rot = this.phi / TAU;
		return `${this.r.toFixed(precision)} exp(${rot.toFixed(precision)}τi)`;
	}
}
