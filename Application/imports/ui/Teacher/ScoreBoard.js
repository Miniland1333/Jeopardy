import React, {Component, PropTypes} from 'react';
import {Meteor} from 'meteor/meteor';




var ScoreBoard = React.createClass({
	propTypes: {
		playerLogic: React.PropTypes.object,
		isSetup: React.PropTypes.bool,//Based off of player or setupplayer
		gameLogic:React.PropTypes.object,
		round:React.PropTypes.number,
	},
	numDisplay:function () {
		if (this.props.round == 0) {
			switch (this.props.playerLogic["status"]){
				case "pending":
					return "----";
					break;
				case "ready":
					return "Team"+this.props.playerLogic["teamNumber"];
					break;
				default:
					return "0000";
			}
		}else{
			switch (this.props.playerLogic["status"]){
				case "reconnect":
					return "----";
					break;
				case "active":
					return this.props.playerLogic["points"];
					break;
				default:
					return "OUT";
			}
		}
	},
	handleClick: function () {
		if (this.props.round == 0) {
			if(confirm("This will kick player"+this.props.playerLogic["teamNumber"]+". Are you sure?")){
				Meteor.call('gameLogic.kick',this.props.playerLogic["teamNumber"],this.props.playerLogic["connectionId"]);
			}
		}
		else if(this.props.gameLogic["status"]=="pickQuestion") {
			if (this.props.round == 1) {
				//show  J options
			} else if (this.props.round == 2) {
				//show DJ options
			}
		}
		
	},
	scoreStyle:function () {
		if (this.props.round == 0) {
			switch (this.props.playerLogic["status"]) {
				case "pending":
					return {
						fontFamily: "D7",
						fontSize: "4vw",
						minWidth: "10vw",
						border: "4px solid orange",
						padding: "10px",
						borderRadius: 8,
					};
					break;
				case "ready":
					return {
						fontFamily: "D7",
						fontSize: "4vw",
						minWidth: "10vw",
						border: "4px solid #00e800",
						padding: "10px",
						borderRadius: 8,
					};
					break;
				default:
					return {
						fontFamily: "D7",
						fontSize: "4vw",
						minWidth: "10vw",
						border: "4px solid #060CE9",
						padding: "10px",
						borderRadius: 8,
					};
			}
		} else {
			if (this.props.playerLogic["status"] == "reconnect") {
				return {
					fontFamily: "D7",
					fontSize: "4vw",
					minWidth: "10vw",
					border: "4px solid orange",
					padding: "10px",
					borderRadius: 8,
				};
			} else if (this.props.playerLogic["status"] == "out") {
				return {
					fontFamily: "D7",
					fontSize: "4vw",
					minWidth: "10vw",
					border: "4px solid #060CE9",
					padding: "10px",
					borderRadius: 8,
				};
			} else {
				return {
					fontFamily: "D7",
					fontSize: "4vw",
					minWidth: "10vw",
					border: "4px solid #00e800",
					padding: "10px",
					borderRadius: 8,
				};
			}
		}
	},
	render: function () {
		
		return (
			<div className="flex-container" onClick={this.handleClick}
			     style={{
				     padding: "10px",
				     border: "4px solid white",
				     flexDirection: "column",
				     flex: 1,
			     }}>
				<div style={this.scoreStyle()}>{this.numDisplay()}</div>
				<div >{this.props.playerLogic.teamName}</div>
			</div>
		)
	}
	
});

module.exports = ScoreBoard;

