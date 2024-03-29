declare const one: {
	<T extends string>(foo: T, bar: T): T;
};

export default one;

export function two<T1>(foo: T1): T1;
export function two<T1, T2, T3 extends T2>(foo: T1, bar: T2): T3;

export type Three<T1, T2 = 2, T3 = 3> = [T1, T2, T3];
