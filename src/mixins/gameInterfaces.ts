/**
 * File for game UI interfaces.
 */

import { Cell, Particle } from '@/engine/classes'
import { has } from 'lodash'
import { hasKey, hasKeyType, hasKeyInstance } from '@/types'

/**
 * For hover infobox
 */
export interface IInfoPayload {
  kind: string
  cell?: Cell
  particles: Particle[]
  text: string
}

export function validateInfoPayload(payload: unknown): payload is IInfoPayload {
  return (
    hasKeyType(payload, 'kind', 'string') &&
    (hasKey(payload, 'cell') ? hasKeyInstance(payload, 'cell', Cell) : true) &&
    hasKeyInstance(payload, 'particles', Array) &&
    hasKeyType(payload, 'text', 'string')
  )
}
