import {expectDocCommentIncludes} from '../../../../index.js';

const noDocComment = 'no doc comment';

expectDocCommentIncludes<'no doc comment'>(noDocComment);

/** FooBar */
const foo = 'bar';

expectDocCommentIncludes(foo);
expectDocCommentIncludes<boolean>(foo);
expectDocCommentIncludes<'BarFoo'>(foo);
expectDocCommentIncludes<'FooBar'>(foo);
expectDocCommentIncludes<'Foo'>(foo);
expectDocCommentIncludes<'Bar'>(foo);
