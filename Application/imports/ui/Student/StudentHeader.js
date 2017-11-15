import PropTypes from "prop-types";
import React from "react";
import {Meteor} from "meteor/meteor";

import ScoreBoard from "./ScoreBoard";
import {gameLogic} from "../../api/gameLogic";

export default class StudentHeader extends React.Component {
	static propTypes = {
		gameLogic: PropTypes.object,
	};
	
	renderInput = () => {
		const isSetup = !this.props.gameLogic["round"];
		
		if (isSetup) {
			return $.map(this.props.gameLogic["setupPlayers"], function (contents, field) {
				return (
					<ScoreBoard key={field}
					            playerLogic={contents}
					            gameLogic={gameLogic.find().fetch()[0]}
					            round={gameLogic.find().fetch()[0]["round"]}
					            connectionId={Meteor.connection._lastSessionId}/>)
			});
		}
		else {
			if (!this.props.gameLogic["connections"][Meteor.connection._lastSessionId]) {
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
			else if ((this.props.gameLogic["state"] === "FJopen" || this.props.gameLogic["state"] === "FJread")) {
				return [];
			}
			else {
				let teamNumber = this.props.gameLogic["connections"][Meteor.connection._lastSessionId];
				return <ScoreBoard playerLogic={this.props.gameLogic["player" + teamNumber]}
				                   gameLogic={gameLogic.find().fetch()[0]}
				                   round={gameLogic.find().fetch()[0]["round"]}
				                   connectionId={Meteor.connection._lastSessionId}
				                   wide={true}/>
			}
		}
	};
	
	render() {
		
		return (
			<div className="flex-container" id="border">
				{this.renderInput()}
			</div>
		);
	}
}
