import React, {Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';

var Question = React.createClass({
    propTypes:{
        roundName:React.PropTypes.string,
        game:React.PropTypes.object,
        cell:React.PropTypes.object,
    },
    handleQuestionClick:function () {
        
    },
    
    
    render:function () {
        return(
            <div className="Rtable-cell">
                <p className="question">{this.props.cell.question}</p>
                <p>{this.props.cell.answer}</p>
            </div>)
    }
    
});

module.exports = Question;