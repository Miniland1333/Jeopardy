import React from "react";
import {withTracker} from "meteor/react-meteor-data";
import DocumentTitle from "react-document-title";
import {Meteor} from "meteor/meteor";

import {gameLogic} from "../../api/gameLogic";
import {gameQuestions} from "../../api/gameQuestions";

import ViewerContent from "./ViewerContent";
import ViewerFooter from "./ViewerFooter";
import Ping from "../Ping";
import refresh from "./../refresh";

class Viewer extends React.Component {
	componentDidMount(){
		refresh();
	}
	
	render() {
		return (
			<DocumentTitle title='Jeopardy Viewer'>
				<div>
					{this.props.isReady ?
						<div className="flex-container Main" style={{flexDirection: "column"}}>
							<ViewerContent gameLogic={this.props.gameLogic[0]}
							               gameQuestions={this.props.gameQuestions[0]}/>
							<ViewerFooter gameLogic={this.props.gameLogic[0]}/>
							<Ping name={"Viewer"}/>
						</div> : <div/>
					}
				</div>
			</DocumentTitle>
		)
	}
}


export default withTracker(() => {
	const handle1 = Meteor.subscribe('gameLogic');
	const handle2 = Meteor.subscribe('gameQuestions');
	
	return {
		isReady: handle1.ready() && handle2.ready(),
		
		gameLogic: gameLogic.find().fetch(),
		gameQuestions: gameQuestions.find().fetch(),
	};
})(Viewer);