import PropTypes from "prop-types";
import React from "react";
import {Meteor} from "meteor/meteor";

import Question from "./Question";
import CategoryHeader from "./CategoryHeader";

export default class EditorTable extends React.Component {
	static propTypes = {
		round: PropTypes.string.isRequired,
		editorDatabase: PropTypes.object.isRequired,
	};

	renderInput = () => {
		let roundName;
		const self = this;
		switch (this.props.round) {
			case "Single":
				roundName = "Jeopardy";
				break;
			case "Double":
				roundName = "DoubleJeopardy";
				break;
			case "Final":
				roundName = "FinalJeopardy"
		}
		const round = this.props.editorDatabase[roundName];
		return (roundName === "FinalJeopardy" ?
				<div key="" className="Table">
					<div className="Column" key="C1">
						<CategoryHeader categoryName={round.category} roundName={roundName} key1={"category"} student={this.props.student}/>
						<Question cell={round} roundName={roundName} key1={"question"} student={this.props.student}/>
					</div>
				</div>
				:
				<div key="" className="Table">
					{$.map(round, function (column, key1) {
						return (
							<div className="Column" key={key1}>
								<CategoryHeader key={key1 + "H"} categoryName={round[key1].categoryName} roundName={roundName} categoryExplanation={round[key1].categoryExplanation} key1={key1} student={self.props.student}/>
								{$.map(column, function (cell, key2) {
									return key2 !== "categoryName" && key2 !== "categoryExplanation"?
										<Question key={key1 + key2} cell={cell} roundName={roundName} key1={key1}
										          key2={key2}  student={self.props.student}/>:null;
								})}
							</div>
						)
					})}
				</div>
		);
	};

	render() {
		return (
			<div className="Table">
				{this.renderInput()}
			</div>
		)
	}
}