import PropTypes from "prop-types";
import React from "react";
import {Meteor} from "meteor/meteor";
import "./../jquery-ui";
import "./../jquery.ui.touch-punch";
import {gameLogic} from "../../api/gameLogic";
import PingReport from "./PingReport";

export default class Options extends React.Component {
	static propTypes = {
		handleClose: PropTypes.func,
		playerLogic: PropTypes.object,
		gameLogic: PropTypes.object,
		round: PropTypes.number,
	};
	
	state = {
		state: "buttons",
	};
	
	renderButtons() {
		return [
			this.props.round !== 3 ?
				<div key="advance" style={enabledStyle} onClick={
					() => {
						if (confirm("Advance?")) {
							Meteor.call('gameLogic.advance');
							this.exit();
						}
					}}>Advance to Next Round</div> :
				<div key="advance" style={disabledStyle}>Advance to Next Round</div>,
			<div key="buffer1" style={{height: 20}}/>,
			
			<div key="adjust" className="flex-container" style={{minWidth: "70%"}}>
				{this.props.gameLogic["numPlayers"] < 6 ?
					<div key="add" className="needsclick" style={enabledStyle} onClick={() => {
						let teamName = prompt("Enter Team Name").substring(0, 50);
						//noinspection EqualityComparisonWithCoercionJS
						if (teamName && teamName.trim() != "") {
							Meteor.call('gameLogic.addPlayer', this.props.gameLogic["numPlayers"] + 1, teamName);
							this.exit();
						}
						else {
							alert("Invalid Name!");
						}
					}}>Add Player</div> :
					<div key="add" style={disabledStyle}>Add Player</div>}
				
				<div key="kick" style={enabledStyle} onClick={() => {
					this.setState({state: "kick"});
				}}>Kick Player
				</div>
			</div>,
			
			<div key="addRemove" className="flex-container" style={{minWidth: "70%"}}>
				<div key="adjust" style={disabledStyle} onClick={() => {
					/*this.setState({state: "adjust"});*/
				}}>Adjust Scores
				</div>
				,
				
				<div key="sort" style={enabledStyle} onClick={() => {
					this.setState({state: "sort"});
				}}>Sort Players</div>
			</div>,
			
			<div key="buffer2" style={{height: 20}}/>,
			<div key="ping" style={enabledStyle} onClick={() => {
				this.setState({state: "ping"});
			}}>Check Ping</div>,
			
			<div key="reset" style={enabledStyle} onClick={
				() => {
					if (confirm("Reset?")) {
						Meteor.call("gameLogic.init");
						this.exit();
					}
				}}>Reset Game</div>,
			
			<div key="buffer3" style={{height: 20}}/>,
			<div key="exit" style={enabledStyle} onClick={this.exit}>Exit Menu</div>,
		]
	};
	
	renderAdjust() {
		return [
			<div key="mainMenu" style={enabledStyle} onClick={() => {
				this.setState({state: "buttons"});
			}}>Main Menu</div>,
		];
	};
	
	renderKick() {
		let innerArray = [];
		for (let i = 1; i <= this.props.gameLogic["numPlayers"]; i++) {
			innerArray.push(<div key={"Player " + i}
			                     style={this.props.gameLogic["player" + i].status !== "active" ? reconnectStyle : playerStyle}
			                     onClick={function () {
				                     Meteor.call('gameLogic.kick', i, gameLogic.find().fetch()[0]["player" + i]["connectionId"]);
			                     }}>{"Kick Player " + i}</div>)
		}
		
		return [
			innerArray,
			<div key="buffer" style={{height: 30}}/>,
			
			<div key="mainMenu" style={enabledStyle} onClick={() => {
				this.setState({state: "buttons"});
			}}>Main Menu</div>,
		];
	};
	
	renderSort() {
		let innerArray = [];
		for (let i = 1; i <= this.props.gameLogic["numPlayers"]; i++) {
			innerArray.push(<li style={{
				margin: '5px 5px 0 5px',
				cursor: 'pointer',
				boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
				zIndex: 1,
				color: 'black',
				textDecoration: 'none',
				padding: '15px 25px',
				fontSize: '4vh',
				width: '70%',
				borderRadius: 25,
				fontFamily: 'Rockwell, “Courier Bold”, Courier, Georgia, Times, “Times New Roman”, serif',
				backgroundColor: '#f1f1f1'
			}} key={i} id={i}>{this.props.gameLogic["player" + i].teamName}</li>)
		}
		
		return [
			<div className="flex-container needsclick" key="sorter" id="sortable"
			     style={{fontSize: "5vmin", flexDirection: "column", width: "100%", alignItems: "center"}}>
				<div className="buffer" style={{height: 30}}/>
				{innerArray}
				<div className="buffer" style={{height: 30}}/>
			</div>,
			
			<div key="mainMenu" style={enabledStyle} onClick={() => {
				Meteor.call("gameLogic.sortPlayers", $.map($("#sortable").children(":not(.ui-sortable-placeholder,.buffer)"),
					(player) => parseInt(player.id)));
				this.setState({state: "buttons"});
			}}>Main Menu</div>,
		];
	};
	
	exit = () => {
		$("#optionModal").fadeOut(this.props.handleClose);
	};
	
	renderPing() {
		return [
			<div key="1" className="flex-container"
			     style={{width: "100vw", justifyContent: "center", flexDirection: "column"}}>
				<div key="2" style={{
					backgroundColor: "#F1F1F1",
					margin: "5vmin",
					padding: "3vmin",
					borderRadius: "30px",
					boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)'
				}}>
					<PingReport/>
				</div>
			</div>,
			<div key="mainMenu" style={enabledStyle} onClick={() => {
				this.setState({state: "buttons"});
			}}>Main Menu</div>,
		]
	}
	
	//margin 5
	//padding 3
	//boxshadow
	// border - radius 30px
	
	renderContent = () => {
		switch (this.state.state) {
			case "buttons":
				return this.renderButtons();
			case "adjust":
				return this.renderAdjust();
			case "ping":
				return this.renderPing();
			case "kick":
				return this.renderKick();
			case "sort":
				return this.renderSort();
		}
	};
	
	//noinspection JSMethodCanBeStatic
	componentDidMount() {
		$("#optionModal").fadeIn();
		if (this.state.state === "sort") $("#sortable").sortable({
			axis: "y",
			containment: "parent",
			cancel: "#buffer",
		});
	}
	
	componentDidUpdate() {
		if (this.state.state === "sort") $("#sortable").sortable({
			axis: "y",
			containment: "parent",
			cancel: "#buffer",
		});
	}
	
	render() {
		//States where options are invalid
		if ([""].indexOf(this.props.gameLogic.state) >= 0) {
			this.exit();
		}
		
		return (
			<div id="optionModal" style={modalStyle}>
				<div key="mainContent" className="modal-content flex-container" style={modalContentStyle}>
					{this.renderContent()}
				</div>
			</div>
		)
	}
}

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
	fontSize: '5vh',
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
	fontSize: '5vh',
	width: '70%',
	borderRadius: 25,
	transition: '.5s',
	fontFamily: 'Rockwell, “Courier Bold”, Courier, Georgia, Times, “Times New Roman”, serif',
	backgroundColor: '#f1f1f1'
};
const playerStyle = {
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
const reconnectStyle = {
	margin: '5px 5px 0 5px',
	cursor: 'pointer',
	boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
	zIndex: 1,
	color: 'white',
	textDecoration: 'none',
	display: 'block',
	padding: '15px 25px',
	fontSize: '4vh',
	borderRadius: 25,
	transition: '.5s',
	fontFamily: 'Rockwell, “Courier Bold”, Courier, Georgia, Times, “Times New Roman”, serif',
	backgroundColor: 'orange'
};