import type {TestFiles} from '../interfaces';

// https://regex101.com/r/8JO8Wb/1
const regex = /^(?<name>[^\s:]+\.[^\s:]+):(?<text>.*)$/s;

export const getGlobTestFiles = (testFilesPattern: TestFiles) => {
	return testFilesPattern.filter(file => typeof file === 'string' && !regex.test(file)) as readonly string[];
};

export const getTextTestFiles = (testFilesPattern: TestFiles) => {
	return [
		...(testFilesPattern
			.filter(file => typeof file !== 'string')
		),
		...(testFilesPattern
			.filter(file => typeof file === 'string')
			.map(file => regex.exec(file as string))
			.filter(Boolean)
			.map(match => ({name: match?.groups?.name, text: match?.groups?.text}))
		),
	] as ReadonlyArray<{name: string; text: string}>;
};
