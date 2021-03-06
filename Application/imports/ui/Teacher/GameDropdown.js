import PropTypes from "prop-types";
import React from "react";
import {Meteor} from "meteor/meteor";
import * as $ from "jquery";
import {gameDatabase} from "../../api/gameDatabase";


export default class GameDropdown extends React.Component {
	static propTypes = {
		gameDatabase: PropTypes.array,
		gameLogic: PropTypes.object,
	};

	componentDidMount() {
		this.componentDidUpdate();
	}

	componentDidUpdate() {
		const self = this;
		const users = this.getUsers();
		if (!users.includes(this.props.gameLogic.username)) {
			Meteor.call('gameLogic.setGame', "mainEditor", "Please select a game");
		}
		else if (!this.props.gameDatabase.find(function (e) {
			return (!e.username && self.props.gameLogic.username === "mainEditor") || e.username === self.props.gameLogic.username;
		})) {
			Meteor.call('gameLogic.setGame', self.props.gameLogic.username, "Please select a game");
		}
	}

	renderDropdown = () => {
		const self = this;
		return ($.map(this.props.gameDatabase, function (game) {
			if ((!game.username && self.props.gameLogic.username === "mainEditor") || game.username === self.props.gameLogic.username)
				return <option key={game.name}>{game.name}</option>;
		}))
	};
	handleUsername = (e) => {
		const username = e.target.value;
		Meteor.call('gameLogic.setGame', username, "Please select a game");
	};
	handleGame = (e) => {
		const gameName = e.target.value;
		Meteor.call('gameLogic.setGame', this.props.gameLogic.username, gameName);
	};

	getUsers = () => {
		let result = ["mainEditor"];
		this.props.gameDatabase.forEach(function (game) {
			if (game.username && !result.includes(game.username))
				result.push(game.username);
		});
		return result;
	};

	render() {
		const self = this;
		return (
			<div className="flex-container">
				<select style={usernameStyle} onChange={this.handleUsername} value={this.props.gameLogic["username"]}>
					{$.map(self.getUsers(), function (username) {
						return <option value={username}
						               key={username}>{username === "mainEditor" ? "Default User" : username}'s
							games</option>
					})}
				</select>
				<select style={selectStyle} onChange={this.handleGame} value={this.props.gameLogic["gameName"]}>
					<option>Please select a game</option>
					{this.renderDropdown()}
				</select>
			</div>
		)
	}
}

const usernameStyle = {
	height: "15vh",
	textAlign: 'center',
	display: 'block',
	fontSize: "4vmin",
	backgroundColor: '#C99700', /* yellow */
	border: "none",
	flex: 1,
};
const selectStyle = {
	height: "15vh",
	textAlign: 'center',
	display: 'block',
	fontSize: "4vmin",
	backgroundColor: '#FFD700', /* yellow */
	border: "none",
	flex: 1,
};