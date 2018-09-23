import PropTypes from "prop-types";
import React from "react";
import { Meteor } from "meteor/meteor";
import '../bootstrap.css';
import "jquery-confirm"
import "../jquery-confirm.css"

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
				case "active":
					return this.props.playerLogic["points"];
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

				this.getName("");
				// let name = prompt("Enter Team Name");
			}
			else if (status === "ready" && this.props.connectionId === this.props.playerLogic["connectionId"]) {
				this.getName(this.props.playerLogic.teamName);
			}
		}
		else if (status === "reconnect" && this.props.gameLogic["connections"][this.props.connectionId] === undefined) {
			Meteor.call('gameLogic.setConnectionId', this.props.playerLogic.teamNumber, this.props.round, this.props.connectionId);
			Meteor.call('gameLogic.setStatus', this.props.playerLogic.teamNumber, "active", this.props.round);
		}
	};

	getName(oldName) {
		this.handleFocus();
		// let name = prompt("Enter Team Name", this.props.playerLogic.teamName);
		let self = this;

		$.confirm({
			title: 'Enter Team Name',
			content: '' +
				'<form action="" class="formName">' +
				'<div class="form-group">' +
				'<label/>' +
				'<input type="text" ' + (oldName !== "" ? ("value= " + oldName) : "Error") + ' class="name form-control" required />' +
				'</div>' +
				'</form>',
			buttons: {
				formSubmit: {
					text: 'Submit',
					btnClass: 'btn-blue',
					action: function () {
						const name = this.$content.find('.name').val();
						self.handleName(name);
					}
				},
				cancel: function () {
					self.handleName("");
					//close
				},
			},
			onContentReady: function () {
				// bind to events
				const jc = this;
				this.$content.find('form').on('submit', function (e) {
					// if the user submits the form by pressing enter in the field.
					e.preventDefault();
					jc.$$formSubmit.trigger('click'); // reference the button and click it
				});
				this.$content.find('.name').focus();
			}
		});
	}

	handleFocus = () => {
		Meteor.call('gameLogic.setStatus', this.props.playerLogic.teamNumber, "pending", 0)
	};

	handleName = (name) => {
		if (!name) {
			name = "";
		}

		name = name.substring(0, 50);

		if (this.props.gameLogic.setupPlayers["player" + this.props.playerLogic.teamNumber].connectionId === this.props.connectionId) {
			if (name !== "") {
				Meteor.call('gameLogic.setStatus', this.props.playerLogic.teamNumber, "ready", 0);
				Meteor.call('gameLogic.setTeamName', this.props.playerLogic.teamNumber, name);
			}
			else {
				Meteor.call('gameLogic.setStatus', this.props.playerLogic.teamNumber, "", 0);
				Meteor.call('gameLogic.setConnectionId', this.props.playerLogic.teamNumber, this.props.round, "", this.props.connectionId);
				Meteor.call('gameLogic.setTeamName', this.props.playerLogic.teamNumber, "");
			}
		}
		else {
			alert("You have left the app.\nPlease try again!")
		}
	};

	scoreStyle = () => {
		const green = {
			fontFamily: "D7",
			fontSize: this.props.wide ? "10vmin" : "4vmin",
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
					else if (this.props.gameLogic["currentQuestionLogic"]["RungInLate"].includes(teamNumber)
						|| this.props.gameLogic["currentQuestionLogic"]["Incorrect"].includes(teamNumber)) {
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
			<div className="flex-container needsclick" onClick={this.handleClick}
				style={{
					padding: screen.width < 1000 ? "10px 0" : "10px 1vw",
					border: "4px solid white",
					flexDirection: "column",
					flex: 1,
					textShadow: "3px 3px 7px black",
				}}>
				<div className="needsclick" style={this.scoreStyle()}>{this.numDisplay()}</div>
				<div className="needsclick">{this.props.playerLogic.teamName}</div>
			</div>
		)
	}
}
