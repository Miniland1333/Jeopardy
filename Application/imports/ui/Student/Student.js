import React from "react";
import {withTracker} from "meteor/react-meteor-data";
import DocumentTitle from "react-document-title";
import {Meteor} from "meteor/meteor";
import "./../refresh";
import {gameLogic} from "../../api/gameLogic";

import StudentHeader from "./StudentHeader";
import StudentContent from "./StudentContent";


class Student extends React.Component {
	render() {
		return (
			<DocumentTitle title='Jeopardy'>
				<div>
					{this.props.isReady ?
						<div className="flex-container Main" style={{flexDirection: "column"}}>
							<StudentHeader gameLogic={this.props.gameLogic[0]}/>
							<StudentContent gameLogic={this.props.gameLogic[0]}/>
						</div> : <div/>
					}
				</div>
			</DocumentTitle>
		)
	}
}


export default withTracker(() => {
	const handle1 = Meteor.subscribe('gameLogic');
	
	return {
		isReady: handle1.ready(),
		connectionId: Meteor.connection._lastSessionId,
		gameLogic: gameLogic.find().fetch(),
	};
})(Student);