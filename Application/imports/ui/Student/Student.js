import React from "react";
import {createContainer} from "meteor/react-meteor-data";
import DocumentTitle from "react-document-title";
import {Meteor} from "meteor/meteor";

import {gameLogic} from "../../api/gameLogic";

import StudentHeader from "./StudentHeader";
import StudentContent from "./StudentContent";


export const Student = React.createClass({
	getInitialState: function () {
		return {
			teamNumber: "", //this is set during Start or during reconnect
		}
	},
	render: function () {
		return (
			<DocumentTitle title='Jeopardy'>
				<div>
					{this.props.isReady ?
						<div className="flex-container Main" style={{flexDirection: "column"}}>
							<StudentHeader gameLogic={this.props.gameLogic[0]}/>
							<StudentContent gameLogic={this.props.gameLogic[0]}/>
						</div> : <div/>
					}
					{/*					<div style={{position: "fixed", width: "100vw", top: 0}}>
					 </div>
					 <div id="buffer" style={{height: '200vh'}}/>*/}
				</div>
			</DocumentTitle>
		)
	}
});


export default createContainer(() => {
	const handle1 = Meteor.subscribe('gameLogic');
	
	return {
		isReady: handle1.ready(),
		connectionId: Meteor.connection._lastSessionId,
		gameLogic: gameLogic.find().fetch(),
	};
}, Student);