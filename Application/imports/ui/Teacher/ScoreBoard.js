import PropTypes from "prop-types";
import React from "react";
import {Meteor} from "meteor/meteor";
import "./../jquery-ui";
import "./../jquery.ui.touch-punch";

import Options from "./Options";


export default class ScoreBoard extends React.Component {
	static propTypes = {
		playerLogic: PropTypes.object,
		gameLogic: PropTypes.object,
		round: PropTypes.number,
	};
	
	state = {
		options: false,
	};
	
	numDisplay = () => {
		if (this.props.round == 0) {
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
	
	handleClick = () => {
		if (this.props.round == 0) {
			if (confirm("This will kick player" + this.props.playerLogic["teamNumber"] + ". Are you sure?")) {
				Meteor.call('gameLogic.kick', this.props.playerLogic["teamNumber"], this.props.playerLogic["connectionId"]);
			}
		}
		else {
			if (!this.state.options) {
				this.setState({options: true});
			}
		}
		
	};
	
	handleClose = () => {
		this.setState({options: false});
	};
	
	scoreStyle = () => {
		
		const green = {
			fontFamily: "D7",
			fontSize: "4vw",
			minWidth: "10vw 0",
			border: "4px solid #00e800",
			padding: screen.width < 1000 ? "10px 0 " : "10px",
			borderRadius: 8,
			zIndex: -1,
		};
		const orange = {
			fontFamily: "D7",
			fontSize: "4vw",
			minWidth: "10vw 0",
			border: "4px solid orange",
			padding: screen.width < 1000 ? "10px 0 " : "10px",
			borderRadius: 8,
			zIndex: -1,
		};
		
		const red = {
			fontFamily: "D7",
			fontSize: "4vw",
			minWidth: "10vw 0",
			border: "4px solid #ff3f3f",
			padding: screen.width < 1000 ? "10px 0 " : "10px",
			borderRadius: 8,
			zIndex: -1,
		};
		
		const normal = {
			fontFamily: "D7",
			fontSize: "4vw",
			minWidth: "10vw 0",
			border: "4px solid #060CE9",
			padding: screen.width < 1000 ? "10px 0 " : "10px",
			borderRadius: 8,
			zIndex: -1,
		};
		
		const teamNumber = this.props.playerLogic["teamNumber"];
		if (this.props.round == 0) {
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
		else if (this.props.playerLogic["status"] == "reconnect") {
			return orange;
		}
		else if (this.props.gameLogic["round"] != 3) {
			switch (this.props.gameLogic["state"]) {
				case "intro":
				case "categoryIntro":
				case "categories":
				case "pickQuestion":
					if (this.props.gameLogic["lastWinner"] == this.props.playerLogic["teamNumber"]) {
						return orange;
					}
					else {
						return normal;
					}
					break;
				case "DailyDouble":
				case "wager":
				case "DDread":
				case "DDanswer":
					if (this.props.gameLogic["lastWinner"] == this.props.playerLogic["teamNumber"]) {
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
					if (this.props.gameLogic["currentQuestionLogic"]["first"] == teamNumber) {
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
		else if (this.props.gameLogic["round"] == 3) {
			//Code for wager
			if (this.props.gameLogic["currentQuestionLogic"]["RungInLate"].includes(teamNumber) && this.props.gameLogic["state"] == "FJwager") {
				return green
			}
			else if (this.props.gameLogic["state"] == "FJanswer" && this.props.gameLogic["FJ"]["currentPlayer"] == teamNumber) {
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
				     padding: screen.width < 1000 ? "10px 0 " : "10px",
				     border: "4px solid white",
				     flexDirection: "column",
				     flex: 1,
			     }}>
				<div style={this.scoreStyle()}>{this.numDisplay()}</div>
				<div >{this.props.playerLogic.teamName}</div>
				{this.state.options ?
					<Options gameLogic={this.props.gameLogic}
					         playerLogic={this.props.playerLogic}
					         round={this.props.round}
					         handleClose={this.handleClose}/>
					: []}
			
			</div>
		)
	}
}

