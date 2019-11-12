import { EntryListInterface, EntryInterface } from '@/engine/interfaces';
import entries from './entries.json';

export const typedEntries: EntryListInterface = entries;

// used by views/Info to render the left menu:
export const entriesNameList = Object.keys(typedEntries);

// used by Encyclopedia Article
export function getEntry(name: string): EntryInterface {
  return typedEntries[name];
}
