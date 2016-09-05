import React, {Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';
import "./../howler";

import Question from "./Question";

var ViewerContent = React.createClass({
	propTypes:{
		gameLogic:React.PropTypes.object,
		gameQuestions:React.PropTypes.object,
	},
	handleSound:function () {
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
				}
				break;
			case "":
			case "pickQuestion":
				var scrap = new Howl({
					src:['./../Jp/jtime.mp3'],
				});
				Howler.unload();
				break;
		}
	},
	renderContent:function () {
		if(this.props.gameLogic["round"]==0&&this.props.gameLogic["state"]!=""){
			Meteor.call('gameLogic.setState',"");
		}
		this.handleSound();
		switch (this.props.gameLogic["state"]) {
			case "":
			case "intro":
			case "categoryIntro":
				return <div className="flex-container" style={{fontFamily:"gyparody",fontSize:"20vmin",flex:1,alignItems:"center",justifyContent:"center",
					whiteSpace: "pre-wrap",}}>Jeopardy!</div>;
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
		}
		
	},
	render:function () {
		return(
			<div className="flex-container" style={{flex:1,flexDirection:"column"}}>
				{this.renderContent()}
			</div>
		);
	}
});

module.exports = ViewerContent;