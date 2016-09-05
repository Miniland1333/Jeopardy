import React, {Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';



var divStyle = {
    flex: 1,
    textAlign: 'center',
    margin: 0,
	alignItems:"center",
	justifyContent:"center",
	fontSize:"7vmin",
};
var Question = React.createClass({
    propTypes:{
        round:React.PropTypes.num,
        key1:React.PropTypes.string,
        key2:React.PropTypes.string,
        game:React.PropTypes.object,
        cell:React.PropTypes.object,
    },
    handleQuestionClick:function () {
            alert("You clicked "+ this.props.key1 + "," + this.props.key2);
    },
	renderContent:function () {
    	var thing;
		switch (this.props.key2){
			case "question1":
				thing =  200;
				break;
			case "question2":
				thing =  400;
				break;
			case "question3":
				thing =  600;
				break;
			case "question4":
				thing =  800;
				break;
			case "question5":
				thing =  1000;
				break;
		}
    	return "$"+ this.props.round*thing;
	},
    render:function () {
        return(
                <div className="Rtable-cell" style={divStyle} onClick={this.handleQuestionClick}>
	                {this.renderContent()}
                </div>)
    }
    
});

module.exports = Question;