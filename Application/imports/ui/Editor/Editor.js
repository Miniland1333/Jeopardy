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
	
	componentDidMount(){
		refresh();
	}
	
	render() {
		return (
			<DocumentTitle title='Jeopardy Editor'>
				<div className="Main">
					{this.props.isReady ?
						<div className="flex-container" style={{flexDirection: "column", flex:1}}>
							<EditorHeader
								onRoundChange={this.handleRoundChange}
								gameList={this.props.gameDatabase}
								editorDatabase={this.props.editorDatabase}
								dbReady={this.props.isReady}/>
							<EditorTable
								round={this.state.round}
								editorDatabase={this.props.editorDatabase}
							/>
							<Ping name={"Editor"}/>
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
	};
})(Editor);