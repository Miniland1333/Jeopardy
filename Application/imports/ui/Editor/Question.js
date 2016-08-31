import React, {Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';

var Question = React.createClass({
    propTypes:{
        roundName:React.PropTypes.string,
        key1:React.PropTypes.string,
        key2:React.PropTypes.string,
        game:React.PropTypes.object,
        cell:React.PropTypes.object,
    },
    handleQuestionClick:function () {
        alert("You clicked "+this.props.roundName+","+this.props.key1+","+this.props.key2)
    },
    
    
    render:function () {
        return(
            <div className="Rtable-cell" onClick={this.handleQuestionClick}>
                <p style={{margin:0}} className="question">{this.props.cell.question}</p>
                <h6 style={{margin:0}}>{this.props.cell.isSinglePlay?"SINGLE PLAY":""}</h6>
                <p style={{margin:0}}>{this.props.cell.answer}</p>
            </div>)
    }
    
});

module.exports = Question;