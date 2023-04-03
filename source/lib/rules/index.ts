import type {Diagnostic, Context} from '../interfaces.js';
import filesProperty from './files-property.js';
import typesProperty from './types-property.js';

type RuleFunction = (context: Context) => Promise<Diagnostic[]>;

// List of custom rules
const rules: RuleFunction[] = [
	filesProperty,
	typesProperty,
];

/**
 * Get a list of custom diagnostics within the current context.
 *
 * @param context - The context object.
 * @returns List of diagnostics
 */
const getCustomDiagnostics = async (context: Context): Promise<Diagnostic[]> => {
	const diagnostics = await Promise.all(rules.map(async rule => rule(context)));
	return diagnostics.flat();
};

export default getCustomDiagnostics;
