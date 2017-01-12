import React, {Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';
import "./../howler";

import Question from "./../Teacher/Question";
import CountDown from "./Countdown";


const questionStyle = {
	fontSize: "10vmin",
	flex: 1,
	alignItems: "center",
	justifyContent: "center",
	whiteSpace: "pre-wrap",
	textTransform: "uppercase",
};
const inputStyle = {
	fontSize: "10vmin",
	flex: 1,
	backgroundColor: "transparent",
	color: "white",
	alignItems: "center",
	justifyContent: "center",
	textAlign: "center",
	whiteSpace: "pre-wrap",
	border: 0,
};
const imageStyle = {
	height: "100%",
	maxWidth:"100%",
};
const imageContainer = {
	maxHeight: "100%",
	maxWidth:"100%",
	flex: 1,
	justifyContent: "center",
	alignItems:"center",
};

let timer;
const maxTimeResponse = 5;
const maxTimeAnswer = 5;
let setup = true;

//sound declarations
const intro = new Howl({src: ['./../Jp/jintrofade.mp3'],});
intro.on('end', function () {
	Meteor.call('gameLogic.setState', 'categoryIntro');
});
const DJintro = new Howl({src: ['./../Jp/DJ.mp3'],});
DJintro.on('end', function () {
	Meteor.call('gameLogic.setState', 'categoryIntro');
});
const FJintro = new Howl({src: ['./../Jp/FJ.mp3'],});
FJintro.on('end', function () {
	Meteor.call('gameLogic.setState', 'categoryIntro');
});

const Jcat = new Howl({src: ['./../Jp/Jcat.mp3'],});
Jcat.on('end', function () {
	Meteor.call('gameLogic.setState', 'categories');
});
const DJcat = new Howl({src: ['./../Jp/DJcat.mp3'],});
DJcat.on('end', function () {
	Meteor.call('gameLogic.setState', 'categories');
});
const DD = new Howl({	src: ['./../Jp/jdaily2x.mp3'],});
DD.on('end', function () {
	Meteor.call('gameLogic.setState', 'wager');
});
const FJ = new Howl({src: ['./../Jp/jthink.mp3'],});
FJ.on('end', function () {
	Meteor.call('gameLogic.setState', 'FJanswer');
});
const FJcat = new Howl({src: ['./../Jp/jfinalj.mp3'],});
const loop = new Howl({src: ['./../Jp/jloop.mp3'],loop: true,});
const time = new Howl({src: ['./../Jp/jtime.mp3'],});

export const ViewerContent = React.createClass({
	propTypes: {
		gameLogic: React.PropTypes.object,
		gameQuestions: React.PropTypes.object,
	},
	time: 5,
	lastState: "",
	
	handleSound: function () {
		switch (this.props.gameLogic["state"]) {
			case "intro":
				switch (this.props.gameLogic["round"]) {
					case 1:
						if(!intro.playing()){
							this.handleSoundStop();
							intro.play();
						}
						break;
					case 2:
						if(!DJintro.playing()){
							this.handleSoundStop();
							DJintro.play();
						}
						break;
					case 3:
						if(!FJintro.playing()){
							this.handleSoundStop();
							FJintro.play();
						}
						break;
				}
				break;
			
			case "categoryIntro":
				switch (this.props.gameLogic["round"]) {
					case 1:
						this.handleSoundStop();
						Jcat.play();
						break;
					case 2:
						this.handleSoundStop();
						DJcat.play();
						break;
					case 3:
				}
				break;
			case "DailyDouble":
				this.handleSoundStop();
				DD.play();
				break;
			case "FJopen":
				this.handleSoundStop();
				FJ.play();
				break;
			case "FJread":
				if(!FJcat.playing()){
					this.handleSoundStop();
					FJcat.play();
				}
				break;
			case "pickQuestion":
			case "":
				this.handleSoundStop();
				break;
			case "complete":
				if(!loop.playing()){
					this.handleSoundStop();
					loop.play();
				}

		}
	},
	handleSoundStop:function () {
		const soundArray = [intro,DJintro,FJintro,Jcat,DJcat,DD,FJ,loop,time];
		soundArray.forEach(function(sound){sound.stop()});
	},
	renderContent: function () {
		console.log("ViewerRender", this.props.gameLogic["round"], this.props.gameLogic["state"]);
		if (this.props.gameLogic["round"] == 0 && this.props.gameLogic["state"] != "") {
			Meteor.call('gameLogic.setState', "");
		}
		this.handleSound();
		
		switch (this.props.gameLogic["state"]) {
			case "":
				return <div className="flex-container" style={inputStyle}><input style={inputStyle}
				                                                                 defaultValue="Press F11 for fullscreen"/>
				</div>;
			case "intro":
			case "categoryIntro":
				clearInterval(timer);
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
				clearInterval(timer);
				const round = this.props.gameLogic["round"];
				this.lastState = "pickQuestion";
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
			case "read":
			case "DDread":
				this.lastState = this.props.gameLogic["state"];
				if (typeof this.props.gameQuestions["currentQuestion"]["question"] === "string") {
					return <div className="flex-container" style={{flexDirection: "column", flex: 1}}>
						<div style={questionStyle}>{this.props.gameQuestions["currentQuestion"]["question"]}</div>
					</div>;
				}
				else {
					if (this.props.gameQuestions["currentQuestion"]["question"]["type"] == "image") {
						return <div key="imageContainer" style={imageContainer}>
							<img key="image" src={this.props.gameQuestions["currentQuestion"]["question"].image} style={imageStyle}/>
						</div>
					} else {
						return <div className="flex-container" style={{flexDirection: "column", flex: 1}}>
							<iframe key="video" src={this.props.gameQuestions["currentQuestion"]["question"].URL}
							        style={{flex: 1}}></iframe>
						</div>
					}
				}
			case "wager":
				const DDwager = this.props.gameLogic["player" + this.props.gameLogic["lastWinner"]]["wager"];
				return [<div key="DDwager" className="flex-container" style={{
					fontFamily: "gyparody", fontSize: "20vmin", flex: 1, alignItems: "center", justifyContent: "center",
					whiteSpace: "pre-wrap",
				}}>Daily<br/>Double</div>,
					<div key="wager" style={{
						fontSize: "3vw",
						minWidth: "10vw",
					}}>{"Team Wager: " + DDwager}</div>];
			case "open":
				if (this.lastState != "open") {
					this.lastState = "open";
					clearInterval(timer);
					this.time = maxTimeResponse;
					timer = setInterval(() => {
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
				if (typeof this.props.gameQuestions["currentQuestion"]["question"] === "string") {
					return <div className="flex-container" style={{flexDirection: "column", flex: 1}}>
						<div style={questionStyle}>{this.props.gameQuestions["currentQuestion"]["question"]}</div>
					</div>;
				}
				else {
					if (this.props.gameQuestions["currentQuestion"]["question"]["type"] == "image") {
						return <div key="imageContainer" style={imageContainer}>
							<img key="image" src={this.props.gameQuestions["currentQuestion"]["question"].image} style={imageStyle}/>
						</div>
					} else {
						return <div className="flex-container" style={{flexDirection: "column", flex: 1}}>
							<iframe key="video"
							        src={this.props.gameQuestions["currentQuestion"]["question"].URL.replace('autoplay=1', '')}
							        style={{flex: 1}}></iframe>
						</div>
					}
				}
			case "answer":
			case "DDanswer":
				//Alternate Logic Needed
				if (this.lastState != "answer" && this.lastState != "DDanswer") {
					this.lastState = this.props.gameLogic["state"];
					clearInterval(timer);
					this.time = maxTimeAnswer;
					
					timer = setInterval(() => {
						if (this.time > 0) {
							this.time -= 1;
							this.forceUpdate();
						}
						if (this.time == 0) {
							this.forceUpdate();
							time.play(undefined, false);
							clearInterval(timer);
						}
					}, 1000);
				}
				if (typeof this.props.gameQuestions["currentQuestion"]["question"] === "string") {
					return <div className="flex-container" style={{flexDirection: "column", flex: 1}}>
						<div style={questionStyle}>{this.props.gameQuestions["currentQuestion"]["question"]}</div>
					</div>;
				}
				else {
					if (this.props.gameQuestions["currentQuestion"]["question"]["type"] == "image") {
						return <div key="imageContainer" style={imageContainer}>
							<img key="image" src={this.props.gameQuestions["currentQuestion"]["question"].image} style={imageStyle}/>
						</div>
					} else {
						return <div className="flex-container" style={{flexDirection: "column", flex: 1}}>
							<iframe key="video"
							        src={this.props.gameQuestions["currentQuestion"]["question"].URL.replace('autoplay=1', '')}
							        style={{flex: 1}}></iframe>
						</div>
					}
				}
			
			case "next":
				clearInterval(timer);
				this.lastState = this.props.gameLogic["state"];
				if (typeof this.props.gameQuestions["currentQuestion"]["question"] === "string") {
					return <div className="flex-container" style={{flexDirection: "column", flex: 1}}>
						<div style={questionStyle}>{this.props.gameQuestions["currentQuestion"]["question"]}</div>
					</div>;
				}
				else {
					if (this.props.gameQuestions["currentQuestion"]["question"]["type"] == "image") {
						return <div key="imageContainer" style={imageContainer}>
							<img key="image" src={this.props.gameQuestions["currentQuestion"]["question"].image} style={imageStyle}/>
						</div>
					} else {
						return <div className="flex-container" style={{flexDirection: "column", flex: 1}}>
							<iframe key="video"
							        src={this.props.gameQuestions["currentQuestion"]["question"].URL.replace('autoplay=1', '')}
							        style={{flex: 1}}></iframe>
						</div>
					}
				}
			
			
			case "FJwager":
				return <div style={{
					fontSize: "20vmin", flex: 1, alignItems: "center", justifyContent: "center",
					whiteSpace: "pre-wrap", textTransform: "uppercase"
				}}>{this.props.gameQuestions["currentRound"]['category']}</div>;
				break;
			case "FJread":
				if (typeof this.props.gameQuestions["currentRound"]["question"] === "string") {
					return <div className="flex-container" style={{flexDirection: "column", flex: 1}}>
						<div style={questionStyle}>{this.props.gameQuestions["currentRound"]["question"]}</div>
						<canvas className="needsclick" style={{width: 1, height: 1}} id="writingPad"/>
					</div>;
				}
				else {
					if (this.props.gameQuestions["currentRound"]["question"]["type"] == "image") {
						return <div key="imageContainer" style={imageContainer}>
							<img key="image" src={this.props.gameQuestions["currentRound"]["question"].image} style={imageStyle}/>
							<canvas className="needsclick" style={{width: 1, height: 1}} id="writingPad"/>
						</div>
					} else {
						return <div className="flex-container" style={{flexDirection: "column", flex: 1}}>
							<iframe key="video"
							        src={this.props.gameQuestions["currentRound"]["question"].URL}
							        style={{flex: 1}}></iframe>
							<canvas className="needsclick" style={{width: 1, height: 1}} id="writingPad"/>
						</div>
					}
				}
				break;
			case "FJopen":
				if (typeof this.props.gameQuestions["currentRound"]["question"] === "string") {
					return <div className="flex-container" style={{flexDirection: "column", flex: 1}}>
						<div style={questionStyle}>{this.props.gameQuestions["currentRound"]["question"]}</div>
						<canvas className="needsclick" style={{width: 1, height: 1}} id="writingPad"/>
					</div>;
				}
				else {
					if (this.props.gameQuestions["currentRound"]["question"]["type"] == "image") {
						return <div key="imageContainer" style={imageContainer}>
							<img key="image" src={this.props.gameQuestions["currentRound"]["question"].image} style={imageStyle}/>
							<canvas className="needsclick" style={{width: 1, height: 1}} id="writingPad"/>
						</div>
					} else {
						return <div className="flex-container" style={{flexDirection: "column", flex: 1}}>
							<iframe key="video"
							        src={this.props.gameQuestions["currentRound"]["question"].URL.replace('autoplay=1', '')}
							        style={{flex: 1}}></iframe>
							<canvas className="needsclick" style={{width: 1, height: 1}} id="writingPad"/>
						</div>
					}
				}
			case "FJanswer":
				if (setup) {
					setup = false;
					return <div className="flex-container" style={{flex: 1, flexDirection: "column"}}>
						<canvas style={{flex: 1}} id="writingPad"/>
						;
					</div>
					
				} else {
					paper.install(window);
					const canvas = document.getElementById('writingPad');
					paper.setup(canvas);
					paper.project.clear();
					if (this.props.gameLogic["FJ"]["currentPlayer"] != 0) {
						paper.project.importJSON(this.props.gameLogic["FJ"]["currentAnswer"]);
					}
					const player = this.props.gameLogic["FJ"]["currentPlayer"];
					let wager;
					if (player != 0) {
						wager = "Wager: " + this.props.gameLogic["player" + player]["wager"];
					} else {
						wager = "";
					}
					return (
						<div className="flex-container" style={{flex: 1, flexDirection: "column"}}>
							<canvas style={{flex: 1}} id="writingPad"/>
							<div style={{
								position: "absolute", top: 10, right: 10,
								fontSize: "3vw",
								minWidth: "10vw",
							}}>{wager}</div>
						</div>
					);
				}
			case "complete":
				const logic = this.props.gameLogic;
				//Greatest
				let greatest = 0;
				let highestAmount = 0;
				for (let h = 1; h <= logic['numPlayers']; h++) {
					const playerAmount = logic['player' + h]['points'];
					if (playerAmount > highestAmount) {
						greatest = h;
						highestAmount = playerAmount;
					}
				}
				if (greatest == 0) {
					//All Players Eliminated
					return <div className="flex-container" style={{
						fontSize: "18vmin", flex: 1, alignItems: "center", justifyContent: "center",
						whiteSpace: "pre-wrap",
					}}>All Players have been eliminated</div>;
				} else {
					//Display complete
					return <div className="flex-container" style={{
						fontSize: "10vmin", flex: 1, alignItems: "center", justifyContent: "center",
						whiteSpace: "pre-wrap",
					}}>{logic['player' + greatest]['teamName']} is the winner with a score of ${highestAmount}!</div>;
				}
			
		}
		
		
	},
	render: function () {
		return (
			<div className="flex-container" style={{flex: 1, flexDirection: "column"}}>
				{this.renderContent()}
				<CountDown gameLogic={this.props.gameLogic} time={this.time}/>
			</div>
		);
	}
});

module.exports = ViewerContent;
