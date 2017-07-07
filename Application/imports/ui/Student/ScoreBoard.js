import PropTypes from 'prop-types';
import React from "react";
import {Meteor} from "meteor/meteor";


const inputStyle = {
	textAlign: "center",
	background: "transparent",
	border: "none",
	color: "white",
	fontSize: "1vw",
	flex: 1,
	overFlow: "hide",
	minWidth: "10vw",
};

export default class ScoreBoard extends React.Component {
    static propTypes = {
		playerLogic: PropTypes.object,
		gameLogic: PropTypes.object,
		round: PropTypes.number,
		connectionId: PropTypes.string,
	};

    numDisplay = () => {
		if (this.props.round === 0) {
			switch (this.props.playerLogic["status"]) {
				case "pending":
					return "----";
					break;
				case "ready":
					return "Team" + this.props.playerLogic["teamNumber"];
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

    handleName = (name) => {
		Meteor.call('gameLogic.setTeamName', this.props.playerLogic["teamNumber"], name.target.value);
	};

    handleClick = () => {
		const status = this.props.playerLogic["status"];
		if (this.props.round === 0) {
			
			const input = $("#input" + this.props.playerLogic["teamNumber"]);
			if (status === "" && this.props.gameLogic["connections"][this.props.connectionId] === undefined) {
				Meteor.call('gameLogic.setConnectionId', this.props.playerLogic["teamNumber"], this.props.round, this.props.connectionId);
				
				if (navigator.userAgent.match(/(Android|iPhone|iPod)/i)) {
					this.handleFocus();
					let name = prompt("Enter Team Name");
					if (!name) {
						name = "";
					}
					input.val(name);
					this.handleBlur({target: {value: name}});
					this.handleName({target: {value: name}});
				}
				else {
					input.prop("disabled", false);
					input.focus();
				}
			}
			else if (status === "ready" && this.props.connectionId === this.props.playerLogic["connectionId"]) {
				if (navigator.userAgent.match(/(Android|iPhone|iPod)/i)) {
					this.handleFocus();
					let name = prompt("Enter Team Name", input.val());
					if (name === null) {
						name = input.val();
					}
					input.val(name);
					this.handleBlur({target: {value: name}});
					this.handleName({target: {value: name}});
				}
				else {
					input.prop("disabled", false);
					input.focus();
				}
			}
		}
		else if (status === "reconnect" && this.props.gameLogic["connections"][this.props.connectionId] === undefined) {
			Meteor.call('gameLogic.setConnectionId', this.props.playerLogic["teamNumber"], this.props.round, this.props.connectionId);
			Meteor.call('gameLogic.setStatus', this.props.playerLogic["teamNumber"], "active", this.props.round);
		}
	};

    handleSubmit = (e) => {
		e.preventDefault();
		$("#input" + this.props.playerLogic["teamNumber"]).blur();
	};

    handleFocus = () => {
		Meteor.call('gameLogic.setStatus', this.props.playerLogic["teamNumber"], "pending", 0)
	};

    handleBlur = (name) => {
		$("#input" + this.props.playerLogic["teamNumber"]).prop("disabled", true);
		//noinspection EqualityComparisonWithCoercionJS
		if (name.target.value == "") {
			Meteor.call('gameLogic.setStatus', this.props.playerLogic["teamNumber"], "", 0);
			Meteor.call('gameLogic.setConnectionId', this.props.playerLogic["teamNumber"], this.props.round, "", this.props.connectionId);
			Meteor.call('gameLogic.setTeamName', this.props.playerLogic["teamNumber"], "");
		}
		else {
			Meteor.call('gameLogic.setStatus', this.props.playerLogic["teamNumber"], "ready", 0)
		}
		
	};

    scoreStyle = () => {
		const green = {
			fontFamily: "D7",
			fontSize: "4vw",
			minWidth: "10vw",
			border: "4px solid #00e800",
			padding: "10px 1vw",
			borderRadius: 8,
		};
		
		const orange = {
			fontFamily: "D7",
			fontSize: "4vw",
			minWidth: "10vw",
			border: "4px solid orange",
			padding: "10px 1vw",
			borderRadius: 8,
		};
		
		const red = {
			fontFamily: "D7",
			fontSize: "4vw",
			minWidth: "10vw",
			border: "4px solid #ff3f3f",
			padding: "10px 1vw",
			borderRadius: 8,
		};
		
		const normal = {
			fontFamily: "D7",
			fontSize: "4vw",
			minWidth: "10vw",
			border: "4px solid #060CE9",
			padding: "10px 1vw",
			borderRadius: 8,
		};
		
		const teamNumber = this.props.playerLogic["teamNumber"];
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
					if (this.props.gameLogic["lastWinner"] === this.props.playerLogic["teamNumber"]) {
						return orange;
					}
					else {
						return normal;
					}
				case "DailyDouble":
				case "wager":
				case "DDread":
				case "DDanswer":
					if (this.props.gameLogic["lastWinner"] === this.props.playerLogic["teamNumber"]) {
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
				     padding: "10px 1vw",
				     border: "4px solid white",
				     flexDirection: "column",
				     flex: 1,
			     }}>
				<div style={this.scoreStyle()}>{this.numDisplay()}</div>
				<form onSubmit={this.handleSubmit} className="flex-container">
					<input id={"input" + this.props.playerLogic["teamNumber"]}
					       spellCheck="true"
					       type="text"
					       value={this.props.playerLogic["teamName"]}
					       onChange={this.handleName}
					       style={inputStyle}
					       onFocus={this.handleFocus}
					       onBlur={this.handleBlur}
					       disabled/>
				</form>
			</div>
		)
	}
}
