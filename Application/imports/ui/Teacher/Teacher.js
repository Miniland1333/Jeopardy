import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import DocumentTitle from 'react-document-title';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

import {gameDatabase} from "../../api/gameDatabase";
import {gameLogic} from "../../api/gameLogic";
import {gameQuestions} from "../../api/gameQuestions";

import TeacherHeader  from "./TeacherHeader";
import TeacherFooter  from "./TeacherFooter";
import TeacherContent from "./TeacherContent";

var Teacher = React.createClass({
	propTypes:{
		gameDatabase:React.PropTypes.array,
		gameLogic:React.PropTypes.array,
		gameQuestions:React.PropTypes.array,
	},
	render:function() {
		if(this.props.isReady&&this.props.gameLogic.length==0){
			Meteor.call('gameLogic.init');
		}
		if(this.props.isReady&&this.props.gameQuestions.length==0){
			Meteor.call('gameQuestions.init');}
		return (
			<DocumentTitle title='Jeopardy'>
				<div>
					{this.props.isReady ?
						<div className="flex-container Main" style={{overflow:"auto",flexDirection:"column"}}>
							<TeacherHeader gameLogic={this.props.gameLogic}/>
							<TeacherContent gameLogic={this.props.gameLogic} gameQuestions={this.props.gameQuestions} gameList={this.gameDatabase}/>
							<TeacherFooter gameLogic={this.props.gameLogic}/>
						</div>:<div></div>
					}
				</div>
			</DocumentTitle>
		)}
});


export default createContainer(() => {
	var handle1 = Meteor.subscribe('gameDatabase');
	var handle2 = Meteor.subscribe('gameLogic');
	var handle3 = Meteor.subscribe('gameQuestions');
	
	return {
		isReady:handle1.ready()&&handle2.ready()&&handle3.ready(),
		
		gameDatabase:gameDatabase.find().fetch(),
		gameLogic:gameLogic.find().fetch(),
		gameQuestions:gameQuestions.find().fetch(),
	};
}, Teacher);