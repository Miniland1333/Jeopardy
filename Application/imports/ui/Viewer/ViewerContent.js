import React, {Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';
import "./../howler";

import Question from "./../Teacher/Question";
import CountDown from "./Countdown";


var questionStyle={
	fontSize:"10vmin",
	flex:1,
	alignItems:"center",
	justifyContent:"center",
	whiteSpace: "pre-wrap",
};

var timer;

var ViewerContent = React.createClass({
	propTypes:{
		gameLogic:React.PropTypes.object,
		gameQuestions:React.PropTypes.object,
	},
	time:5,
	lastState:"",
	handleSound:function () {
		var scrap = new Howl({
			src:['./../Jp/jtime.mp3'],
		});
		switch (this.props.gameLogic["state"]) {
			case "intro":
				switch (this.props.gameLogic["round"]) {
					case 1:
						Howler.unload();
						var intro = new Howl({
							src: ['./../Jp/jintrofade.mp3'],
							autoplay:true,
						});
						intro.on('end', function () {
							Meteor.call('gameLogic.setState', 'categoryIntro');
						});
						break;
					case 2:
						Howler.unload();
						var DJintro = new Howl({
							src: ['./../Jp/DJ.mp3'],
							autoplay:true,
						});
						DJintro.on('end', function () {
							Meteor.call('gameLogic.setState', 'categoryIntro');
						});
						break;
					case 3:
						Howler.unload();
						var FJintro = new Howl({
							src: ['./../Jp/FJ.mp3'],
							autoplay:true,
						});
						FJintro.on('end', function () {
							Meteor.call('gameLogic.setState', 'categoryIntro');
						});
						break;
				}
				break;
			
			case "categoryIntro":
				switch (this.props.gameLogic["round"]) {
					case 1:
						Howler.unload();
						var Jcat = new Howl({
							src:['./../Jp/Jcat.mp3'],
							autoplay:true,
						});
						Jcat.on('end', function () {
							Meteor.call('gameLogic.setState', 'categories');
						});
						break;
					case 2:
						Howler.unload();
						var DJcat = new Howl({
							src:['./../Jp/DJcat.mp3'],
							autoplay:true,
						});
						DJcat.on('end', function () {
							Meteor.call('gameLogic.setState', 'categories');
						});
						break;
					case 3:
						Howler.unload();
						var FJcat = new Howl({
							src:['./../Jp/jfinalj.mp3'],
							autoplay:true,
						});
						FJcat.on('end', function () {
							Meteor.call('gameLogic.setState', 'FJwager');
						});
						break;
				}
				break;
			case "DailyDouble":
				Howler.unload();
				var DD = new Howl({
					src:['./../Jp/jdaily2x.mp3'],
					autoplay:true,
				});
				DD.on('end', function () {
					Meteor.call('gameLogic.setState', 'wager');
				});
				break;
			case "FJopen":
				Howler.unload();
				var FJ = new Howl({
					src:['./../Jp/jthink.mp3'],
					autoplay:true,
				});
				FJ.on('end', function () {
					Meteor.call('gameLogic.setState', 'FJanswer');
				});
				break;
			case "pickQuestion":
				Howler.unload();
				break;
			case "complete":
				Howler.unload();
				var loop = new Howl({
					src:['./../Jp/jloop.mp3'],
					autoplay:true,
					loop: true,
				});
				loop.on('load',function () {
					loop.fade(0,1,1000);
				});
		}
	},
	renderContent:function () {
		console.log("ViewerRender",this.props.gameLogic["round"],this.props.gameLogic["state"]);
		if(this.props.gameLogic["round"]==0&&this.props.gameLogic["state"]!=""){
			Meteor.call('gameLogic.setState',"");
		}
		this.handleSound();
		switch (this.props.gameLogic["state"]) {
			case "":
			case "intro":
			case "categoryIntro":
				clearInterval(timer);
				var title;
				switch (this.props.gameLogic["round"]){
					case 1:
						return <div className="flex-container" style={{fontFamily:"gyparody",fontSize:"20vmin",flex:1,alignItems:"center",justifyContent:"center",
							whiteSpace: "pre-wrap",}}>Jeopardy!</div>;
					case 2:
						return <div className="flex-container" style={{fontFamily:"gyparody",fontSize:"20vmin",flex:1,alignItems:"center",justifyContent:"center",
							whiteSpace: "pre-wrap",}}>Double<br/>Jeopardy!</div>;
					case 3:
						return <div className="flex-container" style={{fontFamily:"gyparody",fontSize:"20vmin",flex:1,alignItems:"center",justifyContent:"center",
							whiteSpace: "pre-wrap",}}>Final<br/>Jeopardy!</div>;
				}
				break;
			case "categories":
				return <div key="" className="Table">
					{$.map(this.props.gameQuestions["currentRound"], function (column, key1) {
						return (
							<div className="Column" key={key1}>
								{$.map(column, function (cell, key2) {
									return key2 == "categoryName" ?
										<div className="Header" key={key1 + "H"} style={{alignItems:"center", justifyContent:"center",fontSize:"2vmin",}}>{cell}</div>
										:
										[];
									
								})}
							</div>
						)
					})}
				</div>;
				break;
			case "pickQuestion":
				var round = this.props.gameLogic["round"];
				this.lastState="pickQuestion";
				return <div key="" className="Table">
					{$.map(this.props.gameQuestions["currentRound"], function (column, key1) {
						return (
							<div className="Column" key={key1}>
								{$.map(column, function (cell, key2) {
									return key2 == "categoryName" ?
										<div className="Header" key={key1 + "H"} style={{alignItems:"center", justifyContent:"center",fontSize:"2vmin",}}>{cell}</div>
										:
										<Question key={key1 + key2} cell={cell} round={round} key1={key1} key2={key2}/>;
									
								})}
							</div>
						)
					})}
				</div>;
			case "DailyDouble":
			case "wager":
				return <div className="flex-container" style={{fontFamily:"gyparody",fontSize:"20vmin",flex:1,alignItems:"center",justifyContent:"center",
					whiteSpace: "pre-wrap",}}>Daily<br/>Double</div>;
			
			case "open":
				if(this.lastState!="open") {
					this.lastState="open";
					clearInterval(timer);
					this.time = 5;
					var time = new Howl({
						src: ['./../Jp/jtime.mp3'],
					});
					timer = setInterval(()=> {
						if (this.time > 0) {
							this.time -= 1;
							this.forceUpdate();
						}
						if (this.time == 0) {
							clearInterval(timer);
							time.play(undefined, false);
							this.forceUpdate();
							Meteor.call('gameLogic.setState', "next");
						}
					}, 1000);
				}
				return(
					<div className="flex-container" style={{flexDirection:"column",flex:1}}>
						<div style={questionStyle}>{this.props.gameQuestions["currentQuestion"]["question"]}</div>
					</div>);
			case "answer":
			case "DDanswer":
				if(this.lastState!="answer"&&this.lastState!="DDanswer") {
					this.lastState=this.props.gameLogic["state"];
					clearInterval(timer);
					this.time = 5;
					var time1 = new Howl({
						src: ['./../Jp/jtime.mp3'],
					});
					timer = setInterval(()=> {
						if (this.time > 0) {
							this.time -= 1;
							this.forceUpdate();
						}
						if (this.time == 0) {
							this.forceUpdate();
							time1.play(undefined, false);
							clearInterval(timer);
						}
					}, 1000);
				}
				return(
					<div className="flex-container" style={{flexDirection:"column",flex:1}}>
						<div style={questionStyle}>{this.props.gameQuestions["currentQuestion"]["question"]}</div>
					</div>);
			case "read":
			case "next":
			case "DDread":
				this.lastState=this.props.gameLogic["state"];
				return(
					<div className="flex-container" style={{flexDirection:"column",flex:1}}>
						<div style={questionStyle}>{this.props.gameQuestions["currentQuestion"]["question"]}</div>
					</div>);
			
			case "FJwager":
				return <div style={{fontSize:"20vmin",flex:1,alignItems:"center",justifyContent:"center",
					whiteSpace: "pre-wrap",}}>{this.props.gameQuestions["currentRound"]['category']}</div>;
				break;
			case "FJread":
			case "FJopen":
				return <div style={{fontSize:"20vmin",flex:1,alignItems:"center",justifyContent:"center",
					whiteSpace: "pre-wrap",}}>
					{this.props.gameQuestions["currentRound"]['question']}
					<canvas className="needsclick" style={{width:1,height:1}} id="writingPad"/></div>;
				break;
			case "FJanswer":
				paper.install(window);
				var canvas = document.getElementById('writingPad');
				paper.setup(canvas);
				paper.project.clear();
				if(this.props.gameLogic["FJ"]["currentPlayer"]){
					console.log(this.props.gameLogic["FJ"]["currentAnswer"]);
					paper.project.importJSON(this.props.gameLogic["FJ"]["currentAnswer"]);
				}
				return <canvas style={{border:"2px solid white",flex:1}} id="writingPad"/>;
			case "complete":
				var logic = this.props.gameLogic;
				//Greatest
				var greatest=0;
				var highestAmount=-999999999;
				for(var h=1;h<=logic['numPlayers'];h++){
					var playerAmount = logic['player'+h]['points'];
					if(playerAmount>highestAmount){
						greatest = h;
						highestAmount = playerAmount;
					}
				}
				if(greatest==0){
					//All Players Eliminated
					return <div className="flex-container" style={{fontSize:"20vmin",flex:1,alignItems:"center",justifyContent:"center",
						whiteSpace: "pre-wrap",}}>All Players have been eliminated</div>;
				}else {
					//Display complete
					return <div className="flex-container" style={{fontSize:"20vmin",flex:1,alignItems:"center",justifyContent:"center",
						whiteSpace: "pre-wrap",}}>Player{greatest} is the winner with a score of ${highestAmount}!</div>;
				}

		}
		
		
	},
	render:function () {
		return(
			<div className="flex-container" style={{flex:1,flexDirection:"column"}}>
				{this.renderContent()}
				<CountDown gameLogic={this.props.gameLogic} time={this.time}/>
			</div>
		);
	}
});

module.exports = ViewerContent;