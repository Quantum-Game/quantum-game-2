import { IEntry } from '@/engine/interfaces'
import concepts from '@/assets/data/encyclopedia/concepts.json'
import elements from '@/assets/data/encyclopedia/elements.json'

// used by views/Info to render link lists:
export const elementNameList = Object.keys(elements)
export const conceptNameList = Object.keys(concepts)

// used by Encyclopedia Article
export function getEntry(name: string): IEntry {
  let entry
  if (elementNameList.includes(name)) {
    entry = elements[name as keyof typeof elements]
  } else if (conceptNameList.includes(name)) {
    entry = concepts[name as keyof typeof concepts]
  } else {
    throw new Error(`Encyclopedia Entry not found: ${name}`)
  }
  return entry
}
