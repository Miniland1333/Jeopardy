import React from "react";
import {withTracker} from "meteor/react-meteor-data";
import DocumentTitle from "react-document-title";
import {Meteor} from "meteor/meteor";

import {gameDatabase} from "../../api/gameDatabase";
import {editorDatabase} from "../../api/editorDatabase";
import EditorHeader from "./EditorHeader";
import EditorTable from "./EditorTable";
import Ping from "../Ping";
import refresh from "./../refresh";

class Editor extends React.Component {
	state = {
		round: "Single",
	};

	handleRoundChange = (round) => {
		this.setState({round: round});
	};

	componentDidMount() {
		refresh();
	}

	render() {
		if (!this.props.editorDatabase.length) {
			if(this.props.isReady) {
				Meteor.call("editorDatabase.init");
			}
			return <DocumentTitle title='Jeopardy Editor'>
				<div className="Main"/>
			</DocumentTitle>;
		}
		else
			return (
				<DocumentTitle title='Jeopardy Editor'>
					<div className="Main">
						{this.props.isReady ?
							<div className="flex-container" style={{flexDirection: "column", flex: 1}}>
								<EditorHeader
									onRoundChange={this.handleRoundChange}
									gameList={this.props.gameDatabase}
									editorDatabase={this.props.editorDatabase[0]}
									dbReady={this.props.isReady}
									student={"mainEditor"}
								/>
								<EditorTable
									round={this.state.round}
									editorDatabase={this.props.editorDatabase[0]}
									student={"mainEditor"}
								/>
								<Ping name={"Editor " + Math.round(Math.random() * 1000)}/>
							</div> : <div/>
						}
					</div>
				</DocumentTitle>
			)
	}
}


export default withTracker(() => {
	const handle1 = Meteor.subscribe('gameDatabase');
	const handle2 = Meteor.subscribe('editorDatabase');
	return {
		isReady: handle1.ready() && handle2.ready(),
		editorDatabase: editorDatabase.find({username: "mainEditor"}).fetch(),
		gameDatabase: gameDatabase.find().fetch(),
	};
})(Editor);