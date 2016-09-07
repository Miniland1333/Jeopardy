import React, {Component, PropTypes} from 'react';



var transparentItemStyle = {
	height:15,
	width:"10vw",
	margin:"1vw",
	padding:0,
	justifyContent:"space-around",
	background:"#ffffff",
	opacity:".38",
	border:"none",
	//#00ff37 green
	//#ffffff38 transparent
};

var greenItemStyle = {
	height:15,
	width:"10vw",
	margin:"1vw",
	padding:0,
	justifyContent:"space-around",
	background:"#00ff37",
	border:"none",
};
var redItemStyle = {
	height:15,
	width:"10vw",
	margin:"1vw",
	padding:0,
	justifyContent:"space-around",
	background:"#00ff37",
	border:"none",
};
var CountDown = React.createClass({
	propTypes:{
		gameLogic:React.PropTypes.object,
		time:React.PropTypes.number,
	},

	render:function () {
		switch (this.props.gameLogic["state"]) {
			case "open":
			case "next":
				return <div className="flex-container" style={{background: "transparent"}}>
					<div className="five"  style={this.props.time>=5?greenItemStyle:transparentItemStyle}/>
					<div className="four"  style={this.props.time>=4?greenItemStyle:transparentItemStyle}/>
					<div className="three" style={this.props.time>=3?greenItemStyle:transparentItemStyle}/>
					<div className="two"   style={this.props.time>=2?greenItemStyle:transparentItemStyle}/>
					<div className="one"   style={this.props.time>=1?greenItemStyle:transparentItemStyle}/>
					<div className="two"   style={this.props.time>=2?greenItemStyle:transparentItemStyle}/>
					<div className="three" style={this.props.time>=3?greenItemStyle:transparentItemStyle}/>
					<div className="four"  style={this.props.time>=4?greenItemStyle:transparentItemStyle}/>
					<div className="five"  style={this.props.time>=5?greenItemStyle:transparentItemStyle}/>
				</div>;
			
			case "answer":
			case "DDanswer":
				return <div className="flex-container" style={{background: "transparent"}}>
					<div className="five"  style={this.props.time>=5?redItemStyle:transparentItemStyle}/>
					<div className="four"  style={this.props.time>=4?redItemStyle:transparentItemStyle}/>
					<div className="three" style={this.props.time>=3?redItemStyle:transparentItemStyle}/>
					<div className="two"   style={this.props.time>=2?redItemStyle:transparentItemStyle}/>
					<div className="one"   style={this.props.time>=1?redItemStyle:transparentItemStyle}/>
					<div className="two"   style={this.props.time>=2?redItemStyle:transparentItemStyle}/>
					<div className="three" style={this.props.time>=3?redItemStyle:transparentItemStyle}/>
					<div className="four"  style={this.props.time>=4?redItemStyle:transparentItemStyle}/>
					<div className="five"  style={this.props.time>=5?redItemStyle:transparentItemStyle}/>
				</div>;
			case "read":
			case "DDread":
				return <div style={{height: 15,}}/>;
			default:
				return null;
		}
	}
});


module.exports = CountDown;