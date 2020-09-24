export const enum Rotation {
  Right,
  UpRight,
  Up,
  UpLeft,
  Left,
  DownLeft,
  Down,
  DownRight,
}

export function rotationFromDegrees(rot: number): Rotation {
  switch ((rot + 360) % 360) {
    case 0:
      return Rotation.Right
    case 45:
      return Rotation.UpRight
    case 90:
      return Rotation.Up
    case 135:
      return Rotation.UpLeft
    case 180:
      return Rotation.Left
    case 225:
      return Rotation.DownLeft
    case 270:
      return Rotation.Down
    case 315:
      return Rotation.DownRight
    default:
      throw new Error(`Invalid rotation angle ${rot}`)
  }
}

export function rotationToDegrees(rot: Rotation): number {
  switch (rot) {
    case Rotation.Right:
      return 0
    case Rotation.UpRight:
      return 45
    case Rotation.Up:
      return 90
    case Rotation.UpLeft:
      return 135
    case Rotation.Left:
      return 180
    case Rotation.DownLeft:
      return 225
    case Rotation.Down:
      return 270
    case Rotation.DownRight:
      return 315
  }
}
