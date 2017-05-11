import React from "react";
import {Meteor} from "meteor/meteor";
import refresh from "../refresh";

const buttonStyle = {
	backgroundColor: "#555555",
	fontSize: "5vmin",
	margin: "5px",
	height: "5vh",
	width: "18vw",
	display: "inline-grid",
	borderRadius: 8,
	verticalAlign: "middle",
	alignContent: "center",
};
const confirmStyle = {
	backgroundColor: "#007d0a",
	fontSize: "5vmin",
	margin: "5px",
	height: "7vh",
	display: "block",
	borderRadius: 8,
};
let teamNumber;
let finalAnswer;

export const StudentContent = React.createClass({
	getInitialState: function () {
		return {
			setup: true,
		}
	},
	propTypes: {
		gameLogic: React.PropTypes.object,
	},
	handleFirst: function () {
		Meteor.call("gameLogic.setFirst", teamNumber);
		Meteor.call("gameLogic.setState", "answer");
	},
	handleLate: function () {
		Meteor.call('gameLogic.addLate', teamNumber);
	},
	shouldComponentUpdate: function (nextProps, nextState) {
		let currentState = this.props.gameLogic["state"];
		let futureState = nextProps.gameLogic["state"];
		return !(currentState === "FJopen" && futureState === "FJopen" && !this.state.setup);
		
	},
	renderContent: function () {
		let wager;
		let max;
		let points;
		teamNumber = this.props.gameLogic["connections"][Meteor.connection._lastSessionId];
		if (teamNumber === undefined) {
			addToHomescreen();
			return (
				<div className="flex-container" style={{flexDirection: "column", flex: 1, backgroundColor: "#060CE9"}}>
					<h1>Tap an open box to register!</h1>
					<p>{Meteor.connection._lastSessionId}</p>
				</div>
			);
		}
		else if (this.props.gameLogic["state"] === "wager" && this.props.gameLogic["lastWinner"] === teamNumber) {
			points = this.props.gameLogic["player" + teamNumber]["points"];
			max = Math.max(this.props.gameLogic["round"] === 1 ? 1000 : 2000, points);
			
			
			wager = Math.max(5, Math.min(this.props.gameLogic["player" + teamNumber]["wager"], max));
			Meteor.call('gameLogic.setWager', teamNumber, wager);
			return <div className="flex-container" style={{flexDirection: "column", flex: 1}}>
				<div className="flex-container" style={{flexDirection: "column", flex: 1, justifyContent: "center"}}>
					<div>
						<div style={buttonStyle}
						     onClick={() => Meteor.call('gameLogic.setWager', teamNumber, wager += 10000)}>+10,000
						</div>
						<div style={buttonStyle}
						     onClick={() => Meteor.call('gameLogic.setWager', teamNumber, wager += 1000)}>+1,000
						</div>
						<div style={buttonStyle}
						     onClick={() => Meteor.call('gameLogic.setWager', teamNumber, wager += 100)}>+100
						</div>
						<div style={buttonStyle}
						     onClick={() => Meteor.call('gameLogic.setWager', teamNumber, wager += 10)}>
							+10
						</div>
						<div style={buttonStyle}
						     onClick={() => Meteor.call('gameLogic.setWager', teamNumber, wager += 1)}>
							+1
						</div>
					</div>
					<div style={{
						fontFamily: "D7",
						fontSize: "4vw",
						padding: "10px",
						border: "4px solid #f1f1f1",
						borderRadius: 20,
					}}>
						Wager: {wager}
					</div>
					<div>
						<div style={buttonStyle}
						     onClick={() => Meteor.call('gameLogic.setWager', teamNumber, wager -= 10000)}>-10,000
						</div>
						<div style={buttonStyle}
						     onClick={() => Meteor.call('gameLogic.setWager', teamNumber, wager -= 1000)}>-1,000
						</div>
						<div style={buttonStyle}
						     onClick={() => Meteor.call('gameLogic.setWager', teamNumber, wager -= 100)}>-100
						</div>
						<div style={buttonStyle}
						     onClick={() => Meteor.call('gameLogic.setWager', teamNumber, wager -= 10)}>
							-10
						</div>
						<div style={buttonStyle}
						     onClick={() => Meteor.call('gameLogic.setWager', teamNumber, wager -= 1)}>
							-1
						</div>
					</div>
					<div style={{fontSize: "3vmin"}}>You can wager between $0 and ${points}</div>
				</div>
				<div style={confirmStyle} onClick={() => Meteor.call('gameLogic.setState', 'DDread')}>
					Confirm
					Wager
				</div>
			</div>;
			
		}
		else if (this.props.gameLogic["state"] === "read") {
			return <div className="flex-container" style={{flexDirection: "column", flex: 1}}>
				<div style={{background: "#f6f6f6", borderRadius: "8px", margin: "30px", flex: 1}}/>
			</div>;
		}
		else if (this.props.gameLogic["state"] === "open") {
			const incorrect = this.props.gameLogic["currentQuestionLogic"]["Incorrect"];
			if (!incorrect.includes(teamNumber)) {
				//If not on incorrect list
				return <div className="flex-container" style={{flexDirection: "column", flex: 1}}>
					<div onClick={this.handleFirst}
					     style={{background: "#f6f6f6", borderRadius: "8px", margin: "30px", flex: 1}}/>
				</div>;
			}
			else {
				return <div className="flex-container" style={{flexDirection: "column", flex: 1}}>
					<div style={{background: "#ff3f3f", borderRadius: "8px", margin: "30px", flex: 1}}/>
				</div>;
			}
			
			
		}
		else if (this.props.gameLogic["state"] === "answer") {
			if (this.props.gameLogic["currentQuestionLogic"]["first"] === teamNumber) {
				return <div className="flex-container" style={{flexDirection: "column", flex: 1}}>
					<div style={{background: "#00b500", borderRadius: "8px", margin: "30px", flex: 1}}/>
				</div>;
			}
			else if (this.props.gameLogic["currentQuestionLogic"]["RungInLate"].includes(teamNumber)) {
				return <div className="flex-container" style={{flexDirection: "column", flex: 1}}>
					<div style={{background: "#ff3f3f", borderRadius: "8px", margin: "30px", flex: 1}}/>
				</div>;
			}
			else {
				return <div className="flex-container" style={{flexDirection: "column", flex: 1}}>
					<div onClick={this.handleLate}
					     style={{background: "#f6f6f6", borderRadius: "8px", margin: "30px", flex: 1}}/>
				</div>;
			}
			
		}
		else if (this.props.gameLogic["round"] === 3 && this.props.gameLogic["player" + teamNumber]["status"] === "active") {
			switch (this.props.gameLogic["state"]) {
				case "FJwager":
					if (!this.props.gameLogic["currentQuestionLogic"]["RungInLate"].includes(teamNumber)) {
						points = this.props.gameLogic["player" + teamNumber]["points"];
						
						wager = Math.max(0, Math.min(this.props.gameLogic["player" + teamNumber]["wager"], points));
						Meteor.call('gameLogic.setWager', teamNumber, wager);
						return <div className="flex-container" style={{flexDirection: "column", flex: 1}}>
							<div className="flex-container"
							     style={{flexDirection: "column", flex: 1, justifyContent: "center"}}>
								<div>
									<div style={buttonStyle}
									     onClick={() => Meteor.call('gameLogic.setWager', teamNumber, wager += 10000)}>
										+10,000
									</div>
									<div style={buttonStyle}
									     onClick={() => Meteor.call('gameLogic.setWager', teamNumber, wager += 1000)}>
										+1,000
									</div>
									<div style={buttonStyle}
									     onClick={() => Meteor.call('gameLogic.setWager', teamNumber, wager += 100)}>
										+100
									</div>
									<div style={buttonStyle}
									     onClick={() => Meteor.call('gameLogic.setWager', teamNumber, wager += 10)}>+10
									</div>
									<div style={buttonStyle}
									     onClick={() => Meteor.call('gameLogic.setWager', teamNumber, wager += 1)}>+1
									</div>
								</div>
								<div style={{
									fontFamily: "D7",
									fontSize: "8vw",
									padding: "10px",
									border: "4px solid #f1f1f1",
									borderRadius: 20,
								}}>
									Wager: {wager}
								</div>
								<div>
									<div style={buttonStyle}
									     onClick={() => Meteor.call('gameLogic.setWager', teamNumber, wager -= 10000)}>
										-10,000
									</div>
									<div style={buttonStyle}
									     onClick={() => Meteor.call('gameLogic.setWager', teamNumber, wager -= 1000)}>
										-1,000
									</div>
									<div style={buttonStyle}
									     onClick={() => Meteor.call('gameLogic.setWager', teamNumber, wager -= 100)}>
										-100
									</div>
									<div style={buttonStyle}
									     onClick={() => Meteor.call('gameLogic.setWager', teamNumber, wager -= 10)}>-10
									</div>
									<div style={buttonStyle}
									     onClick={() => Meteor.call('gameLogic.setWager', teamNumber, wager -= 1)}>-1
									</div>
								</div>
								<div style={{fontSize: "3vmin"}}>You can wager between $0 and ${points}</div>
								<div style={{fontSize: "3vmin"}}>Make sure you device is landscape!</div>
							</div>
							<div style={confirmStyle} onClick={() => Meteor.call('gameLogic.addLate', teamNumber)}>
								Confirm
								Wager
							</div>
						</div>;
					}
					else {
						return <div className="flex-container"
						            style={{flexDirection: "column", flex: 1, backgroundColor: "#060CE9",fontSize: "4vmin"}}>Make sure you device is landscape!</div>;
					}
				
				case "FJread":
					this.setState({setup: false});
					return <canvas style={{flex: 1}} id="writingPad"/>;
				case "FJopen":
					if (this.state.setup) {
						this.setState({setup: false});
						return <canvas style={{flex: 1}} id="writingPad"/>;
					}
					else {
						paper.install(window);
						const canvas = document.getElementById('writingPad');
						paper.setup(canvas);
						
						let path;
						const tool = new Tool();
						let textItem = new PointText({
							content: 'Write your answer here',
							point: new Point(20, 30),
							fillColor: 'white',
							fontSize: "4vmin",
						});
						finalAnswer = paper.project.exportJSON();
						tool.onMouseDown = function down(event) {
							
							// Create a new path and set its stroke color to black:
							path = new Path({
								segments: [event.point],
								strokeColor: 'white',
								strokeWidth: 6,
							});
						};
						
						tool.onMouseDrag = function drag(event) {
							path.add(event.point);
						};
						
						tool.onMouseUp = function up(event) {
							let segmentCount = path.segments.length;
							// When the mouse is released, simplify it:
							path.simplify(10);
							finalAnswer = paper.project.exportJSON();
						};
						return <canvas className="needsclick" style={{flex: 1}} id="writingPad"/>;
					}
				case "FJanswer":
					Meteor.call('gameLogic.finalAnswer', teamNumber, finalAnswer);
					return <div className="flex-container"
					            style={{flexDirection: "column", flex: 1, backgroundColor: "#060CE9"}}/>;
				default:
					return <div className="flex-container"
					            style={{flexDirection: "column", flex: 1, backgroundColor: "#060CE9"}}/>;
				
			}
		}
		else {
			return <div className="flex-container"
			            style={{flexDirection: "column", flex: 1, backgroundColor: "#060CE9"}}/>;
		}
	},
	render: function () {
		refresh();
		return (
			<div className="flex-container" style={{flexDirection: "column", flex: 1}}>
				{this.renderContent()}
			</div>
		);
	}
});


module.exports = StudentContent;