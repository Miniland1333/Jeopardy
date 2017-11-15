import React from "react";
import PropTypes from "prop-types";

import {createContainer} from "meteor/react-meteor-data";
import {pingDatabase} from "../../api/pingDatabase";
import * as $ from "jquery";
import PingEntry from "./PingEntry";


class PingReport extends React.Component {
	static propTypes = {
		pingDatabase: PropTypes.array,
	};
	
	//noinspection JSMethodCanBeStatic
	render() {
		return <div className="flex-container" style={{
			flexDirection: "column",
			fontSize: "3vmin",
		}}>
			
			<div className="flex-container">
				<div style={{flex: 1}}>Username</div>
				<div style={{flex: 1}}>Ping</div>
			</div>
			{$.map(this.props.pingDatabase, function (entry, connectionId) {
				return typeof entry === "string" ? [] :
					<PingEntry key={connectionId} pingEntry={entry}/>
			})
			}</div>;
	}
}


export default createContainer(() => {
	const handle1 = Meteor.subscribe('pingDatabase');
	
	return {
		isReady: handle1.ready(),
		pingDatabase: pingDatabase.find().fetch(),
	};
}, PingReport);