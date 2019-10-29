import entries from './entries.json';

interface IEntryList {
	[index: string]: IEntry;
}

export interface ISection {
	title: string;
	content?: string;
	pics?: Array<string>;
}

interface IEntry {
	title: string;
	short?: string;
	sections: Array<ISection>;
}
export const typedEntries: IEntryList = entries;

// used by views/Info to render the left menu:
export const entriesNameList = Object.keys(typedEntries);

// used by info/Entry
export function getEntry(name: string): IEntry {
	return typedEntries[name];
}
