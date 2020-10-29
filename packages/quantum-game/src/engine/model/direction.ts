import { Rotation } from './rotation'

export const enum Direction {
  Right,
  Up,
  Left,
  Down,
}

export function directionToRotation(dir: Direction): Rotation {
  switch (dir) {
    case Direction.Right:
      return Rotation.Left
    case Direction.Up:
      return Rotation.Down
    case Direction.Left:
      return Rotation.Right
    case Direction.Down:
      return Rotation.Up
  }
}

/**
 * Compute photon masks in the event of direction change.
 * Output rotation points towards visible part of the photon.
 * @param oldDir old direction of propagation
 * @param newDir new direction of propagation
 * @returns null when direction wasn't changed (no masks)
 * @returns mask to apply for the photon
 */
export function directionChangeMask(oldDir: Direction, newDir: Direction): Rotation | null {
  if (oldDir === newDir) return null
  if (oldDir === reverseDirection(newDir)) {
    // mirror hit directly
    return directionToRotation(oldDir)
  } else {
    // mirror hit at an angle
    switch (oldDir) {
      case Direction.Right:
        return newDir === Direction.Up ? Rotation.UpLeft : Rotation.DownLeft
      case Direction.Up:
        return newDir === Direction.Right ? Rotation.DownRight : Rotation.DownLeft
      case Direction.Left:
        return newDir === Direction.Up ? Rotation.UpRight : Rotation.DownRight
      case Direction.Down:
        return newDir === Direction.Right ? Rotation.UpRight : Rotation.UpLeft
    }
  }
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
