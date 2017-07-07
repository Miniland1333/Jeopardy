import PropTypes from "prop-types";
import React from "react";


import ScoreBoard from "./ScoreBoard";
import {gameLogic} from "../../api/gameLogic";

export default class TeacherHeader extends React.Component {
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
					            round={gameLogic.find().fetch()[0]["round"]}/>)
			});
		}
		else {
			return $.map(this.props.gameLogic, function (contents, field) {
				if (field.includes("player")) {
					return <ScoreBoard key={field}
					                   playerLogic={contents}
					                   gameLogic={gameLogic.find().fetch()[0]}
					                   round={gameLogic.find().fetch()[0]["round"]}/>
				}
			});
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