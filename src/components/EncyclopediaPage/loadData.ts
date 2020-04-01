import { IEntryList, IEntry } from '@/engine/interfaces'
import concepts from '@/assets/data/encyclopedia/concepts.json'
import elements from '@/assets/data/encyclopedia/elements.json'

export const typedElements: IEntryList = elements
export const typedConcepts: IEntryList = concepts

// used by views/Info to render link lists:
export const elementNameList = Object.keys(typedElements)
export const conceptNameList = Object.keys(typedConcepts)

// used by Encyclopedia Article
export function getEntry(name: string): IEntry {
  let entry
  if (elementNameList.includes(name)) {
    entry = typedElements[name]
  } else if (conceptNameList.includes(name)) {
    entry = typedConcepts[name]
  } else {
    throw new Error(`Encyclopedia Entry not found: ${name}`)
  }
  return entry
}
