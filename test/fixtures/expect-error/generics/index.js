module.exports.default = (foo, bar) => {
	return foo + bar;
};

exports.two = (foo, bar) => {
	if (foo != null && bar != null) {
		return bar;
	} else {
		return foo;
	}
};
