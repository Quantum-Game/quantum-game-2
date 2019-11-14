import { EntryListInterface, EntryInterface } from '@/engine/interfaces';
import relatedConcepts from './related-concepts.json';
import entries from './entries.json';

export const typedEntries: EntryListInterface = entries;
export const typedRelatedConcepts: any = relatedConcepts;

// used by views/Info to render link lists:
export const entriesNameList = Object.keys(typedEntries);
export const relatedConceptsNameList = Object.keys(typedRelatedConcepts);

// used by Encyclopedia Article
export function getEntry(name: string): EntryInterface {
  let entry;
  if (entriesNameList.includes(name)) {
    entry = typedEntries[name];
  } else if (relatedConceptsNameList.includes(name)) {
    entry = typedRelatedConcepts[name];
  } else {
    console.error(`no entry of name ${name} found!`);
  }
  return entry;
}
