import React from "react";
import {withTracker} from "meteor/react-meteor-data";
import DocumentTitle from "react-document-title";
import {Meteor} from "meteor/meteor";
import refresh from "./../refresh";
import {gameLogic} from "../../api/gameLogic";

import StudentHeader from "./StudentHeader";
import StudentContent from "./StudentContent";


class Student extends React.Component {
	componentDidMount() {
		refresh();
		window.scrollTo(0, 0)
	}
	
	render() {
		return (
			<DocumentTitle title='Jeopardy'>
				<div className="Main">
					{this.props.isReady ?
						<div className="flex-container" style={{flexDirection: "column", flex: 1}}>
							<StudentHeader gameLogic={this.props.gameLogic[0]}/>
							<StudentContent gameLogic={this.props.gameLogic[0]}/>
						</div> : <div/>}
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