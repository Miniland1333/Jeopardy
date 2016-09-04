import React, {Component, PropTypes} from 'react';
import {Meteor} from 'meteor/meteor';


var inputStyle = {
	textAlign:"center",
	background:"transparent",
	border:"none",
	color:"white",
	fontSize:"14px",
	flex:1,
};

var ScoreBoard = React.createClass({
	propTypes: {
		playerLogic: React.PropTypes.object,
		gameLogic:React.PropTypes.object,
		round:React.PropTypes.number,
		connectionId:React.PropTypes.string,
	},
	numDisplay:function () {
		if (this.props.round == 0) {
			switch (this.props.playerLogic["status"]){
				case "pending":
					return "----";
					break;
				case "ready":
					return "Team"+this.props.playerLogic["teamNumber"];
					break;
				default:
					return "0000";
			}
		}else{
			switch (this.props.playerLogic["status"]){
				case "reconnect":
					return "----";
					break;
				case "active":
					return this.props.playerLogic["points"];
					break;
				default:
					return "OUT";
			}
		}
	},
	handleName:function (name) {
		Meteor.call('gameLogic.setTeamName',this.props.playerLogic["teamNumber"],name.target.value);
	},
	handleClick: function () {
		var status = this.props.playerLogic["status"];
		if (this.props.round == 0) {
			
			//Need check to prevent duplication
			
			var input = $("#input"+this.props.playerLogic["teamNumber"]);
			if(status==""&&this.props.gameLogic["connections"][this.props.connectionId]==undefined){
				Meteor.call('gameLogic.setConnectionId',this.props.playerLogic["teamNumber"],this.props.round,this.props.connectionId);
				input.prop( "disabled", false );
				input.focus();
			}else if(status=="ready"&&this.props.connectionId==this.props.playerLogic["connectionId"]){
				input.prop( "disabled", false );
				input.focus();
			}
		}else if(status=="reconnect"&&this.props.gameLogic["connections"][this.props.connectionId]==undefined){
			Meteor.call('gameLogic.setConnectionId',this.props.playerLogic["teamNumber"],this.props.round,this.props.connectionId);
			Meteor.call('gameLogic.setStatus',this.props.playerLogic["teamNumber"],"active",this.props.round);
		}
	},
	handleSubmit:function (e) {
		e.preventDefault();
		$("#input"+this.props.playerLogic["teamNumber"]).blur();
	},
	handleFocus:function () {
		Meteor.call('gameLogic.setStatus',this.props.playerLogic["teamNumber"],"pending",0)
	},
	handleBlur:function (name) {
		$("#input"+this.props.playerLogic["teamNumber"]).prop( "disabled", true );
		if(name.target.value==""){
			Meteor.call('gameLogic.setStatus',this.props.playerLogic["teamNumber"],"",0);
			Meteor.call('gameLogic.setConnectionId',this.props.playerLogic["teamNumber"],this.props.round,"",this.props.connectionId);
		}else{
			Meteor.call('gameLogic.setStatus',this.props.playerLogic["teamNumber"],"ready",0)
		}
		
	},
	scoreStyle:function () {
		if (this.props.round == 0) {
			switch (this.props.playerLogic["status"]) {
				case "pending":
					return {
						fontFamily: "D7",
						fontSize: "4vw",
						minWidth: "10vw",
						border: "4px solid orange",
						padding: "10px",
						borderRadius: 8,
					};
					break;
				case "ready":
					return {
						fontFamily: "D7",
						fontSize: "4vw",
						minWidth: "10vw",
						border: "4px solid #00e800",
						padding: "10px",
						borderRadius: 8,
					};
					break;
				default:
					return {
						fontFamily: "D7",
						fontSize: "4vw",
						minWidth: "10vw",
						border: "4px solid #060CE9",
						padding: "10px",
						borderRadius: 8,
					};
			}
		} else {
			if (this.props.playerLogic["status"] == "reconnect") {
				return {
					fontFamily: "D7",
					fontSize: "4vw",
					minWidth: "10vw",
					border: "4px solid orange",
					padding: "10px",
					borderRadius: 8,
				};
			} else if (this.props.playerLogic["status"] == "out") {
				return {
					fontFamily: "D7",
					fontSize: "4vw",
					minWidth: "10vw",
					border: "4px solid #060CE9",
					padding: "10px",
					borderRadius: 8,
				};
			} else {
				return {
					fontFamily: "D7",
					fontSize: "4vw",
					minWidth: "10vw",
					border: "4px solid #00e800",
					padding: "10px",
					borderRadius: 8,
				};
			}
		}
	},
	render: function () {
		return (
			<div className="flex-container" onClick={this.handleClick}
			     style={{
				     padding: "10px",
				     border: "4px solid white",
				     flexDirection: "column",
				     flex: 1,
			     }}>
				<div style={this.scoreStyle()}>{this.numDisplay()}</div>
				<form onSubmit={this.handleSubmit} className="flex-container">
					<input id={"input"+this.props.playerLogic["teamNumber"]}
					       spellCheck="true"
					       type="text"
					       value={this.props.playerLogic["teamName"]}
					       onChange={this.handleName}
					       style={inputStyle}
					       onFocus={this.handleFocus}
					       onBlur={this.handleBlur}
					       disabled/>
				</form>
			</div>
		)
	}
	
});

module.exports = ScoreBoard;

