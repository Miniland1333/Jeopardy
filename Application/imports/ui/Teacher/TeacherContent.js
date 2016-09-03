import React, {Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';

var TeacherContent = React.createClass({
    propTypes:{
        gameLogic:React.PropTypes.array,
    },
    handleCorrect:function () {
        
    },
    handleIncorrect:function () {
        
    },
    renderContent:function () {
        return <div className="flex-container" style={{flex:1}}></div>;
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