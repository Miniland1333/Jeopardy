import PropTypes from "prop-types";
import React from "react";
import { Meteor } from "meteor/meteor";
import paper from "./../paper-full";
import Ping from "../Ping";

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
const errorStyle = {
	backgroundColor: "#e05957",
	fontSize: "5vmin",
	margin: "5px",
	height: "7vh",
	display: "block",
	borderRadius: 8,
};
let teamNumber;
let finalAnswer;

export default class StudentContent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			setup: true,
			isPortrait: window.innerWidth < window.innerHeight,
		};
		
		function checkOrientation(){
			const previousOrientation = this.state.isPortrait;
			let currentOrientation = window.innerWidth < window.innerHeight;
    			if (window.orientation !== previousOrientation) {
				this.setState({ isPortrait:  currentOrientation});
   			}
		};

		window.addEventListener("resize", checkOrientation, false);
		window.addEventListener("orientationchange", checkOrientation, false);
		setInterval(checkOrientation, 5000);
	}

	static propTypes = {
		gameLogic: PropTypes.object,
	};

	shouldComponentUpdate(nextProps, nextState) {
		let currentState = this.props.gameLogic["state"];
		let futureState = nextProps.gameLogic["state"];
		return !(currentState === "FJopen" && futureState === "FJopen" && !this.state.setup);

	}

	componentDidMount() {
		this.componentDidUpdate();
	}

	componentDidUpdate() {

		if (this.state.setup && teamNumber !== undefined &&
			(this.props.gameLogic["state"] === "FJread" || this.props.gameLogic["state"] === "FJopen")) {
			this.setState({ setup: false });
		}
	}

	renderContent = () => {
		let wager;
		let max;
		let points;
		teamNumber = this.props.gameLogic["connections"][Meteor.connection._lastSessionId];
		if (teamNumber === undefined) { //not registered
			//addToHomescreen();
			return <div className="flex-container"
				style={{
					flexDirection: "column",
					flex: 1,
					backgroundColor: "#060CE9",
				}}>
				<div className="flex-container"
					style={{
						flexDirection: "column",
						flex: 1,
						justifyContent: "center"
					}}>
					<h1 style={{ fontSize: "5vmin" }}>Tap an open box to register!</h1>
					<p style={{ fontSize: "3vmin" }}>{Meteor.connection._lastSessionId}</p>
				</div>
				<div style={{ height: 30, backgroundColor: StudentContent.setupColor() }} />
			</div>;
		}
		else if (this.props.gameLogic["round"] === 0) { //ready to start game
			return <div className="flex-container"
				style={{
					flexDirection: "column",
					flex: 1,
					backgroundColor: "#060CE9",
				}}>
				<div className="flex-container"
					style={{
						flexDirection: "column",
						flex: 1,
						justifyContent: "center"
					}}>
					<h1 style={{ fontSize: "5vmin" }}>Ready to
						go {this.props.gameLogic.setupPlayers["player" + teamNumber].teamName}!</h1>
					<p style={{ fontSize: "3vmin" }}>{Meteor.connection._lastSessionId}</p>
				</div>
				<div style={{ height: "30", backgroundColor: StudentContent.setupColor() }} />
			</div>
		}
		else if (this.props.gameLogic["state"] === "wager" && this.props.gameLogic["lastWinner"] === teamNumber) { //daily double
			points = this.props.gameLogic["player" + teamNumber]["points"];
			max = Math.max(this.props.gameLogic["round"] === 1 ? 1000 : 2000, points);


			wager = Math.max(5, Math.min(this.props.gameLogic["player" + teamNumber]["wager"], max));
			Meteor.call('gameLogic.setWager', teamNumber, wager);
			return <div className="flex-container" style={{ flexDirection: "column", flex: 1 }}>
				<div className="flex-container" style={{ flexDirection: "column", flex: 1, justifyContent: "center" }}>
					<div className="flex-container" style={{ justifyContent: "center" }}>
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
					}}>Wager: {wager}</div>
					<div className="flex-container" style={{ justifyContent: "center" }}>
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
					<div style={{ fontSize: "3vmin" }}>You can wager between $0 and ${max}</div>
				</div>
				<div style={confirmStyle} onClick={() => Meteor.call('gameLogic.setState', 'DDready')}>
					Confirm
					Wager
				</div>
				{navigator.userAgent.match(/(iPhone|iPod)/i) ?
					<div style={{ height: 60 }} /> : []}
			</div>;

		}
		else if (["read", "open", "answer"].includes(this.props.gameLogic["state"])) {
			return <div className="flex-container" style={{ flexDirection: "column", flex: 1 }}>
				<div style={{ background: this.buttonColor(), borderRadius: "8px", margin: "30px", flex: 1 }}
					onClick={() => Meteor.call("gameLogic.handleClick", teamNumber)}>
					{this.late()}
				</div>
			</div>;
		}
		else if (["DDready", "DDread", "DDanswer"].includes(this.props.gameLogic["state"])) {
			return <div className="flex-container" style={{
				fontFamily: "gyparody", fontSize: "20vmin", flex: 1, alignItems: "center", justifyContent: "center",
				whiteSpace: "pre-wrap",
			}}>Daily<br />Double</div>;
		}
		else if (this.props.gameLogic["round"] === 3 && this.props.gameLogic["player" + teamNumber]["status"] === "active") {
			switch (this.props.gameLogic["state"]) {
				case "FJwager":
					if (!this.props.gameLogic["currentQuestionLogic"]["RungInLate"].includes(teamNumber)) {
						points = this.props.gameLogic["player" + teamNumber]["points"];

						wager = Math.max(0, Math.min(this.props.gameLogic["player" + teamNumber]["wager"], points));
						Meteor.call('gameLogic.setWager', teamNumber, wager);
						return <div className="flex-container" style={{ flexDirection: "column", flex: 1 }}>
							<div className="flex-container"
								style={{ flexDirection: "column", flex: 1, justifyContent: "center" }}>
								<div className="flex-container" style={{ justifyContent: "center" }}>
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
								}}>Wager: {wager}</div>
								<div className="flex-container" style={{ justifyContent: "center" }}>
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
								<div style={{ fontSize: "3vmin" }}>You can wager between $0 and ${points}</div>
							</div>
							{(navigator.userAgent.match(/(Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini)/i) && this.state.isPortrait) ?
								<div style={errorStyle} onClick={() => Meteor.call('gameLogic.addLate', teamNumber)}>
									Please view in Landscape Mode</div> :
								<div style={confirmStyle} onClick={() => Meteor.call('gameLogic.addLate', teamNumber)}>
									Confirm
									Wager
								</div>}
							<div style={{ height: 60 }} />
						</div>;
					}
					else {
						return <h1 className="flex-container"
							style={{
								flexDirection: "column",
								flex: 1,
								backgroundColor: "#060CE9",
								fontSize: "4vmin"
							}}>{this.state.isPortrait ? "Rotate your device to landscape!" : "Keep your device in landscape!"}</h1>;
					}

				case "FJread":
					return <canvas style={{ flex: 1 }} id="writingPad" />;
				case "FJopen":
					if (this.state.setup) {
						return <canvas style={{ flex: 1 }} id="writingPad" />;
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
						return <canvas className="needsclick" style={{ flex: 1 }} id="writingPad" />;
					}
				case "FJanswer":
					Meteor.call('gameLogic.finalAnswer', teamNumber, finalAnswer);
					return <div className="flex-container"
						style={{ flexDirection: "column", flex: 1, backgroundColor: "#060CE9" }} />;
				default:
					return <div className="flex-container"
						style={{ flexDirection: "column", flex: 1, backgroundColor: "#060CE9" }} />;

			}
		}
		else {
			return <div className="flex-container"
				style={{ flexDirection: "column", flex: 1, backgroundColor: "#060CE9" }} />;
		}
	};

	getTeamName() {
		if (this.props.gameLogic["connections"][Meteor.connection._lastSessionId] === undefined) {
			return Meteor.connection._lastSessionId;
		}
		else if (this.props.gameLogic["round"] === 0) {
			return this.props.gameLogic["setupPlayers"]["player" + teamNumber]["teamName"] ? this.props.gameLogic["setupPlayers"]["player" + teamNumber]["teamName"] : "---Typing---";
		}
		else {
			return this.props.gameLogic["player" + teamNumber]["teamName"]
		}
	}

	static setupColor() {
		if (navigator.userAgent.match(/(iPhone|iPad|iPod)/i)) {
			return "#00a2ff";
		}
		else if (navigator.userAgent.match(/(Android)/i)) {
			return "#A4C639";
		}
		else {
			return "#e0942e";
		}
	}

	late() {
		const firstTime = this.props.gameLogic["currentQuestionLogic"].firstTime;
		let playerTime = this.props.gameLogic["player" + teamNumber].lateTime;
		if (firstTime && playerTime && this.buttonColor()==="#ff3f3f")
			return <div style={{ "fontSize": "8vmin" }}>+{(playerTime - firstTime) / 1000} seconds</div>
	}


	buttonColor = () => {
		const gameLogic = this.props.gameLogic;
		switch (gameLogic["state"]) {
			case "read":
				return "#7a7a7a";
			case "open":
			case "answer":
				if (this.props.gameLogic["currentQuestionLogic"]["first"] === teamNumber)
					return "#00b500";
				else if (this.props.gameLogic["currentQuestionLogic"]["Incorrect"].includes(teamNumber) || this.props.gameLogic["currentQuestionLogic"]["RungInLate"].includes(teamNumber))
					return "#ff3f3f";
				else
					return "#f6f6f6"

		}
	};

	render() {
		return (
			<div className="flex-container" style={{ flexDirection: "column", flex: 1 }}>
				{this.renderContent()}
				<Ping name={this.getTeamName()} />
			</div>
		);
	}
}
