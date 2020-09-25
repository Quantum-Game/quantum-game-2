/**
 * File for game UI interfaces.
 */

import { Piece, Particle } from '@/engine/model'
import { tryGetString, tryGetInstance, isObject, tryGetObject } from '@/types'

/**
 * For hover infobox
 */
export type IInfoPayload =
  | { kind: 'piece'; piece: Piece; text?: string }
  | { kind: 'particles'; particles: Particle[]; text?: string }
  | { kind: 'ui'; text: string }

export function validateInfoPayload(payload: IInfoPayload): payload is IInfoPayload {
  if (!isObject(payload)) return false
  switch (tryGetString(payload, 'kind')) {
    case 'piece':
      return tryGetObject(payload, 'piece') !== null
    case 'particles':
      return tryGetInstance(payload, 'particles', Array) !== null
    case 'text':
      return tryGetString(payload, 'text') !== null
  }
  return false
}
