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
				Howler.unload();
				switch (this.props.gameLogic["round"]) {
					case 1:
						var intro = new Howl({
							src: ['./../Jp/jintrofade.mp3'],
							autoplay:true,
						});
						intro.on('end', function () {
							Meteor.call('gameLogic.setState', 'categories');
						});
						break;
					case 2:
						var DJintro = new Howl({
							src: ['./../Jp/DJ.mp3'],
							autoplay:true,
						});
						DJintro.on('end', function () {
							Meteor.call('gameLogic.setState', 'categories');
						});
						break;
					case 3:
						var FJintro = new Howl({
							src: ['./../Jp/FJ.mp3'],
							autoplay:true,
						});
						FJintro.on('end', function () {
							Meteor.call('gameLogic.setState', 'categories');
						});
						break;
				}
				break;
			
			case "categories":
				Howler.unload();
				switch (this.props.gameLogic["round"]) {
					case 1:
						var Jcat = new Howl({
							src:['./../Jp/Jcat.mp3'],
							autoplay:true,
						});
						break;
					case 2:
						var DJcat = new Howl({
							src:['./../Jp/DJcat.mp3'],
							autoplay:true,
						});
						DJcat.once('load', function () {
							DJcat.play();
						});
						break;
					
					case 3:
						break;
				}
					break;
			case "":
				var scrap = new Howl({
					src:['./../Jp/jtime.mp3'],
				});
				Howler.unload();
		}
	},
	renderContent:function () {
		if(this.props.gameLogic["round"]==0&&this.props.gameLogic["state"]!=""){
			Meteor.call('gameLogic.setState',"");
		}
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