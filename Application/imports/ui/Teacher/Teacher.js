import PropTypes from "prop-types";
import React from "react";
import {withTracker} from "meteor/react-meteor-data";
import DocumentTitle from "react-document-title";
import {Meteor} from "meteor/meteor";

import {gameDatabase} from "../../api/gameDatabase";
import {gameLogic} from "../../api/gameLogic";
import {gameQuestions} from "../../api/gameQuestions";

import TeacherHeader from "./TeacherHeader";
import TeacherFooter from "./TeacherFooter";
import TeacherContent from "./TeacherContent";

import Ping from "../Ping"
import "./../refresh";

class Teacher extends React.Component {
	static propTypes = {
		gameDatabase: PropTypes.array,
		gameLogic: PropTypes.array,
		gameQuestions: PropTypes.array,
	};
	
	render() {
		if (this.props.isReady && this.props.gameLogic.length === 0) {
			Meteor.call('gameLogic.init');
		}
		return (
			<DocumentTitle title='Jeopardy'>
				<div>
					{this.props.isReady ?
						<div className="flex-container Main" style={{flexDirection: "column"}}>
							<TeacherHeader gameLogic={this.props.gameLogic[0]}/>
							<TeacherContent gameLogic={this.props.gameLogic[0]}
							                gameQuestions={this.props.gameQuestions[0]}
							                gameDatabase={this.props.gameDatabase}/>
							<TeacherFooter gameLogic={this.props.gameLogic[0]}
							               gameQuestions={this.props.gameQuestions[0]}/>
							<Ping name={"Teacher"}/>
						</div> : <div/>
						
					}
				</div>
			</DocumentTitle>
		)
	}
}


export default withTracker(() => {
	const handle1 = Meteor.subscribe('gameDatabase');
	const handle2 = Meteor.subscribe('gameLogic');
	const handle3 = Meteor.subscribe('gameQuestions');
	
	return {
		isReady: handle1.ready() && handle2.ready() && handle3.ready(),
		
		gameDatabase: gameDatabase.find().fetch(),
		gameLogic: gameLogic.find().fetch(),
		gameQuestions: gameQuestions.find().fetch(),
	};
})(Teacher);