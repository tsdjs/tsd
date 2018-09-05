import filesProperty from './files-property';
import {Diagnostic, Context} from '../interfaces';

type RuleFunction = (context: Context) => Diagnostic[];

// List of custom rules
const rules = new Set<RuleFunction>([
	filesProperty
]);

/**
 * Get a list of custom diagnostics within the current context.
 *
 * @param context - The context object.
 * @returns List of diagnostics
 */
export default (context: Context) => {
	const diagnostics: Diagnostic[] = [];

	for (const rule of rules) {
		diagnostics.push(...rule(context));
	}

	return diagnostics;
};
