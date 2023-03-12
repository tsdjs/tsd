'use strict';
const React = require('react');

export class Unicorn extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <h1>{this.props.rainbow}</h1>;
	}
}
