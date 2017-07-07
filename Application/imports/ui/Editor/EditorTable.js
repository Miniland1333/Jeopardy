import PropTypes from 'prop-types';
import React from "react";
import {Meteor} from "meteor/meteor";

import Question from "./Question";
import CategoryHeader from "./CategoryHeader";
import refresh from "../refresh";

export default class EditorTable extends React.Component {
    static propTypes = {
		round: PropTypes.string.isRequired,
		editorDatabase: PropTypes.array.isRequired,
	};

    renderInput = () => {
		var roundName;
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
		if (this.props.editorDatabase[0] == undefined) {
			Meteor.call('editorDatabase.init');
		}
		var round = this.props.editorDatabase[0][roundName];
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
								{$.map(column, function (cell, key2) {
									return key2 == "categoryName" ?
										//<div className="Header" key={key1 + "H"}>{cell}</div>
										<CategoryHeader key={key1 + "H"} categoryName={cell} roundName={roundName}
										                key1={key1}/>
										:
										<Question key={key1 + key2} cell={cell} roundName={roundName} key1={key1}
										          key2={key2}/>;
									
								})}
							</div>
						)
					})}
				</div>
		);
	};

    render() {
		refresh();
		return (
			<div className="Table">
				{this.renderInput()}
			</div>
		)
	}
}