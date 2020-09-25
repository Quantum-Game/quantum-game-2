import rockTalkData from '@/assets/data/rock_talk/rock_talk.json'

export interface RockTalk {
  id: string
  graphics: string
  dialogue: string[]
  link: string
}

export const rockTalks: RockTalk[] = rockTalkData

/**
 * Used by GamePage. Takes a current level ID and
 * checks whether there should be an overlay coming afterwards.
 * @param id an level id, corresponding to the
 * postLevelOverlayMapping overlay index
 * @returns a rocktalk entry or null, if there isn't any
 * with given ID.
 */

/**
 * Used by InterLevelOverlay to establish rock dialogues.
 * @param id an id of an overlay
 * @returns a rocktalk entry or null, if there isn't any
 * with given ID.
 */
export function getRockTalkById(id: string): RockTalk {
  const rockTalk = rockTalks.find((rockTalk) => rockTalk.id === id)
  const defaultRockTalk: RockTalk = {
    id: 'default',
    graphics: 'weasel',
    dialogue: ['There is...', '..not rock.'],
    link: '',
  }
  return rockTalk || defaultRockTalk
}
