import PropTypes from "prop-types";
import React from "react";
import {Meteor} from "meteor/meteor";

import Question from "./Question";
import CategoryHeader from "./CategoryHeader";

export default class EditorTable extends React.Component {
	static propTypes = {
		round: PropTypes.string.isRequired,
		editorDatabase: PropTypes.array.isRequired,
	};

	renderInput = () => {
		let roundName;
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
		if (!this.props.editorDatabase[0]) {
			Meteor.call('editorDatabase.init');
		}
		const round = this.props.editorDatabase[0][roundName];
		return (roundName == "FinalJeopardy" ?
				<div key="" className="Table">
					<div className="Column" key="C1">
						<CategoryHeader categoryName={round.category} roundName={roundName} key1={"category"}/>
						<Question cell={round} roundName={roundName} key1={"question"}/>
					</div>
				</div>
				:
				<div key="" className="Table">
					{$.map(round, function (column, key1) {
						return (
							<div className="Column" key={key1}>
								<CategoryHeader key={key1 + "H"} categoryName={round[key1].categoryName} roundName={roundName} categoryExplanation={round[key1].categoryExplanation}/>
								{$.map(column, function (cell, key2) {
									return key2 !== "categoryName" && key2 !== "categoryExplanation"?
										<Question key={key1 + key2} cell={cell} roundName={roundName} key1={key1}
										          key2={key2}/>:null;
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