import React, {Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';





var StudentContent = React.createClass({
	propTypes:{
		gameLogic:React.PropTypes.object,
	},
	render:function () {
		
		if(this.props.gameLogic["connections"][Meteor.connection._lastSessionId]==undefined) {
			
			return (<div className="flex-container" style={{flexDirection: "column"}}>
					<h1>Tap a box to register!</h1>
					<p>{Meteor.connection._lastSessionId}</p>
				</div>
			);
			
		}else{
			return <div/>;
		}
	}
});


module.exports = StudentContent;