import React, {Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';



var TeacherContent = React.createClass({
    propTypes:{
        gameLogic:React.PropTypes.object,
	    gameQuestions:React.PropTypes.object,
    },
    renderContent:function () {
    	return <div className="flex-container" style={{fontFamily:"gyparody",fontSize:"20vmin",flex:1,alignItems:"center",justifyContent:"center",
		    whiteSpace: "pre-wrap",}}>Jeopardy!</div>
    },
    render:function () {
        
        return(
            <div className="flex-container" style={{flex:1,flexDirection:"column"}}>
                {this.renderContent()}
            </div>
        );
    }
});

module.exports = TeacherContent;