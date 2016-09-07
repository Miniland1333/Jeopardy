import React, {Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';

import {gameDatabase} from "../../api/gameDatabase";

var TeacherFooter = React.createClass({
	propTypes:{
		gameLogic:React.PropTypes.object,
		gameQuestions:React.PropTypes.object
	},
	handleCorrect:function () {
		var first = this.props.gameLogic["currentQuestionLogic"]["first"];
		var value =this.props.gameQuestions["currentQuestion"]["value"];
		
		if(this.props.gameLogic["state"]=="DDanswer"){
			//If DD, reset player wager
			first = this.props.gameLogic["lastWinner"];
			value = this.props.gameLogic["player"+first]["wager"];
			Meteor.call('gameLogic.setWager',first,0);
		}
		
		Meteor.call('gameLogic.lastWinner',first);
		Meteor.call('gameLogic.changePoints',first,value);
		if(this.props.gameQuestions["remainingColumns"]==0) {
			Meteor.call('gameLogic.advance');
		}else {
			Meteor.call('gameLogic.setState', "pickQuestion");
		}
		
	},
	handleIncorrect:function () {
		var first = this.props.gameLogic["currentQuestionLogic"]["first"];
		var value =this.props.gameQuestions["currentQuestion"]["value"];
		
		if(this.props.gameLogic["state"]=="DDanswer"){
			//If DD, reset player wager
			first = this.props.gameLogic["lastWinner"];
			value = this.props.gameLogic["player"+first]["wager"];
			Meteor.call('gameLogic.setWager',first,0);
		}
		
		Meteor.call('gameLogic.changePoints',first,-value);
		Meteor.call('gameLogic.addIncorrect', first);
		
		//Adjust for single play or out of players
		if(this.props.gameQuestions["remainingColumns"]==0) {
			Meteor.call('gameLogic.advance');
		}else if(this.props.gameLogic["state"]=="DDanswer"||this.props.gameQuestions["currentQuestion"]["isSinglePlay"]||this.props.gameLogic["currentQuestionLogic"]["Incorrect"].length==this.props.gameLogic["numPlayers"]) {
			Meteor.call('gameLogic.setState',"pickQuestion");
		}else{
			Meteor.call('gameLogic.setState', "open");
		}
		
	},
	handleStart:function () {
		if(this.readyToStart()) {
			var game = gameDatabase.find({name: this.props.gameLogic["gameName"]}).fetch()[0];
			Meteor.call('gameQuestions.load',game);
			Meteor.call('gameLogic.setupPlayers');
			Meteor.call('gameLogic.advance');
		}
	},
	readyToStart:function () {
		return this.props.gameLogic["gameName"]!="Please select a game"&&this.playerCount() >= 2;
	},
	playerCount:function () {
		var count=0;
		var setupPlayers = this.props.gameLogic["setupPlayers"];
		for(var i=1;i<=6;i++){
			if("ready"==setupPlayers["player"+i]["status"]){
				count++
			}
		}
		return count;
	},
	renderContent:function () {
		var round = this.props.gameLogic["round"];
		if(round==0) {
			return (
				<div className="flex-container" style={{flex: 1}}>{
					this.readyToStart() ?
						<div style={{
							padding: 0,
							border: "none",
							backgroundColor: "#eaeaea",
							color: "green",
							flex: 1,
							verticalAlign: "middle",
						}} onClick={this.handleStart}
						>Start {this.playerCount()} player Game</div>
						:
						this.playerCount() >= 2 ?
							<div style={{
								padding: 0,
								border: "none",
								backgroundColor: "#eaeaea",
								color: "#a5a5a5",
								flex: 1,
								verticalAlign: "middle"
							}}>Waiting for Game selection</div>
							:
							<div style={{
								padding: 0,
								border: "none",
								backgroundColor: "#eaeaea",
								color: "#a5a5a5",
								flex: 1,
								verticalAlign: "middle"
							}}>Waiting for Players</div>
				}</div>
			);
		}else if(round==3){
			
		}
		switch (this.props.gameLogic["state"]) {
			case "intro":
				if(round==1){
					return (
						<div className="flex-container" style={{flex: 1}}>
							<div style={{
								padding: 0,
								border: "none",
								backgroundColor: "#eaeaea",
								color: "black",
								flex: 1,
								verticalAlign: "middle",
							}} onClick={function () {
								Meteor.call('gameLogic.setState', 'categoryIntro');
							}}
							>Skip
							</div>
						</div>
					);
				}else{
					return null;
				}
			case "categories":
				if (this.props.gameLogic["remainingColumns"] == 0) {
					return (
						<div className="flex-container" style={{flex: 1}}>
							<div style={{
								padding: 0,
								border: "none",
								backgroundColor: "#eaeaea",
								color: "black",
								flex: 1,
								verticalAlign: "middle",
							}} onClick={this.advance}
							>Advance to next Round
							</div>
						</div>
					)
				} else {
					return (
						<div className="flex-container" style={{flex: 1}}>
							<div style={{
								padding: 0,
								border: "none",
								backgroundColor: "#eaeaea",
								color: "black",
								flex: 1,
								verticalAlign: "middle",
							}} onClick={function () {
								Meteor.call('gameLogic.setState', 'pickQuestion')
							}}>
								Next
							</div>
						</div>
					)
				}
			case "read":
				return (
					<div className="flex-container" style={{flex: 1}}>
						<div style={{
							padding: 0,
							border: "none",
							backgroundColor: "#eaeaea",
							color: "black",
							flex: 1,
							verticalAlign: "middle",
						}} onClick={function () {
							Meteor.call('gameLogic.setState', 'open');
						}}
						>Open Question
						</div>
					</div>
				);
			case "DDread":
				return (
					<div className="flex-container" style={{flex: 1}}>
						<div style={{
							padding: 0,
							border: "none",
							backgroundColor: "#eaeaea",
							color: "black",
							flex: 1,
							verticalAlign: "middle",
						}} onClick={function () {
							Meteor.call('gameLogic.setState', 'DDanswer');
						}}
						>Open Question
						</div>
					</div>
				);
			case "open":
				return (
					<div className="flex-container" style={{flex: 1}}>
						<div style={{
							padding: 0,
							border: "none",
							backgroundColor: "#eaeaea",
							color: "#a5a5a5",
							flex: 1,
							verticalAlign: "middle",
						}}
						>Waiting for Student Response
						</div>
					</div>
				);
			case "next":
				if(this.props.gameQuestions["remainingColumns"]==0){
					return (
						<div className="flex-container" style={{flex: 1}}>
							<div style={{
								padding: 0,
								border: "none",
								backgroundColor: "#eaeaea",
								color: "black",
								flex: 1,
								verticalAlign: "middle",
							}} onClick={function(){
								Meteor.call('gameLogic.advance');
							}}
							>Next Round
							</div>
						</div>
					);
				}else{
					return (
						<div className="flex-container" style={{flex: 1}}>
							<div style={{
								padding: 0,
								border: "none",
								backgroundColor: "#eaeaea",
								color: "black",
								flex: 1,
								verticalAlign: "middle",
							}} onClick={function () {
								Meteor.call('gameLogic.setState', 'pickQuestion');
							}}
							>Next Question
							</div>
						</div>
					);				}
				return (
					<div className="flex-container" style={{flex: 1}}>
						<div style={{
							padding: 0,
							border: "none",
							backgroundColor: "#eaeaea",
							color: "black",
							flex: 1,
							verticalAlign: "middle",
						}} onClick={function () {
							Meteor.call('gameLogic.setState', 'pickQuestion');
						}}
						>Next Question
						</div>
					</div>
				);
			case "answer":
			case "DDanswer":
				return (
					<div className="flex-container" style={{flex: 1}}>
						<div onClick={this.handleIncorrect} style={{
							padding: 0,
							border: "none",
							backgroundColor: "red",
							color: "white",
							flex: 1,
							verticalAlign: "middle"
						}}>Incorrect
						</div>
						<div onClick={this.handleCorrect} style={{
							padding: 0,
							border: "none",
							backgroundColor: "green",
							color: "white",
							flex: 1,
							verticalAlign: "middle"
						}}>Correct
						</div>
					</div>
				);
		}
		
		
	},
	render:function () {
		
		return(
			<div className="flex-container" style={{minHeight:"10vh",fontSize:"5vh",flexDirection:"column"}}>
				{this.renderContent()}
			</div>
		);
	}
});

module.exports = TeacherFooter;