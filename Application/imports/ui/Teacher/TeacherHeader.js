import PropTypes from 'prop-types';
import React from "react";


import ScoreBoard from "./ScoreBoard";
import {gameLogic} from "../../api/gameLogic";

class TeacherHeader extends React.Component {
    static propTypes = {
		gameLogic: PropTypes.object,
	};

    renderInput = () => {
		var isSetup = !this.props.gameLogic["round"];
		
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

module.exports = TeacherHeader;


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
 */
}
