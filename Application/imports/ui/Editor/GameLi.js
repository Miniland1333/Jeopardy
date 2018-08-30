import PropTypes from "prop-types";
import React from "react";
import {Meteor} from "meteor/meteor";
import CategoryHeader from "./CategoryHeader";


const cursorStyle = {
	cursor: "pointer",
};

export default class GameLi extends React.Component {
	static propTypes = {
		game: PropTypes.object.isRequired,
		student: PropTypes.string,
	};
	
	handleDelete = () => {
		if (confirm("This will delete " + this.props.game.name + ".\n Are you sure?")) {
			Meteor.call('gameDatabase.remove', this.props.game.name, this.props.username || this.props.student);
		}
	};
	
	handleLoad = () => {
		if (!this.props.checkDifference() || confirm("This will delete all unsaved work. Continue?")) {
			Meteor.call('editorDatabase.load', this.props.game, this.props.student);
			$("#myDropdown").slideUp();
		}
	};
	
	render() {
		return (
			<li style={{
				position: "relative",
				listStyle: "none",
				padding: 15,
				borderBottom: "#eee solid 1px",}}>
				<span className="text" style={cursorStyle} onClick={this.handleLoad}>{this.props.game.name}</span>
				<button className="delete" style={cursorStyle} onClick={this.handleDelete}>&times;</button>
			</li>)
		
	}
}