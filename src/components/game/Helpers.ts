// Convert angles to unicode symbols
// https://en.wikipedia.org/wiki/Template:Unicode_chart_Arrows
export function angleToSymbol(angle: number): string {
	angle = angle % 360;
	switch (angle) {
		case 0:
			return "↑";
		case 45:
			return "↗";
		case 90:
			return "→";
		case 135:
			return "↘";
		case 180:
			return "↓";
		case 225:
			return "↙";
		case 270:
			return "←";
		case 315:
			return "↖";
		default:
			throw new Error("Something is wrong with provided angle.");
	}
}

export function symbolToAngle(direction: string): number {
	switch (direction) {
		case "↑":
			return 0;
		case "↗":
			return 45;
		case "→":
			return 90;
		case "↘":
			return 135;
		case "↓":
			return 180;
		case "↙":
			return 225;
		case "←":
			return 270;
		case "↖":
			return 315;
		default:
			throw new Error("Something is wrong with provided direction string.");
	}
}

export function padLeft(text: string, length: number, character?: string): string {
	const char = character || " ";
	while (text.length < length) {
		text = char + text;
	}
	return text;
}

export function padRight(text: string, length: number, character?: string): string {
	const char = character || " ";
	while (text.length < length) {
		text += char;
	}
	return text;
}

export function toPercent(value: number): string {
	return `${(value * 100).toFixed(2)}%`;
}