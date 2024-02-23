export type {Handler} from './handler.js';

// Handlers
export {isIdentical, isNotIdentical, isNever} from './identicality.js';
export {isNotAssignable} from './assignability.js';
export {expectDeprecated, expectNotDeprecated} from './expect-deprecated.js';
export {printTypeWarning, expectDocCommentIncludes} from './informational.js';
