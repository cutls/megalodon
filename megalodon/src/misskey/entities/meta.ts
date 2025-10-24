import { Emoji } from "./emoji.js";

export type Meta = {
	maintainerName: string;
	maintainerEmail: string;
	name: string;
	version: string;
	uri: string;
	description: string;
	langs: Array<string>;
	disableRegistration: boolean;
	disableLocalTimeline: boolean;
	bannerUrl: string;
	maxNoteTextLength: 300;
	emojis: Array<Emoji>;
};
