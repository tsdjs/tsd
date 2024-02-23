export default (foo, bar) => {
	return foo + bar;
};

export const two = (foo, bar) => {
	if (foo != null && bar != null) {
		return bar;
	} else {
		return foo;
	}
};
