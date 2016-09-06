import React, {Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';

import {gameDatabase} from "../../api/gameDatabase";

var TeacherFooter = React.createClass({
	propTypes:{
		gameLogic:React.PropTypes.object,
	},
	handleCorrect:function () {
		
	},
	handleIncorrect:function () {
		
	},
	handleStart:function () {
		if(this.readyToStart()) {
			var game = gameDatabase.find({name: this.props.gameLogic["gameName"]}).fetch()[0];
			Meteor.call('gameQuestions.load',game);
			Meteor.call('gameLogic.setupPlayers');
			Meteor.call('gameLogic.advance');
			Meteor.call('gameQuestions.checkRemainingColumns');
		}
	},
	advance:function () {
		Meteor.call('gameLogic.advance');
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
			case "answer":
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