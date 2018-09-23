import PropTypes from "prop-types";
import React from "react";
import {Meteor} from "meteor/meteor";


const divStyle = {
	flex: 1,
	textAlign: 'center',
	margin: 0,
	alignItems: "center",
	justifyContent: "center",
	fontSize: "5vw",
	textShadow: "3px 3px 7px black",
};

export default class Question extends React.Component {
	static propTypes = {
		round: PropTypes.number,
		key1: PropTypes.string,
		key2: PropTypes.string,
		game: PropTypes.object,
		cell: PropTypes.object,
	};
	
	handleQuestionClick = () => {
		if (this.props.cell.question != "") {
			Meteor.call('gameQuestions.pickQuestion', this.props.key1, this.props.key2, this.props.cell.question, this.props.cell.answer, this.props.cell.isSinglePlay, this.props.round);
			
			Meteor.call('gameLogic.setState', "questionDecide");
		}
	};
	
	renderContent = () => {
		let thing;
		if (this.props.cell.question != "") {
			switch (this.props.key2) {
				case "question1":
					thing = 200;
					break;
				case "question2":
					thing = 400;
					break;
				case "question3":
					thing = 600;
					break;
				case "question4":
					thing = 800;
					break;
				case "question5":
					thing = 1000;
					break;
			}
			return "$" + this.props.round * thing;
		}
		else {
			return "";
		}
	};
	
	render() {
		return (
			<div className="Rtable-cell" style={divStyle} onClick={this.handleQuestionClick}>
				{this.renderContent()}
			</div>)
	}
}