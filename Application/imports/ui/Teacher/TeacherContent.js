import React, {Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';

import GameDropdown from "./GameDropdown";

var TeacherContent = React.createClass({
    propTypes:{
        gameDatabase:React.PropTypes.array,
        gameLogic:React.PropTypes.object,
	    gameQuestions:React.PropTypes.array,
    },
    renderContent:function () {
    	if(this.props.gameLogic["round"]==0) {
		    return <div className="flex-container" style={{flex: 1}}>
			    <GameDropdown gameDatabase={this.props.gameDatabase} gameLogic={this.props.gameLogic}/>
		    </div>;
	    }
    },
    render:function () {
        
        return(
            <div className="flex-container" style={{flex:1}}>
                {this.renderContent()}
            </div>
        );
    }
});

module.exports = TeacherContent;