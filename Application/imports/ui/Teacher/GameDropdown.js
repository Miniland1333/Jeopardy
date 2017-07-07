import PropTypes from "prop-types";
import React from "react";
import {Meteor} from "meteor/meteor";
import * as $ from "jquery";


const selectStyle = {
	height: "15vh",
	textAlign: 'center',
	display: 'block',
	fontSize: "4vh",
	backgroundColor: '#C99700', /* yellow */
	flex: 1,
	WebkitAppearance: "none",
	border: "none",
};

export default class GameDropdown extends React.Component {
	static propTypes = {
		gameDatabase: PropTypes.array,
		gameLogic: PropTypes.object,
	};
	
	renderDropdown = () => {
		return ($.map(this.props.gameDatabase, function (game) {
			return <option key={game.name}>{game.name}</option>;
		}))
	};
	
	handleGame = (e) => {
		const gameName = e.target.value;
		Meteor.call('gameLogic.setGame', gameName);
	};
	
	render() {
		return (
			<div className="flex-container" style={{flex: 1}}>
				<select style={selectStyle} onChange={this.handleGame} value={this.props.gameLogic["gameName"]}>
					<option>Please select a game</option>
					{this.renderDropdown()}
				</select>
			</div>
		)
	}
}
