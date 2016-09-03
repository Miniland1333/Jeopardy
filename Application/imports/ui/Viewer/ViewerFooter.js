import React, {Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';


import ScoreBoard from "../Teacher/ScoreBoard";
import {gameLogic} from "../../api/gameLogic";

var ViewerFooter = React.createClass({
	propTypes:{
		gameLogic:React.PropTypes.object,
	},
	renderInput:function() {
		console.log(this.props.gameLogic);
		var isSetup = !this.props.gameLogic["round"];
		
		if(isSetup) {
			return $.map(this.props.gameLogic["setupPlayers"], function (contents, field) {
				return (
					<ScoreBoard key={field}
					            playerLogic={contents}
					            gameLogic={gameLogic.find().fetch()[0]}
					            round={gameLogic.find().fetch()[0]["round"]}/>)
			});
		} else {
			return $.map(this.props.gameLogic, function (contents, field) {
				if (field.includes("player")) {
					return (
						<ScoreBoard key={field}
						            playerLogic={contents}
						            gameLogic={gameLogic.find().fetch()[0]}
						            round={gameLogic.find().fetch()[0]["round"]}/>)
				}
			});
		}
	},
	render:function () {
		
		return (
			<div className="flex-container" id="border">
				{this.renderInput()}
			</div>
		);
	}
	
});

module.exports = ViewerFooter;


{/*
 <div className="flex-container" id="full">
 <div className="flex-container"
 style={{padding: "10px", border: "4px solid white", flexDirection: "column", flex: 1,}}>
 <div 
 style={{fontFamily: "D7", fontSize: "4vw", minWidth: "10vw", borderRadius: 8,}}>000000
 </div>
 <div >Hanks</div>
 </div>
 <div className="flex-container" style={{
 padding: "10px",
 border: "4px solid white",
 flexDirection: "column",
 flex: 1,
 backgroundColor: "green"
 }}>
 <div 
 style={{fontFamily: "D7", fontSize: "4vw", minWidth: "10vw", borderRadius: 8,}}>000000
 </div>
 <div >Hanks</div>
 </div>
 <div className="flex-container" style={{
 padding: "10px",
 border: "4px solid white",
 flexDirection: "column",
 flex: 1,
 backgroundColor: "red"
 }}>
 <div 
 style={{fontFamily: "D7", fontSize: "4vw", minWidth: "10vw", borderRadius: 8,}}>-2000
 </div>
 <div >Hanks</div>
 </div>
 <div className="flex-container" style={{
 padding: "10px",
 border: "4px solid white",
 flexDirection: "column",
 flex: 1,
 backgroundColor: "orange"
 }}>
 <div 
 style={{fontFamily: "D7", fontSize: "4vw", minWidth: "10vw", borderRadius: 8,}}>000000
 </div>
 <div >Hanks</div>
 </div>
 </div>
 */}
