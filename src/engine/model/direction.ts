export const enum Direction {
  Right,
  Up,
  Left,
  Down,
}

export function reverseDirection(dir: Direction): Direction {
  switch (dir) {
    case Direction.Right:
      return Direction.Left
    case Direction.Up:
      return Direction.Down
    case Direction.Left:
      return Direction.Right
    case Direction.Down:
      return Direction.Up
  }
}

export function directionFromDegrees(rot: number): Direction {
  switch ((rot + 360) % 360) {
    case 0:
      return Direction.Right
    case 90:
      return Direction.Up
    case 180:
      return Direction.Left
    case 270:
      return Direction.Down
    default:
      throw new Error(`Invalid direction angle ${rot}`)
  }
}

export function directionToDegrees(rot: Direction): number {
  switch (rot) {
    case Direction.Right:
      return 0
    case Direction.Up:
      return 90
    case Direction.Left:
      return 180
    case Direction.Down:
      return 270
  }
}
