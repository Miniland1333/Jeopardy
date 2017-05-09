import React from "react";

import EditModal from "./EditModal";


var divStyle = {
	display: 'flex',
	flex: 1,
	textAlign: 'center',
	flexDirection: 'column',
	margin: 0,
	whiteSpace: "pre-wrap",
	fontSize: "1.8vmin",
};
var Question = React.createClass({
	getInitialState: function () {
		return {
			EditModal: false,
		};
	},
	propTypes: {
		roundName: React.PropTypes.string,
		key1: React.PropTypes.string,
		key2: React.PropTypes.string,
		game: React.PropTypes.object,
		cell: React.PropTypes.object,
	},
	handleQuestionClick: function () {
		if (!this.state.EditModal) {
			//alert("You clicked " + this.props.roundName + "," + this.props.key1 + "," + this.props.key2);
			this.setState({EditModal: true})
		}
	},
	handleClose: function () {
		this.setState({EditModal: false});
	},
	handleEditModule: function () {
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
	},
	renderQuestion: function () {
		let questionContent;
		let questionType;
		if (typeof this.props.cell.question === "string") {
			questionContent = this.props.cell.question;
			questionType = "text";
		}
		else {
			if (this.props.cell.question.type == "image") {
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
		
	},
	render: function () {
		return (
			<div style={divStyle}>
				<div className="Rtable-cell" onClick={this.handleQuestionClick}>
					{this.renderQuestion()}
					<p style={{margin: 0}}>{this.props.cell.answer}</p>
				</div>
				{this.handleEditModule()}
			</div>)
	}
	
});

module.exports = Question;