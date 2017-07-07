import PropTypes from 'prop-types';
import React from "react";
import {Meteor} from "meteor/meteor";


var cursorStyle = {
	cursor: "pointer"
};

export default class GameLi extends React.Component {
    static propTypes = {
		game: PropTypes.object.isRequired,
	};

    handleDelete = () => {
		if (confirm("This will delete " + this.props.game.name + ". Are you sure?")) {
			Meteor.call('gameDatabase.remove', this.props.game.name);
		}
	};

    handleLoad = () => {
		if (confirm("This will delete all unsaved work. Continue?")) {
			Meteor.call('editorDatabase.load', this.props.game);
			$("#myDropdown").slideUp();
		}
	};

    render() {
		return (
			<li>
				<span className="text" style={cursorStyle} onClick={this.handleLoad}>{this.props.game.name}</span>
				<button className="delete" style={cursorStyle} onClick={this.handleDelete}>&times;</button>
			</li>)
		
	}
}