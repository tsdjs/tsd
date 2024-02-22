import {CompilerOptions} from '@tsd/typescript';
import {NormalizedPackageJson} from 'read-pkg-up';

export type RawCompilerOptions = Record<string, any>;

export interface Config<Options = CompilerOptions> {
	directory: string;
	compilerOptions: Options;
}

export type RawConfig = Partial<Config<RawCompilerOptions>>;

export type PackageJsonWithTsdConfig = NormalizedPackageJson & {
	tsd?: RawConfig;
};

export interface Context {
	cwd: string;
	pkg: PackageJsonWithTsdConfig;
	typingsFile: string;
	testFiles: string[];
	config: Config;
}

export enum DiagnosticCode {
	UnableToResolveSignatureOfClassDecorator = 1238,
	UnableToResolveSignatureOfParameterDecorator = 1239,
	UnableToResolveSignatureOfPropertyDecorator = 1240,
	UnableToResolveSignatureOfMethodDecorator = 1241,
	DecoratorCanOnlyDecorateMethodImplementation = 1249,
	DecoratorFunctionReturnTypeNotAssignableToType = 1270,
	DecoratorFunctionReturnTypeExpectedToBeVoidOrAny = 1271,
	RuntimeWillInvokeDecoratorWithXArgumentsButDecoratorExpectsY = 1278,
	RuntimeWillInvokeDecoratorWithXArgumentsButDecoratorExpectsAtLeastY = 1279,
	AwaitExpressionOnlyAllowedWithinAsyncFunction = 1308,
	AcceptsTooFewArgumentsToBeUsedAsDecoratorHere = 1329,
	TopLevelAwaitOnlyAllowedWhenModuleESNextOrSystem = 1378,
	GenericTypeRequiresTypeArguments = 2314,
	GenericTypeRequiresBetweenXAndYTypeArugments = 2707,
	TypeIsNotAssignableToOtherType = 2322,
	TypeDoesNotSatisfyTheConstraint = 2344,
	PropertyDoesNotExistOnType = 2339,
	ArgumentTypeIsNotAssignableToParameterType = 2345,
	CannotAssignToReadOnlyProperty = 2540,
	PropertyDoesNotExistOnTypeDidYouMean = 2551,
	ExpectedArgumentsButGotOther = 2554,
	ExpectedAtLeastArgumentsButGotOther = 2555,
	TypeHasNoPropertiesInCommonWith = 2559,
	ValueOfTypeNotCallable = 2348,
	ExpressionNotCallable = 2349,
	OnlyVoidFunctionIsNewCallable = 2350,
	ExpressionNotConstructable = 2351,
	ObjectLiteralMayOnlySpecifyKnownProperties = 2353,
	ObjectLiteralMayOnlySpecifyKnownProperties2 = 2561,
	TypeNotAssignableWithExactOptionalPropertyTypes = 2375,
	TypeNotAssignableToParameterWithExactOptionalPropertyTypes = 2379,
	TypeNotAssignableTypeOfTargetWithExactOptionalPropertyTypes = 2412,
	IndexSignatureOnlyPermitsReading = 2542,
	NoOverloadExpectsCountOfArguments = 2575,
	ThisContextOfTypeNotAssignableToMethodOfThisType = 2684,
	Type1IsMissingPropertiesFromType2 = 2740,
	PropertyMissingInType1ButRequiredInType2 = 2741,
	NoOverloadExpectsCountOfTypeArguments = 2743,
	NoOverloadMatches = 2769,
	StringLiteralTypeIsNotAssignableToUnionTypeWithSuggestion = 2820,
	MemberCannotHaveOverrideModifierBecauseItIsNotDeclaredInBaseClass = 4113,
	MemberMustHaveOverrideModifier = 4114,
	NewExpressionTargetLackingConstructSignatureHasAnyType = 7009,
}

export interface Diagnostic {
	fileName: string;
	message: string;
	severity: 'error' | 'warning';
	line?: number;
	column?: number;
	diff?: {
		expected: string;
		received: string;
	};
}

export interface Location {
	fileName: string;
	start: number;
	end: number;
}

export class TsdError extends Error {
	constructor(message: string) {
		super(message);
		this.name = this.constructor.name;
	}
}
