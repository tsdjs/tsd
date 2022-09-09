import {expectDocComment} from '../../../..';

const noDocComment = 'no doc comment';

expectDocComment<'no doc comment'>(noDocComment);

/** FooBar */
const foo = 'bar';

expectDocComment(foo);
expectDocComment<boolean>(foo);
expectDocComment<'BarFoo'>(foo);
expectDocComment<'FooBar'>(foo);
