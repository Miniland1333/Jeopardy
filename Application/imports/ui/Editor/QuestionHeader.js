import React, {Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';

var QuestionHeader = React.createClass({
    propTypes:{
        roundName:React.PropTypes.string,
        categoryName:React.PropTypes.string,
    },
    handleQuestionHeaderClick:function () {
        
    },
    
    
    render:function () {
        return(<div className="Header">{this.props.categoryName}</div>)
    }
    
});

module.exports = QuestionHeader;