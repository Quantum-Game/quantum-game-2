import { isObject, hasProperty, isInteger } from '@/types'
import { markRaw } from 'vue'
import { Direction } from './direction'

const packBuffer = new Int8Array(2)
const keyView = new Int16Array(packBuffer.buffer)

/**
 * A Coord class.
 *
 * Coordinate is a basic class allowing to place elements on the grid
 * The grid goes from top-left at `(0,0)` to bottom right at `(width-1,height-1)`

 * ```
 * Coord {
 *   readonly x: number
 *   readonly y: number
 * }
 * ```
 *
 * Create new instances using `Coord.new` or `Coord.import`.
 * The `x` and `y` properties must be integers in range [-128, 127].
 * That assumption is checked at construction time.
 *
 *
 * It's an interned class, it's instances are deduplicated globally.
 * That means the equality can be tested directly and it is safe to use
 * Coord instances as Map keys.
 *
 * Note that every Coord ever created stays in the internal cache forever.
 * This works under an assumption that there aren't that many unique coords
 * ever created in the application lifetime.
 *
 */
export class Coord {
  private static instances = new Map<number, Coord>()
  /**
   * `Coord` constructor is private, use `Coord.new` instead.
   */
  private constructor(public readonly x: number, public readonly y: number) {}

  private static newUnchecked(x: number, y: number): Coord {
    packBuffer[0] = x
    packBuffer[1] = y
    const hashKey = keyView[0]
    const interned = Coord.instances.get(hashKey)
    if (interned != null) {
      return interned
    }

    const newInstance = markRaw(new Coord(x, y))
    Coord.instances.set(hashKey, newInstance)
    return newInstance
  }

  /**
   * Create new `Coord`.
   * Multiple invocations with the same parameters are guaranteed to return the same instance.
   */
  static new(x: number, y: number): Coord {
    if (!Coord.validateProp(x) || !Coord.validateProp(y)) {
      throw new Error(`Trying to create Coord with invalid values [${x}, ${y}]`)
    }
    return Coord.newUnchecked(x, y)
  }

  /**
   * Validation function for emit types
   * @param coord potential Coord value
   */
  static validate(coord: Coord): coord is Coord {
    return coord instanceof Coord
  }

  private static validateProp(x: unknown): x is number {
    return isInteger(x) && x >= -128 && x <= 127
  }

  /**
   * Import coordinate from unknown data type.
   * Expects and validates `{ x: number, y: number }`
   */
  static import(coord: unknown): Coord | null {
    if (
      isObject(coord) &&
      hasProperty(coord, 'x') &&
      hasProperty(coord, 'y') &&
      Coord.validateProp(coord.x) &&
      Coord.validateProp(coord.y)
    ) {
      return Coord.newUnchecked(coord.x, coord.y)
    } else {
      console.warn(`Invalid coord ${JSON.stringify(coord)}`)
      return null
    }
  }

  export(): { x: number; y: number } {
    return { x: this.x, y: this.y }
  }

  /**
   * Get the center of grid tile with given coord.
   */
  gridCenter(gridSize = 64): { x: number; y: number } {
    return {
      x: (this.x + 0.5) * gridSize,
      y: (this.y + 0.5) * gridSize,
    }
  }

  gridTopLeft(gridSize = 64): { x: number; y: number } {
    return {
      x: this.x * gridSize,
      y: this.y * gridSize,
    }
  }

  /**
   * Get the neighbouring grid cell at given direction
   * @param direction
   */
  neighbour(direction: Direction): Coord {
    switch (direction) {
      case Direction.Right:
        return Coord.new(this.x + 1, this.y)
      case Direction.Up:
        return Coord.new(this.x, this.y - 1)
      case Direction.Left:
        return Coord.new(this.x - 1, this.y)
      case Direction.Down:
        return Coord.new(this.x, this.y + 1)
    }
  }

  /**
   * Enumerate all coordinates on given board with specified dimensions
   * @returns iterator of coords
   */
  static enumerate(width: number, height: number): IterableIterator<Coord> {
    if (!Coord.validateProp(width) || !Coord.validateProp(height)) {
      throw new Error(`Invalid dimensions [${width}, ${height}]`)
    }

    const max = width * height
    let i = 0
    const retIter = {
      [Symbol.iterator]() {
        return retIter
      },
      next() {
        if (i < max) {
          const x = i % width
          const y = (i - x) / width
          i += 1
          return {
            done: false,
            value: Coord.newUnchecked(x, y),
          } as const
        } else {
          return { done: true, value: null } as const
        }
      },
    }
    return retIter
  }
}
