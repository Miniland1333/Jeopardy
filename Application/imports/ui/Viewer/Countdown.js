import PropTypes from "prop-types";
import React from "react";


const transparentItemStyle = {
	height: 15,
	width: "10vw",
	margin: "10px 1vw",
	padding: 0,
	justifyContent: "space-around",
	background: "#ffffff",
	opacity: ".38",
	border: "none",
	//#00ff37 green
	//#ffffff38 transparent
};

const greenItemStyle = {
	height: 15,
	width: "10vw",
	margin: "10px 1vw",
	padding: 0,
	justifyContent: "space-around",
	background: "#00ff37",
	border: "none",
};
const redItemStyle = {
	height: 15,
	width: "10vw",
	margin: "10px 1vw",
	padding: 0,
	justifyContent: "space-around",
	background: "#ff1616",
	border: "none",
};
const containerStyle = {
	background: "transparent",
	flex: "0 0 0",
	position: "relative",
	zIndex: 2
};

const progressStyle = {
	height: "35px",
	flex: 1,
};
export default class CountDown extends React.Component {
	static propTypes = {
		gameLogic: PropTypes.object,
		time: PropTypes.number,
	};
	
	render() {
		switch (this.props.gameLogic["state"]) {
			case "open":
				return <div className="flex-container" style={containerStyle}>
					<div className="five" style={this.props.time >= 5 ? greenItemStyle : transparentItemStyle}/>
					<div className="four" style={this.props.time >= 4 ? greenItemStyle : transparentItemStyle}/>
					<div className="three" style={this.props.time >= 3 ? greenItemStyle : transparentItemStyle}/>
					<div className="two" style={this.props.time >= 2 ? greenItemStyle : transparentItemStyle}/>
					<div className="one" style={this.props.time >= 1 ? greenItemStyle : transparentItemStyle}/>
					<div className="two" style={this.props.time >= 2 ? greenItemStyle : transparentItemStyle}/>
					<div className="three" style={this.props.time >= 3 ? greenItemStyle : transparentItemStyle}/>
					<div className="four" style={this.props.time >= 4 ? greenItemStyle : transparentItemStyle}/>
					<div className="five" style={this.props.time >= 5 ? greenItemStyle : transparentItemStyle}/>
				</div>;
			
			case "answer":
			case "DDanswer":
				return <div className="flex-container" style={containerStyle}>
					<div className="five" style={this.props.time >= 5 ? redItemStyle : transparentItemStyle}/>
					<div className="four" style={this.props.time >= 4 ? redItemStyle : transparentItemStyle}/>
					<div className="three" style={this.props.time >= 3 ? redItemStyle : transparentItemStyle}/>
					<div className="two" style={this.props.time >= 2 ? redItemStyle : transparentItemStyle}/>
					<div className="one" style={this.props.time >= 1 ? redItemStyle : transparentItemStyle}/>
					<div className="two" style={this.props.time >= 2 ? redItemStyle : transparentItemStyle}/>
					<div className="three" style={this.props.time >= 3 ? redItemStyle : transparentItemStyle}/>
					<div className="four" style={this.props.time >= 4 ? redItemStyle : transparentItemStyle}/>
					<div className="five" style={this.props.time >= 5 ? redItemStyle : transparentItemStyle}/>
				</div>;
			case "read":
			case "DDread":
			case "next":
				return <div/>;
			
			case "FJopen":
				return <div className="flex-container" style={containerStyle}>
					<div id="progressbar" style={progressStyle}/>
				</div>;
			default:
				return null;
		}
	}
}