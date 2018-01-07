import React from "react";
import PropTypes from "prop-types";

let pingInterval;
const pingSeconds = 2;

export default class Ping extends React.Component {
	static propTypes = {
		name: PropTypes.string.isRequired,
	};
	
	constructor(props) {
		super(props);
		this.state = {
			connectionId: Meteor.connection._lastSessionId,
		}
	}
	
	componentWillMount() {
		const self = this;
		pingInterval = setInterval(function () {
			TimeSync.resync();
			Meteor.call('pingDatabase.updateUser', self.state.connectionId, self.props.name, TimeSync.roundTripTime());
		}, pingSeconds*1000);
	}
	
	//noinspection JSMethodCanBeStatic
	componentWillUnmount() {
		clearInterval(pingInterval);
	}
	
	//noinspection JSMethodCanBeStatic
	render() {
		return <div/>;
	}
};