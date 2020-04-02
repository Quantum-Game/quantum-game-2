import rockTalkData from '@/assets/data/rock_talk/rock_talk.json'

/**
 * rock talk entry type casts:
 */
interface IDialogueLine {
  content: string
  color: string
}

export interface IRockTalk {
  id: string
  type: string
  dialogue: IDialogueLine[]
}

export const rockTalk: IRockTalk[] = [...rockTalkData]

/**
 * mapping of level IDs against the overlays coming afterwards
 */
export const postLevelOverlayMapping: {
  [key: number]: string
} = {
  4: 'superposition',
  6: 'interference',
  31: 'end'
}

/**
 * Used by GamePage. Takes a current level ID and
 * checks whether there should be an overlay coming afterwards.
 * @param id an level id, corresponding to the
 * postLevelOverlayMapping overlay index
 * @returns an overlay name (string) or null
 * if there is no overlay to display
 */
export const getOverlayNameByLevelId = (id: number): string | null => {
  return postLevelOverlayMapping[id] || null
}

/**
 * Used by InterLevelOverlay to establish rock dialogues.
 * @param id an id of an overlay
 * @returns a rocktalk entry or null, if there isn't any
 * with given ID.
 */
export const getRockTalkById = (id: string): IRockTalk | null => {
  const rtEntry = rockTalk.find((x) => x.id === id)
  return rtEntry || null
}

export default {
  ...rockTalk,
  postLevelOverlayMapping,
  getOverlayNameByLevelId,
  getRockTalkById
}
