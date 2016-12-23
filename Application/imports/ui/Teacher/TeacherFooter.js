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
		if(this.props.gameLogic["state"]=="DDanswer"||this.props.gameQuestions["currentQuestion"]["isSinglePlay"]||this.props.gameLogic["currentQuestionLogic"]["Incorrect"].length+1==this.props.gameLogic["numPlayers"]) {
			Meteor.call('gameLogic.setState', "next");
		}else{
			Meteor.call('gameLogic.setState', "open");
		}
		
	},
	handleFJCorrect:function () {
		var player =  this.props.gameLogic["FJ"]["currentPlayer"];
		var wager = this.props.gameLogic["player"+player]["wager"];
		Meteor.call('gameLogic.changePoints',player,wager);
		
		Meteor.call('gameLogic.removeFJ',player);
		
		//check if no more players
		if(this.props.gameLogic["FJ"]["remaining"].length<=1) {
			Meteor.call('gameLogic.setState', "complete");
		}else{
			Meteor.call('gameLogic.removeFJ',player);
		}
	},
	handleFJIncorrect:function () {
		var player =  this.props.gameLogic["FJ"]["currentPlayer"];
		var wager = this.props.gameLogic["player"+player]["wager"];
		Meteor.call('gameLogic.changePoints',player,-wager);
		
		//check if no more players
		if(this.props.gameLogic["FJ"]["remaining"].length<=1) {
			Meteor.call('gameLogic.setState', "complete");
		}else{
			Meteor.call('gameLogic.removeFJ',player);
		}
	},
	handleStart:function () {
		if(this.readyToStart()=="ready") {
			var game = gameDatabase.find({name: this.props.gameLogic["gameName"]}).fetch()[0];
			Meteor.call('gameQuestions.load',game);
			Meteor.call('gameLogic.setupPlayers');
			Meteor.call('gameLogic.advance');
		}
	},
	readyToStart:function () {
		if(this.playerCount() < 2){
			return "morePlayers";
		}else if(this.props.gameLogic["gameName"]!="Please select a game"){
			if(this.isValid(this.props.gameLogic["gameName"])){
				return "ready";
			}else{
				return "invalidGame";
			}
		}else{
			return "gameSelection";
		}
	},
	isValid:function(gameName){
		//Todo add in game checking functionality for entire game
		var game = gameDatabase.find({name: this.props.gameLogic["gameName"]}).fetch()[0];
		if(game === undefined){
			Meteor.call('gameLogic.setGame',"Please select a game");
			return false;
		}
		var tempRound;
		
		//SJ & DJ
		for (var h=1;h<=2;h++) {
			if(h==1){
				tempRound=game.Jeopardy;
			}else{
				tempRound=game.DoubleJeopardy;
			}
			var catCount = 0;
			for (var i = 1; i <= 6; i++) {
				//code to remove category name if questions are empty
				var bundle = {};
				var currentCategory = tempRound["category" + i];
				var empty = true;
				for (var q = 1; q <= 5; q++) {
					if (currentCategory["question" + q]["question"].trim() != "") {
						empty = false;
					}
				}
				if (empty) {
					tempRound["category" + i]["categoryName"] = "";
				}
				
				//only categories with a name are counted
				currentCategory = tempRound["category" + i];
				var catName = currentCategory["categoryName"];
				if (catName.trim() != "") {
					catCount++;
				}
			}
			if (catCount==0){
				return false;
			}
		}
		//FJ
		tempRound=game.FinalJeopardy;
		var hasCategory = game.FinalJeopardy.category;
		var hasQuestion = game.FinalJeopardy.question;
		
		return hasCategory && hasQuestion;
		
		
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
			switch (this.readyToStart()){
				case "ready":
					return (
						<div style={{
							padding: 0,
							border: "none",
							backgroundColor: "#eaeaea",
							color: "green",
							flex: 1,
							verticalAlign: "middle",
						}} onClick={this.handleStart}
						>Start {this.playerCount()} player Game</div>);
				case "morePlayers":
					return(
						<div style={{
							padding: 0,
							border: "none",
							backgroundColor: "#eaeaea",
							color: "#a5a5a5",
							flex: 1,
							verticalAlign: "middle"
						}}>Waiting for Players</div>);
				
				case "gameSelection":
					return (
						<div style={{
							padding: 0,
							border: "none",
							backgroundColor: "#eaeaea",
							color: "#a5a5a5",
							flex: 1,
							verticalAlign: "middle"
						}}>Waiting for Game selection</div>);
				case "invalidGame":
					return (
						<div style={{
							padding: 0,
							border: "none",
							backgroundColor: "red",
							color: "white",
							flex: 1,
							verticalAlign: "middle"
						}}>Pick a Valid Game</div>);
			}
			
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
					Meteor.call('gameLogic.resetCurrentQuestionLogic');
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
			
			case "categoryIntro":
				if(round==3) {
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
								Meteor.call('gameLogic.setState', 'FJwager');
							}}
							>Reveal Category
							</div>
						</div>
					);
				}else{
					return [];
				}
			case "FJwager":
				if(this.props.gameLogic["currentQuestionLogic"]["RungInLate"].length>0) {
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
								Meteor.call('gameLogic.setState', 'FJread');
							}}
							>Reveal Question
							</div>
						</div>
					);
				}else{
					return <div style={{
						padding: 0,
						border: "none",
						backgroundColor: "#eaeaea",
						color: "#a5a5a5",
						flex: 1,
						verticalAlign: "middle"
					}}>Waiting for Wagers</div>;
				}
			case "FJread":
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
							Meteor.call('gameLogic.setState', 'FJopen');
						}}
						>Open Question
						</div>
					</div>
				);
			case "FJopen":
				return(
					<div className="flex-container" style={{flex: 1}}>
						<div style={{
							padding: 0,
							border: "none",
							backgroundColor: "#eaeaea",
							color: "#a5a5a5",
							flex: 1,
							verticalAlign: "middle"
						}}>Waiting for answers</div>
					</div>
				);
			case "FJanswer":
				if(this.props.gameLogic["FJ"]["remaining"]=="empty"){
					//Initialization code
					Meteor.call('gameLogic.setupFinalAnswer');
				}
				if(this.props.gameLogic["FJ"]["currentPlayer"]==0){
					//Get next
					Meteor.call('gameLogic.getFJNext');
				}
				return (
					<div className="flex-container" style={{flex: 1}}>
						<div onClick={this.handleFJIncorrect} style={{
							padding: 0,
							border: "none",
							backgroundColor: "red",
							color: "white",
							flex: 1,
							verticalAlign: "middle"
						}}>Incorrect
						</div>
						<div onClick={this.handleFJCorrect} style={{
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