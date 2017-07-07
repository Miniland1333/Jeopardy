import React from "react";
import PropTypes from "prop-types";


export default class PingEntry extends React.Component {
	static propTypes = {
		pingEntry: PropTypes.object,
	};
	
	render() {
		return <div className="flex-container">
			<div style={{flex:1}}>{this.props.pingEntry.name}</div>
			<div style={{flex:1}}>{this.props.pingEntry.roundTripTime} ms</div>
		</div>;
	}
}