/**
 * File for game UI interfaces.
 */

import { Cell, Particle } from '@/engine/classes'

/**
 * For hover infobox
 */
export interface IInfoPayload {
  kind: string
  cell?: Cell
  particles: Particle[]
  text: string
}
