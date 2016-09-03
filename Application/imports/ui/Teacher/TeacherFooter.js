import React, {Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';

var TeacherFooter = React.createClass({
    propTypes:{
        gameLogic:React.PropTypes.array,
    },
    handleCorrect:function () {
        
    },
    handleIncorrect:function () {
        
    },
    renderContent:function () {
        return <div className="flex-container" style={{flex:1}}>
            <div   style={{padding:0,border:"none",backgroundColor:"#eaeaea", color:"#a5a5a5", flex:1,verticalAlign:"middle"}}>Waiting for Players</div>
            {/*<div onClick={this.handleCorrect}   style={{padding:0,border:"none",backgroundColor:"red",   color:"white", flex:1,verticalAlign:"middle"}}>Incorrect</div>*/}
            {/*<div onClick={this.handleIncorrect} style={{padding:0,border:"none",backgroundColor:"green", color:"white", flex:1,verticalAlign:"middle"}}>Correct</div>*/}
            <div   style={{padding:0,border:"none",backgroundColor:"#eaeaea", color:"green", flex:1,verticalAlign:"middle"}}>Start 6 player Game</div>
        </div>;
    },
    render:function () {
        
        return(
            <div className="flex-container" style={{minHeight:"10vh",fontSize:"5vh",flexDirection:"column"}}>
                {this.renderContent()}
            </div>
        );
    }
});

module.exports = TeacherFooter;