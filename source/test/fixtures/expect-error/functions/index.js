export default (foo, bar) => foo + bar;

export const two = (foo, bar, baz) => {
	if (foo!= null && bar != null && baz != null) {
		return foo + bar + baz;
	} else {
		return foo;
	}
};

export const three = (foo) => 'a';
