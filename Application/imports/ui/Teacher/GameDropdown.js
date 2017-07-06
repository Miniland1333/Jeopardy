import PropTypes from 'prop-types';
import React from "react";
import {Meteor} from "meteor/meteor";


var selectStyle = {
	height: "15vh",
	textAlign: 'center',
	display: 'block',
	fontSize: "4vh",
	backgroundColor: '#C99700', /* yellow */
	flex: 1,
	WebkitAppearance: "none",
	border: "none",
};

var GameDropdown = React.createClass({
	propTypes: {
		gameDatabase: PropTypes.array,
		gameLogic: PropTypes.object,
	},
	renderDropdown: function () {
		return ($.map(this.props.gameDatabase, function (game) {
			return <option key={game.name}>{game.name}</option>;
		}))
	},
	handleGame: function (e) {
		var gameName = e.target.value;
		Meteor.call('gameLogic.setGame', gameName);
	},
	
	render: function () {
		return (
			<div className="flex-container" style={{flex: 1}}>
				<select style={selectStyle} onChange={this.handleGame} value={this.props.gameLogic["gameName"]}>
					<option>Please select a game</option>
					{this.renderDropdown()}
				</select>
			</div>
		)
	},
});


module.exports = GameDropdown;
