import React, {Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';



var divStyle = {
    flex: 1,
    textAlign: 'center',
    margin: 0,
	alignItems:"center",
	justifyContent:"center",
	fontSize:"5vw",
};
var Question = React.createClass({
    propTypes:{
        round:React.PropTypes.number,
        key1:React.PropTypes.string,
        key2:React.PropTypes.string,
        game:React.PropTypes.object,
        cell:React.PropTypes.object,
    },
    handleQuestionClick:function () {
	    if(this.props.cell.question!="") {
		    //alert("You clicked " + this.props.key1 + "," + this.props.key2);
		    Meteor.call('gameQuestions.pickQuestion',this.props.key1,this.props.key2,this.props.cell.question, this.props.cell.answer,this.props.cell.isSinglePlay,this.props.round);
		    //Pops Question and then runs Meteor.call('gameQuestions.checkRemainingColumns');
	    
	    
	    
	    }
    },
	renderContent:function () {
    	var thing;
		if(this.props.cell.question!="") {
			switch (this.props.key2) {
				case "question1":
					thing = 200;
					break;
				case "question2":
					thing = 400;
					break;
				case "question3":
					thing = 600;
					break;
				case "question4":
					thing = 800;
					break;
				case "question5":
					thing = 1000;
					break;
			}
			return "$" + this.props.round * thing;
		}else{
			return "";
		}
	},
    render:function () {
        return(
                <div className="Rtable-cell" style={divStyle} onClick={this.handleQuestionClick}>
	                {this.renderContent()}
                </div>)
    }
    
});

module.exports = Question;