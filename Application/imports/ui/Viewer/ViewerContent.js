import React, {Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';
import "./../howler";



var TeacherContent = React.createClass({
	propTypes:{
		gameLogic:React.PropTypes.object,
		gameQuestions:React.PropTypes.object,
	},
	handleSound:function () {
		switch (this.props.gameLogic["state"]) {
			case "intro":
				switch (this.props.gameLogic["round"]) {
					case 1:
						var intro = new Howl({
							src: ['./../Jp/jintrofade.mp3'],
						});
						intro.once('load', function () {
							intro.play();
						});
						intro.on('end', function () {
							Meteor.call('gameLogic.setState', 'categories');
						});
						break;
					case 2:
						var DJintro = new Howl({
							src: ['./../Jp/DJ.mp3'],
						});
						DJintro.once('load', function () {
							DJintro.play();
						});
						DJintro.on('end', function () {
							Meteor.call('gameLogic.setState', 'categories');
						});
						break;
					case 3:
						var FJintro = new Howl({
							src: ['./../Jp/FJ.mp3'],
						});
						FJintro.once('load', function () {
							FJintro.play();
						});
						FJintro.on('end', function () {
							Meteor.call('gameLogic.setState', 'categories');
						});
						break;
				}
				
				break;
			
			case "categories":
				
				break;
		}
	},
	renderContent:function () {
		this.handleSound();
		return <div className="flex-container" style={{fontFamily:"gyparody",fontSize:"20vmin",flex:1,alignItems:"center",justifyContent:"center",
			whiteSpace: "pre-wrap",}}>Jeopardy!</div>
	},
	render:function () {
		return(
			<div className="flex-container" style={{flex:1,flexDirection:"column"}}>
				{this.renderContent()}
			</div>
		);
	}
});

module.exports = TeacherContent;