export type LiteralUnion<
	LiteralType extends BaseType,
	BaseType extends Primitive
> = LiteralType | (BaseType & {_?: never});
