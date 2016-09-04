import React, {Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';
import "./../howler";



var TeacherContent = React.createClass({
	propTypes:{
		gameLogic:React.PropTypes.object,
		gameQuestions:React.PropTypes.object,
	},
	handleSound:function () {
		if(this.props.gameLogic["state"]=="intro"){
			if(this.props.gameLogic["round"]==1) {
				var intro = new Howl({
					src: ['./../Jp/jintrofade.mp3'],
					autoplay: true,
				});
				intro.on('end', function(){
				});
			}else if(this.props.gameLogic["round"]==2){
				var DJintro = new Howl({
					src: ['./../Jp/DJ.mp3'],
					autoplay: true,
				});
				DJintro.on('end', function(){
				});
			}else if(this.props.gameLogic["round"]==3){
				var FJintro = new Howl({
					src: ['./../Jp/FJ.mp3'],
					autoplay: true,
				});
				FJintro.on('end', function(){
				});
			}
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