import React, {Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';

import ScoreBoard from "./ScoreBoard";
import {gameLogic} from "../../api/gameLogic";

var StudentHeader = React.createClass({
	propTypes:{
		gameLogic:React.PropTypes.object,
	},
	renderInput:function() {
		console.log(this.props.gameLogic);
		var isSetup = !this.props.gameLogic["round"];
		
		if (isSetup) {
			return $.map(this.props.gameLogic["setupPlayers"], function (contents, field) {
				return (
					<ScoreBoard key={field}
					            playerLogic={contents}
					            gameLogic={gameLogic.find().fetch()[0]}
					            round={gameLogic.find().fetch()[0]["round"]}
					            connectionId={Meteor.connection._lastSessionId}/>)
			});
		} else {
			return $.map(this.props.gameLogic, function (contents, field) {
				if (field.includes("player")) {
					return (
						<ScoreBoard key={field}
						            playerLogic={contents}
						            gameLogic={gameLogic.find().fetch()[0]}
						            round={gameLogic.find().fetch()[0]["round"]}
						            connectionId={Meteor.connection._lastSessionId}/>)
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

module.exports = StudentHeader;
