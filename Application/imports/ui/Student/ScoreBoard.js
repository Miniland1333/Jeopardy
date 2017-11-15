import PropTypes from "prop-types";
import React from "react";
import {Meteor} from "meteor/meteor";


export default class ScoreBoard extends React.Component {
	static propTypes = {
		playerLogic: PropTypes.object,
		gameLogic: PropTypes.object,
		round: PropTypes.number,
		connectionId: PropTypes.string,
		wide: PropTypes.bool,
	};
	
	numDisplay = () => {
		if (this.props.round === 0) {
			switch (this.props.playerLogic["status"]) {
				case "pending":
					return "----";
					break;
				case "ready":
					return "Team" + this.props.playerLogic.teamNumber;
					break;
				default:
					return "OPEN";
			}
		}
		else {
			switch (this.props.playerLogic["status"]) {
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
	};
	
	
	handleClick = () => {
		const status = this.props.playerLogic["status"];
		if (this.props.round === 0) {
			if (status === "" && this.props.gameLogic["connections"][this.props.connectionId] === undefined) {
				Meteor.call('gameLogic.setConnectionId', this.props.playerLogic.teamNumber, this.props.round, this.props.connectionId);
				
				this.handleFocus();
				let name = prompt("Enter Team Name");
				if (!name) {
					name = "";
				}
				this.handleName(name);
			}
			else if (status === "ready" && this.props.connectionId === this.props.playerLogic["connectionId"]) {
				this.handleFocus();
				let name = prompt("Enter Team Name", this.props.playerLogic.teamName);
				this.handleName(name);
			}
		}
		else if (status === "reconnect" && this.props.gameLogic["connections"][this.props.connectionId] === undefined) {
			Meteor.call('gameLogic.setConnectionId', this.props.playerLogic.teamNumber, this.props.round, this.props.connectionId);
			Meteor.call('gameLogic.setStatus', this.props.playerLogic.teamNumber, "active", this.props.round);
		}
	};
	
	handleFocus = () => {
		Meteor.call('gameLogic.setStatus', this.props.playerLogic.teamNumber, "pending", 0)
	};
	
	handleName = (name) => {
		//noinspection EqualityComparisonWithCoercionJS
		if (name == "") {
			Meteor.call('gameLogic.setStatus', this.props.playerLogic.teamNumber, "", 0);
			Meteor.call('gameLogic.setConnectionId', this.props.playerLogic.teamNumber, this.props.round, "", this.props.connectionId);
			Meteor.call('gameLogic.setTeamName', this.props.playerLogic.teamNumber, "");
		}
		else {
			Meteor.call('gameLogic.setStatus', this.props.playerLogic.teamNumber, "ready", 0)
		}
		
		Meteor.call('gameLogic.setTeamName', this.props.playerLogic.teamNumber, name);
	};
	
	scoreStyle = () => {
		const green = {
			fontFamily: "D7",
			fontSize: this.props.wide ? "10vmin" : "4win",
			minWidth: "10vw",
			border: "4px solid #00e800",
			padding: "10px 1vw",
			borderRadius: 8,
		};
		
		const orange = {
			fontFamily: "D7",
			fontSize: this.props.wide ? "10vmin" : "4vmin",
			minWidth: "10vw",
			border: "4px solid orange",
			padding: "10px 1vw",
			borderRadius: 8,
		};
		
		const red = {
			fontFamily: "D7",
			fontSize: this.props.wide ? "10vmin" : "4vmin",
			minWidth: "10vw",
			border: "4px solid #ff3f3f",
			padding: "10px 1vw",
			borderRadius: 8,
		};
		
		const normal = {
			fontFamily: "D7",
			fontSize: this.props.wide ? "10vmin" : "4vmin",
			minWidth: "10vw",
			border: "4px solid #060CE9",
			padding: "10px 1vw",
			borderRadius: 8,
		};
		
		const teamNumber = this.props.playerLogic.teamNumber;
		if (this.props.round === 0) {
			switch (this.props.playerLogic["status"]) {
				case "pending":
					return orange;
					break;
				case "ready":
					return green;
					break;
				default:
					return normal;
			}
		}
		else if (this.props.playerLogic["status"] === "reconnect") {
			return orange;
		}
		else if (this.props.gameLogic["round"] !== 3) {
			switch (this.props.gameLogic["state"]) {
				case "intro":
				case "categoryIntro":
				case "categories":
				case "pickQuestion":
					if (this.props.gameLogic["lastWinner"] === this.props.playerLogic.teamNumber) {
						return orange;
					}
					else {
						return normal;
					}
				case "DailyDouble":
				case "wager":
				case "DDread":
				case "DDanswer":
					if (this.props.gameLogic["lastWinner"] === this.props.playerLogic.teamNumber) {
						return green;
					}
					else {
						return normal;
					}
				case "open":
					if (this.props.gameLogic["currentQuestionLogic"]["Incorrect"].includes(teamNumber)) {
						return red;
					}
					else {
						return normal;
					}
				case "answer":
					if (this.props.gameLogic["currentQuestionLogic"]["first"] === teamNumber) {
						return green;
					}
					else if (this.props.gameLogic["currentQuestionLogic"]["RungInLate"].includes(teamNumber)) {
						return red
					}
					else {
						return normal;
					}
				
				
				default:
					return normal;
					break;
			}
		}
		else if (this.props.gameLogic["round"] === 3) {
			//Code for FJ wager
			if (this.props.gameLogic["currentQuestionLogic"]["RungInLate"].includes(teamNumber) && this.props.gameLogic["state"] === "FJwager") {
				return green
			}
			else if (this.props.gameLogic["state"] === "FJanswer" && this.props.gameLogic["FJ"]["currentPlayer"] === teamNumber) {
				return green
			}
			else {
				return normal;
			}
		}
		else {
			return normal;
		}
	};
	
	render() {
		return (
			<div className="flex-container" onClick={this.handleClick}
			     style={{
				     padding: screen.width < 1000 ? "10px 0" : "10px 1vw",
				     border: "4px solid white",
				     borderLeft: screen.width < 1000 ? "0" : "4px solid white",
				     flexDirection: "column",
				     flex: 1,
			     }}>
				<div style={this.scoreStyle()}>{this.numDisplay()}</div>
				<div>
					{this.props.playerLogic["teamName"]}
				</div>
			</div>
		)
	}
}
