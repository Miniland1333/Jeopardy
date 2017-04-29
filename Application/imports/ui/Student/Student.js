import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import DocumentTitle from 'react-document-title';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';

import {gameLogic} from "../../api/gameLogic"

import StudentHeader from "./StudentHeader";
import StudentContent from "./StudentContent";
import Brim from 'brim'
import Scram from 'scream'
import platform from 'platform'
let scream,
	brim;

window.addEventListener('DOMContentLoaded', function () {
	
	if (platform.os.family === 'iOS' && parseInt(platform.os.version, 10) > 8) {
		scream = Scram({
			width: {
				portrait: screen.width,
				landscape: screen.height * 2
			}
		});
		
		brim = Brim({
			viewport: scream
		});
		
		brim.on('viewchange', function (e) {
			document.body.className = e.viewName;
		});
	}
	else{
		$("#brim-mask").hide();
	}
});

export const Student = React.createClass({
	getInitialState: function () {
		return {
			teamNumber: "", //this is set during Start or during reconnect
		}
	},
	render: function () {
		if(scream)
			$("#DISPLAY").text(scream.getOrientation());
		return (
			<DocumentTitle title='Jeopardy'>
				<div>
					<div id="brim-mask">
						<div>Yoy</div>
						<div id="DISPLAY"/>
					</div>
					<div id="brim-main">
						{this.props.isReady ?
							<div className="flex-container Main" style={{flexDirection: "column"}}>
								<StudentHeader gameLogic={this.props.gameLogic[0]}/>
								<StudentContent gameLogic={this.props.gameLogic[0]}/>
							</div> : <div/>
						}
					</div>
				</div>
			</DocumentTitle>
		)
	}
});


export default createContainer(() => {
	const handle1 = Meteor.subscribe('gameLogic');
	
	return {
		isReady: handle1.ready(),
		connectionId: Meteor.connection._lastSessionId,
		gameLogic: gameLogic.find().fetch(),
	};
}, Student);