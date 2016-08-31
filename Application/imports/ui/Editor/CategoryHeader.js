import React, {Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';

var CategoryHeader = React.createClass({
    propTypes:{
        roundName:React.PropTypes.string,
        key1:React.PropTypes.string,
        categoryName:React.PropTypes.string,
    },
    handleQuestionHeaderClick:function () {
        alert("You clicked "+this.props.roundName+","+this.props.key1);
        
    },
    
    
    render:function () {
        return(<div className="Header" onClick={this.handleQuestionHeaderClick}>{this.props.categoryName}</div>)
    }
    
});

module.exports = CategoryHeader;