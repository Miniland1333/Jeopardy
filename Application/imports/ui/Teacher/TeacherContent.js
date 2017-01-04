import React, {Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';

import GameDropdown from "./GameDropdown";

import Question from "./Question";


const questionStyle = {
	fontSize: "6vmin",
	flex: 1,
	alignItems: "center",
	whiteSpace: "pre-wrap",
	justifyContent: "center",
	textTransform: "uppercase",
};
const answerStyle = {
	fontSize: "4vmin",
};

export const TeacherContent = React.createClass({
	propTypes: {
		gameDatabase: React.PropTypes.array,
		gameLogic: React.PropTypes.object,
		gameQuestions: React.PropTypes.object,
	},
	renderContent: function () {
		if (this.props.gameLogic["round"] == 0) {
			return <div className="flex-container" style={{flex: 1}}>
				<GameDropdown gameDatabase={this.props.gameDatabase} gameLogic={this.props.gameLogic}/>
			</div>;
		}
		switch (this.props.gameLogic["state"]) {
			case "":
			case "intro":
			case "categoryIntro":
				let title;
				switch (this.props.gameLogic["round"]) {
					case 1:
						return <div className="flex-container" style={{
							fontFamily: "gyparody",
							fontSize: "20vmin",
							flex: 1,
							alignItems: "center",
							justifyContent: "center",
							whiteSpace: "pre-wrap",
						}}>Jeopardy!</div>;
					case 2:
						return <div className="flex-container" style={{
							fontFamily: "gyparody",
							fontSize: "20vmin",
							flex: 1,
							alignItems: "center",
							justifyContent: "center",
							whiteSpace: "pre-wrap",
						}}>Double<br/>Jeopardy!</div>;
					case 3:
						return <div className="flex-container" style={{
							fontFamily: "gyparody",
							fontSize: "20vmin",
							flex: 1,
							alignItems: "center",
							justifyContent: "center",
							whiteSpace: "pre-wrap",
						}}>Final<br/>Jeopardy!</div>;
				}
				break;
			case "categories":
				return <div key="" className="Table">
					{$.map(this.props.gameQuestions["currentRound"], function (column, key1) {
						return (
							<div className="Column" key={key1}>
								{$.map(column, function (cell, key2) {
									return key2 == "categoryName" ?
										<div className="Header" key={key1 + "H"} style={{
											alignItems: "center",
											justifyContent: "center",
											fontSize: "2vmin",
										}}>{cell}</div>
										:
										[];
								})}
							</div>
						)
					})}
				</div>;
				break;
			case "pickQuestion":
				const round = this.props.gameLogic["round"];
				return <div key="" className="Table">
					{$.map(this.props.gameQuestions["currentRound"], function (column, key1) {
						return (
							<div className="Column" key={key1}>
								{$.map(column, function (cell, key2) {
									return key2 == "categoryName" ?
										<div className="Header" key={key1 + "H"} style={{
											alignItems: "center",
											justifyContent: "center",
											fontSize: "2vmin",
										}}>{cell}</div>
										:
										<Question key={key1 + key2} cell={cell} round={round} key1={key1} key2={key2}/>;
									
								})}
							</div>
						)
					})}
				</div>;
			case "DailyDouble":
				return <div className="flex-container" style={{
					fontFamily: "gyparody", fontSize: "20vmin", flex: 1, alignItems: "center", justifyContent: "center",
					whiteSpace: "pre-wrap",
				}}>Daily<br/>Double</div>;
			case "wager":
				const DDwager = this.props.gameLogic["player" + this.props.gameLogic["lastWinner"]]["wager"];
				return [<div className="flex-container" style={{
					fontFamily: "gyparody", fontSize: "20vmin", flex: 1, alignItems: "center", justifyContent: "center",
					whiteSpace: "pre-wrap",
				}}>Daily<br/>Double</div>,
					<div style={{
						fontSize: "3vw",
						minWidth: "10vw",
					}}>{"Team Wager: " + DDwager}</div>];
			case "questionDecide":
				Meteor.call('gameLogic.resetCurrentQuestionLogic');
				if (this.props.gameQuestions["currentQuestion"]["isDailyDouble"]) {
					Meteor.call('gameLogic.setState', "DailyDouble");
				} else {
					Meteor.call('gameLogic.setState', "read");
				}
				break;
			case "read":
			case "open":
			case "answer":
			case "DDread":
			case "DDanswer":
			case "next":
				if (typeof this.props.gameQuestions["currentQuestion"]["question"] === "string") {
					return (
						<div className="flex-container" style={{flexDirection: "column", flex: 1}}>
							<div style={questionStyle}>{this.props.gameQuestions["currentQuestion"]["question"]}</div>
							<div style={answerStyle}>{this.props.gameQuestions["currentQuestion"]["answer"]}</div>
						</div>);
				}
				else {
					if (this.props.gameQuestions["currentQuestion"]["question"].type == "image") {
						return <div className="flex-container" style={{flexDirection: "column", flex: 1}}>
							<div
								style={questionStyle}>{this.props.gameQuestions["currentQuestion"]["question"].text}</div>
							<div style={answerStyle}>{this.props.gameQuestions["currentQuestion"]["answer"]}</div>
						</div>
					} else {
						return [<div className="flex-container" style={{
							fontFamily: "gyparody",
							fontSize: "20vmin",
							flex: 1,
							alignItems: "center",
							justifyContent: "center",
							whiteSpace: "pre-wrap",
						}}>Video<br/>Question</div>,
							<div style={answerStyle}>{this.props.gameQuestions["currentQuestion"]["answer"]}</div>]
					}
				}
			case "FJwager":
				return <div className="flex-container" style={{flexDirection: "column", flex: 1}}>
					<div style={{
						fontSize: "20vmin", flex: 1, alignItems: "center", justifyContent: "center",
						whiteSpace: "pre-wrap", textTransform: "uppercase"
					}}>{this.props.gameQuestions["currentRound"]['category']}</div>
					<div style={answerStyle}>Wait for Players to enter their Wagers</div>
				
				</div>;
			
			case "FJread":
			case "FJopen":
			case "FJanswer":
				const player = this.props.gameLogic["FJ"]["currentPlayer"];
				let wager;
				if (player != 0) {
					wager = "Wager: " + this.props.gameLogic["player" + player]["wager"];
				} else {
					wager = "";
				}
				if (typeof this.props.gameQuestions["currentRound"]["question"] === "string") {
					return (
						<div className="flex-container" style={{flexDirection: "column", flex: 1}}>
							<div style={questionStyle}>{this.props.gameQuestions["currentRound"]["question"]}</div>
							<div style={answerStyle}>{this.props.gameQuestions["currentRound"]["answer"]}</div>
							<div style={{
								position: "absolute", top: 10, right: 10,
								fontSize: "3vw",
								minWidth: "10vw",
							}}>{wager}</div>
						</div>);
				}
				else {
					if (this.props.gameQuestions["currentRound"]["question"].type == "image") {
						return <div className="flex-container" style={{flexDirection: "column", flex: 1}}>
							<div
								style={questionStyle}>{this.props.gameQuestions["currentRound"]["question"].text}</div>
							<div style={answerStyle}>{this.props.gameQuestions["currentRound"]["answer"]}</div>
							<div style={{
								position: "absolute", top: 10, right: 10,
								fontSize: "3vw",
								minWidth: "10vw",
							}}>{wager}</div>
						</div>
					} else {
						return [<div className="flex-container" style={{
							fontFamily: "gyparody",
							fontSize: "20vmin",
							flex: 1,
							alignItems: "center",
							justifyContent: "center",
							whiteSpace: "pre-wrap",
						}}>Video<br/>Question</div>,
							<div style={answerStyle}>{this.props.gameQuestions["currentRound"]["answer"]}</div>,
							<div style={{
								position: "absolute", top: 10, right: 10,
								fontSize: "3vw",
								minWidth: "10vw",
							}}>{wager}</div>]
					}
				}
		}
	},
	render: function () {
		
		return (
			<div className="flex-container" style={{flexDirection: "column", flex: 1}}>
				{this.renderContent()}
			</div>
		);
	}
});

module.exports = TeacherContent;
