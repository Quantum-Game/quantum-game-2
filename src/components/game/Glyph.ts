export class Glyph {
  public character: string;
  public backgroundColor: string;
  public foregroundColor: string;
  public tile: [number, number];

  constructor(
    character: string,
    tile: [number, number],
    backgroundColor = "black",
    foregroundColor = "white"
  ) {
    this.character = character;
    this.backgroundColor = backgroundColor;
    this.foregroundColor = foregroundColor;
    this.tile = tile;
  }
}
