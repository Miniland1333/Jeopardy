import React from "react";
import {createContainer} from "meteor/react-meteor-data";
import DocumentTitle from "react-document-title";
import {Meteor} from "meteor/meteor";

import {gameLogic} from "../../api/gameLogic";
import {gameQuestions} from "../../api/gameQuestions";

import ViewerContent from "./ViewerContent";
import ViewerFooter from "./ViewerFooter";

var Viewer = React.createClass({
	render: function () {
		return (
			<DocumentTitle title='Jeopardy Viewer'>
				<div>
					{this.props.isReady ?
						<div className="flex-container Main" style={{flexDirection: "column"}}>
							<ViewerContent gameLogic={this.props.gameLogic[0]}
							               gameQuestions={this.props.gameQuestions[0]}/>
							<ViewerFooter gameLogic={this.props.gameLogic[0]}/>
						</div> : <div></div>
					}
				</div>
			</DocumentTitle>
		)
	}
});


export default createContainer(() => {
	var handle1 = Meteor.subscribe('gameLogic');
	var handle2 = Meteor.subscribe('gameQuestions');
	
	return {
		isReady: handle1.ready() && handle2.ready(),
		
		gameLogic: gameLogic.find().fetch(),
		gameQuestions: gameQuestions.find().fetch(),
	};
}, Viewer);