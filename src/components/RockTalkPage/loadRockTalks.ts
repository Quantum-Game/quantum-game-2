import rockTalkData from '@/assets/data/rock_talk/rock_talk.json'
import levelData from '@/assets/data/levels'
import { IDialogue } from '@/mixins/dataInterfaces'

export const rockTalks: IDialogue[] = [...rockTalkData]
export const levelIdToRockTalkId: (string | undefined)[] = levelData.map(
  (level) => level.rockTalkId
)

/**
 * Used by GamePage. Takes a current level ID and
 * checks whether there should be an overlay coming afterwards.
 * @param id an level id, corresponding to the
 * postLevelOverlayMapping overlay index
 * @returns a rocktalk entry or null, if there isn't any
 * with given ID.
 */
export function getRockTalkIdByLevelId(id: number): string | null {
  return levelIdToRockTalkId[id] || null
}

/**
 * Used by InterLevelOverlay to establish rock dialogues.
 * @param id an id of an overlay
 * @returns a rocktalk entry or null, if there isn't any
 * with given ID.
 */
export function getRockTalkById(id: string): IDialogue {
  const rockTalk = rockTalks.find((rockTalk) => rockTalk.id === id)
  const defaultRockTalk: IDialogue = {
    id: 'default',
    graphics: 'weasel',
    dialogue: ['There is...', '..not rock.'],
    link: '',
  }
  return rockTalk || defaultRockTalk
}
