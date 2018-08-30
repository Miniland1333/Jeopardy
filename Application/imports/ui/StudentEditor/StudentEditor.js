import React from "react";
import {withTracker} from "meteor/react-meteor-data";
import DocumentTitle from "react-document-title";
import {Meteor} from "meteor/meteor";

import {gameDatabase} from "../../api/gameDatabase";
import {editorDatabase} from "../../api/editorDatabase";
import EditorHeader from "./EditorHeader";
import EditorTable from "../Editor/EditorTable";
import Ping from "../Ping";
import refresh from "./../refresh";
import deepEqual from "deep-equal";

class StudentEditor extends React.Component {
	state = {
		round: "Single",
		name: "hagnew", //TODO: Remove this autologin
	};

	handleRoundChange = (round) => {
		this.setState({round: round});
	};

	componentDidMount() {
		refresh();
	}

	componentDidUpdate() {
		if (this.props.isReady && !this.state.name) {
			let name = "hg";
			do {
				name = prompt("Enter editor username");
				if (name === "mainEditor") {
					alert("That name is not allowed");
					name = "";
				}
			} while (!name);
			this.setState({name: name.trim()});
			Meteor.call('editorDatabase.studentEditor', name);
			this.setState({old: editorDatabase.find({username: name}).fetch()[0]});
		}
	}

/*	shouldComponentUpdate(nextProps, nextState) {
		return this.state !== nextState ||
			this.props.isReady !== nextProps.isReady ||
			!deepEqual(this.props.gameDatabase, nextProps.gameDatabase) ||
			!deepEqual(this.state.old, editorDatabase.find({username: this.state.name}).fetch()[0]);
	}

	static getDerivedStateFromProps(state) {
		return {old: editorDatabase.find({username: state.name}).fetch()[0]};
	}*/

	render() {
		return (
			<DocumentTitle title='Jeopardy Editor'>
				<div className="Main">
					{this.props.isReady && this.state.name ?
						<div className="flex-container" style={{flexDirection: "column", flex: 1}}>
							<EditorHeader
								onRoundChange={this.handleRoundChange}
								gameList={gameDatabase.find({username: this.state.name}).fetch()}
								editorDatabase={editorDatabase.find({username: this.state.name}).fetch()[0]}
								dbReady={this.props.isReady}
								student={this.state.name}
							/>
							<EditorTable
								round={this.state.round}
								editorDatabase={editorDatabase.find({username: this.state.name}).fetch()[0]}
								student={this.state.name}
							/>
							<Ping name={"Editor " + (this.state.name || Math.round(Math.random() * 1000))}/>
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
		editorDatabase: editorDatabase.find().fetch(),
		gameDatabase: gameDatabase.find().fetch(),
		connectionId: Meteor.connection._lastSessionId,
	};
})(StudentEditor);