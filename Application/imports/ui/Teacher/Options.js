/**
 * Created by Henry on 2/24/2017.
 */
import React, {Component, PropTypes} from 'react';
import {Meteor} from 'meteor/meteor';
import "./../jquery-ui";
import "./../jquery.ui.touch-punch";
import {gameLogic} from "../../api/gameLogic";

const modalStyle = {
	display: 'none', /* hidden by default */
	position: 'fixed', /* stay in place */
	zIndex: 1, /* sit on top */
	left: 0, top: 0, width: '100%', /* full width */
	height: '100%', /* full height */
	overflow: 'hide', /* enable scroll if needed */
	backgroundColor: 'rgba(0,0,0,0.4)',
};
const modalContentStyle = {
	color: "black",
	flexDirection: "column",
	alignItems: 'center',
	alignContent: 'center',
	justifyContent: 'center',
	height: 'inherit',
};
const enabledStyle = {
	margin: '5px 5px 0 5px',
	cursor: 'pointer',
	boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
	zIndex: 1,
	color: 'black',
	textDecoration: 'none',
	display: 'block',
	padding: '15px 25px',
	fontSize: '4vh',
	width: '70%',
	borderRadius: 25,
	transition: '.5s',
	fontFamily: 'Rockwell, “Courier Bold”, Courier, Georgia, Times, “Times New Roman”, serif',
	backgroundColor: '#f1f1f1'
};
const disabledStyle = {
	color: "#a5a5a5",
	margin: '5px 5px 0 5px',
	cursor: 'not-allowed',
	boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
	zIndex: 1,
	textDecoration: 'none',
	display: 'block',
	padding: '15px 25px',
	fontSize: '4vh',
	width: '70%',
	borderRadius: 25,
	transition: '.5s',
	fontFamily: 'Rockwell, “Courier Bold”, Courier, Georgia, Times, “Times New Roman”, serif',
	backgroundColor: '#f1f1f1'
};
const playerStyle={
		margin: '5px 5px 0 5px',
		cursor: 'pointer',
		boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
		zIndex: 1,
		color: 'black',
		textDecoration: 'none',
		display: 'block',
		padding: '15px 25px',
		fontSize: '4vh',
		borderRadius: 25,
		transition: '.5s',
		fontFamily: 'Rockwell, “Courier Bold”, Courier, Georgia, Times, “Times New Roman”, serif',
		backgroundColor: '#f1f1f1'
};

export const Options = React.createClass({
	getInitialState: function () {
		return {
			state: "buttons",
		}
	},
	propTypes: {
		handleClose: React.PropTypes.func,
		playerLogic: React.PropTypes.object,
		gameLogic: React.PropTypes.object,
		round: React.PropTypes.number,
	},
	renderButtons: function () {
		return [
			this.props.round !== 3 ?
				<div key="advance" style={enabledStyle} onClick={
					() => {
						if (confirm("Advance?")) {
							Meteor.call('gameLogic.advance');
							this.exit();
						}
					}}>Advance to Next Round</div> :
				<div key="advance" style={disabledStyle}>Advance to Next Round</div>
			,
			
			<div key="adjust" style={enabledStyle} onClick={() => {
				/*this.setState({state: "adjust"});*/
			}}>Adjust Scores</div>,
			
			this.props.gameLogic["numPlayers"] < 6 ?
				<div key="add" style={enabledStyle} onClick={() => {
					let teamName = prompt("Enter Team Name");
					//noinspection EqualityComparisonWithCoercionJS
					if(teamName && teamName.trim()!=""){
						Meteor.call('gameLogic.addPlayer', this.props.gameLogic["numPlayers"] + 1,teamName);
						this.exit();
					}else{
						alert("Invalid Name!");
					}
				}}>Add Player</div> :
				<div key="add" style={disabledStyle}>Add Player</div>
			,
			
			<div key="sort" style={enabledStyle} onClick={() => {
				/*this.setState({state: "sort"});*/
			}}>Sort Players</div>,
			
			<div key="kick" style={enabledStyle} onClick={() => {
				this.setState({state: "kick"});
			}}>Kick Player</div>,
			
			
			<div key="reset" style={enabledStyle} onClick={
				() => {
					if (confirm("Reset?")) {
						Meteor.call("gameLogic.init");
						this.exit();
					}
				}}>Reset Game</div>,
			
			<div key="exit" style={enabledStyle} onClick={this.exit}>Exit Menu</div>,
		]
	},
	renderAdjust: function () {
		return[
			<div key="mainMenu" style={enabledStyle} onClick={() => {
			this.setState({state: "buttons"});
		}}>Main Menu</div>,
		];
	},
	renderKick: function () {
		let innerArray = [];
		for (let i=1; i<=this.props.gameLogic["numPlayers"]; i++){
			innerArray.push(<div key={"Player "+i} style={playerStyle} onClick={function(){
				Meteor.call('gameLogic.kick', i, gameLogic.find().fetch()[0]["player"+i]["connectionId"]);
			}}>{"Kick Player "+i}</div>)
		}
		
		return[
			innerArray,
			<div key="buffer" style={{height:10}}></div>,
			
			<div key="mainMenu" style={enabledStyle} onClick={() => {
				this.setState({state: "buttons"});
			}}>Main Menu</div>,
		];
	},
	renderSort: function () {
		return[
			<div key="mainMenu" style={enabledStyle} onClick={() => {
				this.setState({state: "buttons"});
			}}>Main Menu</div>,
		];
	},
	exit: function () {
		$("#optionModal").fadeOut(this.props.handleClose);
	},
	renderContent: function () {
		switch (this.state.state) {
			case "buttons":
				return this.renderButtons();
			case "adjust":
				return this.renderAdjust();
			case "kick":
				return this.renderKick();
			case "sort":
				return this.renderSort();
		}
	},
	componentDidMount: function () {
		$("#optionModal").fadeIn();
	},
	render: function () {
		//States where options are invalid
		if([""].indexOf(this.props.gameLogic.state)>=0){
			this.exit();
		}
		
		return (
			<div id="optionModal" style={modalStyle}>
				<div className="modal-content flex-container" style={modalContentStyle}>
					{this.renderContent()}
				</div>
			</div>
		)
	}
});

module.exports = Options;