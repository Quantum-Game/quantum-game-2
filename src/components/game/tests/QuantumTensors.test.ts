import Complex, { Cx } from "../../node_modules/quantum-tensors/src/Complex"
import Dimension from "../../node_modules/quantum-tensors/src/Dimension"
import Vector from "../../node_modules/quantum-tensors/src/Vector"
// import Operator from "../../node_modules/quantum-tensors/src/Operator"

describe("Complex", () => {
  it("should create complex numbers from Piotr code...", () => {
    const c1 = Cx(1);
    const c2 = Cx(0);
    const c3 = Cx(2, 1);
    const c4 = Cx(1)
    expect(c1 instanceof Complex).toBe(true);
    expect(c1.re).toEqual(1);
    expect(c1.im).toEqual(0);
    expect(c2 instanceof Complex).toBe(true);
    expect(c2.re).toEqual(0);
    expect(c2.im).toEqual(0);
    expect(c3 instanceof Complex).toBe(true);
    expect(c3.re).toEqual(2);
    expect(c3.im).toEqual(1);
    expect(c4 instanceof Complex).toBe(true);
    expect(c4.re).toEqual(1);
    expect(c4.im).toEqual(0);
});

it("should create dimensions from Piotr code...", () => {
    const dim1 = Dimension.direction()
    const dim2 = Dimension.spin()
    const vector1 = Vector.fromArray([Cx(1), Cx(0), Cx(2, 1), Cx(0, -1)], [dim1], false)
    const vector2 = Vector.fromArray([Cx(0, 0.5), Cx(1)], [dim2], false)
    console.log(vector1.toString())
    console.log(vector2.toString())
    expect(true).toEqual(true);    
  });

});
