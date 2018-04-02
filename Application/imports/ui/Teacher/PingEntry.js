import React from "react";
import PropTypes from "prop-types";
import {Meteor} from "meteor/meteor";


export default class PingEntry extends React.Component {
	static propTypes = {
		pingEntry: PropTypes.object,
	};
	
	getColor(time){
		if(time > 15)
			return "red";
		else if (time > 5)
			return "orange";
		else
			return this.props.black?"black":"white";
	}
	
	render() {
		let time = Math.round((ServerTime.now() - this.props.pingEntry.time) / 1000);
		return <div className="flex-container" style={{color:this.getColor(time)}} onClick={()=>{
			if (time > 15){
				if(confirm("Kick "+this.props.pingEntry.name+"?")){
					Meteor.call('gameLogic.kick', 0, this.props.pingEntry.connectionId);
					Meteor.call('pingDatabase.kick', this.props.pingEntry.connectionId);
				}
			}
		}}>
			<div style={{flex: 1}}>{this.props.pingEntry.name}</div>
			<div style={{flex: 1}}>{this.props.pingEntry.roundTripTime} ms</div>
			<div style={{flex: 1}}>{time} seconds</div>
		</div>;
	}
}