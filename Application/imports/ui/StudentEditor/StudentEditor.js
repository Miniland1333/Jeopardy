import React from "react";
import {withTracker} from "meteor/react-meteor-data";
import DocumentTitle from "react-document-title";
import {Meteor} from "meteor/meteor";

import {gameDatabase} from "../../api/gameDatabase";
import EditorHeader from "../Editor/EditorHeader";
import EditorTable from "../Editor/EditorTable";
import Ping from "../Ping";
import refresh from "./../refresh";

class StudentEditor extends React.Component {
	constructor(props) {
		super(props);
		//initializes editorDatabase
		const categoryTemplate = {
			categoryName: "",
			categoryExplanation: "",
		};
		for (let i = 1; i <= 5; i++) {
			categoryTemplate["question" + i] = {
				isSinglePlay: false,
				question: "",
				answer: "",
			};
		}

		const gameTemplate = {};
		for (let j = 1; j <= 6; j++) {
			gameTemplate["category" + j] = categoryTemplate;
		}
		this.state = {
			editorDatabase: {
				name: "",
				Jeopardy: gameTemplate,
				DoubleJeopardy: gameTemplate,
				FinalJeopardy: {
					category: "",
					question: "",
					answer: "",
				},
			},
			round: "Single",
		}

	}

	handleRoundChange = (round) => {
		this.setState({round: round});
	};

	componentDidMount() {
		refresh();
	}

	render() {
		return (
			<DocumentTitle title='Jeopardy Editor'>
				<div className="Main">
					{this.props.isReady ?
						<div className="flex-container" style={{flexDirection: "column", flex: 1}}>
							<EditorHeader
								onRoundChange={this.handleRoundChange}
								gameList={this.props.gameDatabase}
								editorDatabase={[this.state.editorDatabase]}
								dbReady={this.props.isReady}/>
							<EditorTable
								round={this.state.round}
								editorDatabase={[this.state.editorDatabase]}
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
	return {
		isReady: handle1.ready(),
		gameDatabase: gameDatabase.find().fetch(),
	};
})(StudentEditor);