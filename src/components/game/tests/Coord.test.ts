import Coord from "../Coord";

// Coordinates testing
describe("Coordinates", () => {
  xit("should generate adjacency list of a coord", () => {
    const coord = new Coord(4, 4);
    expect(coord.adjacent).toEqual([
      new Coord(4, 3),
      new Coord(3, 4),
      new Coord(3, 5),
      new Coord(3, 4)
    ]);
  });

  it("should test for adjacency of two coords", () => {
    const coord1 = new Coord(4, 4);
    const coord2 = new Coord(4, 5);
    expect(coord1.isAdjacent(coord2)).toBe(true);
    expect(coord2.isAdjacent(coord1)).toBe(true);
  });

  it("should test if a coord is included in a list of coords", () => {
    const coord1 = new Coord(4, 4);
    const coord2 = new Coord(4, 4);
    const coord3 = new Coord(4, 5);
    const coord4 = new Coord(5, 5);
    const coords = [coord2, coord3, coord4];
    expect(coord1.isIncludedIn(coords)).toBe(true);
  });

  it("should give the distance to the top edge from a coordinate", () => {
    const coord = new Coord(2, 0);
    const cols = 4;
    const rows = 3;
    expect(coord.distanceToExit(0, rows, cols)).toEqual(2);
  });

  it("should give the distance to the bottom edge from a coordinate", () => {
    const coord = new Coord(2, 0);
    const cols = 4;
    const rows = 3;
    expect(coord.distanceToExit(180, rows, cols)).toEqual(0);
  });

  it("should give the distance to the right edge from a coordinate", () => {
    const coord = new Coord(2, 0);
    const cols = 4;
    const rows = 3;
    expect(coord.distanceToExit(90, rows, cols)).toEqual(3);
  });

  it("should give the distance to the left edge from a coordinate", () => {
    const coord = new Coord(2, 0);
    const cols = 4;
    const rows = 3;
    expect(coord.distanceToExit(270, rows, cols)).toEqual(0);
  });
});
