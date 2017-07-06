import PropTypes from 'prop-types';
import React from "react";

import EditModal from "./EditModal";


const divStyle = {
	display: 'flex',
	flex: 1,
	textAlign: 'center',
	flexDirection: 'column',
	margin: 0,
	whiteSpace: "pre-wrap",
	fontSize: "1.8vmin",
};
const redStyle = {
	display: 'flex',
	flex: 1,
	textAlign: 'center',
	flexDirection: 'column',
	margin: 0,
	whiteSpace: "pre-wrap",
	fontSize: "1.8vmin",
	backgroundColor: "red",
};

class Question extends React.Component {
    static propTypes = {
		roundName: PropTypes.string,
		key1: PropTypes.string,
		key2: PropTypes.string,
		game: PropTypes.object,
		cell: PropTypes.object,
	};

    state = {
        isImageOkay: true,
        EditModal: false,
    };

    handleQuestionClick = () => {
		if (!this.state.EditModal) {
			this.setState({EditModal: true})
		}
	};

    handleClose = () => {
		this.setState({EditModal: false});
	};

    handleEditModule = () => {
		if (this.state.EditModal) {
			return (
				<EditModal
					roundName={this.props.roundName}
					key1={this.props.key1}
					key2={this.props.key2}
					question={this.props.cell.question}
					answer={this.props.cell.answer}
					isSinglePlay={this.props.cell.isSinglePlay}
					isHeader={false}
					handleClose={this.handleClose}
				/>)
		}
		else {
			return [];
		}
	};

    renderQuestion = () => {
		let questionContent;
		let questionType;
		if (typeof this.props.cell.question === "string") {
			questionContent = this.props.cell.question;
			questionType = "text";
		}
		else {
			if (this.props.cell.question.type === "image") {
				questionContent = this.props.cell.question.text;
				questionType = "image";
			}
			else {
				questionContent = this.props.cell.question.VID;
				questionType = "video";
				
			}
		}
		let extraContent = () => {
			let content = this.props.cell.isSinglePlay ? "SINGLE PLAY" : "";
			switch (questionType) {
				case "image":
					content += " 📷 ";
					return [content,
						<img key="1" src={this.props.cell.question.image} style={{height: 0, width: 0, display: "none"}}
						     onError={this.brokenImage}/>];
					break;
				case "video":
					content += " ▶ ";
					break;
			}
			return content;
		};
		{/*add logic for alternate question logic "▶ 📷"*/
		}
		return [<p style={{margin: 0}} className="question"
		           key={this.props.key1 + this.props.key2 + "question"}>{questionContent}</p>,
			<h6 style={{margin: 0}} key={this.props.key1 + this.props.key2 + "extra"}>{extraContent()}</h6>]
		
	};

    brokenImage = () => {
		if (this.state.isImageOkay)
			this.setState({isImageOkay: false});
	};

    componentWillReceiveProps(nextProps) {
		this.setState({isImageOkay: true});
	}

    getValue = () => {
		let value;
		let multiplier;
		switch (this.props.roundName) {
			case "Jeopardy":
				multiplier = 1;
				break;
			
			case "DoubleJeopardy":
				multiplier = 2;
				break;
			case "FinalJeopardy":
				return "Final Jeopardy";
		}
		switch (this.props.key2) {
			case "question1":
				value = 200;
				break;
			case "question2":
				value = 400;
				break;
			case "question3":
				value = 600;
				break;
			case "question4":
				value = 800;
				break;
			case "question5":
				value = 1000;
				break;
		}
		return "$" + value * multiplier;
	};

    render() {
		return (
			<div style={this.state.isImageOkay ? divStyle : redStyle} title={this.getValue()}>
				<div className="Rtable-cell" onClick={this.handleQuestionClick}>
					{this.renderQuestion()}
					<p style={{margin: 0}}>{this.props.cell.answer}</p>
				</div>
				{this.handleEditModule()}
			</div>)
	}
}

module.exports = Question;