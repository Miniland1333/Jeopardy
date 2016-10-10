import React, {Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';

import GameDropdown from "./GameDropdown";

import Question from "./Question";


var questionStyle={
	fontSize:"6vmin",
	flex:1,
	alignItems:"center",
	whiteSpace: "pre-wrap",
	justifyContent:"center",
};
var answerStyle={
	fontSize:"4vmin",
};

var TeacherContent = React.createClass({
    propTypes:{
        gameDatabase:React.PropTypes.array,
        gameLogic:React.PropTypes.object,
	    gameQuestions:React.PropTypes.object,
    },
    renderContent:function () {
    	if(this.props.gameLogic["round"]==0) {
		    return <div className="flex-container" style={{flex: 1}}>
			    <GameDropdown gameDatabase={this.props.gameDatabase} gameLogic={this.props.gameLogic}/>
		    </div>;
	    }
	    switch (this.props.gameLogic["state"]) {
		    case "":
		    case "intro":
		    case "categoryIntro":
			    var title;
			    switch (this.props.gameLogic["round"]){
				    case 1:
					    return <div className="flex-container" style={{fontFamily:"gyparody",fontSize:"20vmin",flex:1,alignItems:"center",justifyContent:"center",
						    whiteSpace: "pre-wrap",}}>Jeopardy!</div>;
				    case 2:
					    return <div className="flex-container" style={{fontFamily:"gyparody",fontSize:"20vmin",flex:1,alignItems:"center",justifyContent:"center",
						    whiteSpace: "pre-wrap",}}>Double<br/>Jeopardy!</div>;
				    case 3:
					    return <div className="flex-container" style={{fontFamily:"gyparody",fontSize:"20vmin",flex:1,alignItems:"center",justifyContent:"center",
						    whiteSpace: "pre-wrap",}}>Final<br/>Jeopardy!</div>;
			    }
			    break;
			    break;
		    case "categories":
			    return <div key="" className="Table">
				    {$.map(this.props.gameQuestions["currentRound"], function (column, key1) {
					    return (
						    <div className="Column" key={key1}>
							    {$.map(column, function (cell, key2) {
								    return key2 == "categoryName" ?
									    <div className="Header" key={key1 + "H"} style={{alignItems:"center", justifyContent:"center",fontSize:"2vmin",}}>{cell}</div>
									    :
									    [];

							    })}
						    </div>
					    )
				    })}
			    </div>;
			    break;
		    case "pickQuestion":
			    var round = this.props.gameLogic["round"];
				    return <div key="" className="Table">
				    {$.map(this.props.gameQuestions["currentRound"], function (column, key1) {
					    return (
						    <div className="Column" key={key1}>
							    {$.map(column, function (cell, key2) {
								    return key2 == "categoryName" ?
									    <div className="Header" key={key1 + "H"} style={{alignItems:"center", justifyContent:"center",fontSize:"2vmin",}}>{cell}</div>
									    :
									    <Question key={key1 + key2} cell={cell} round={round} key1={key1} key2={key2}/>;

							    })}
						    </div>
					    )
				    })}
			    </div>;
		    case "DailyDouble":
		    case "wager":
			    return <div className="flex-container" style={{fontFamily:"gyparody",fontSize:"20vmin",flex:1,alignItems:"center",justifyContent:"center",
				    whiteSpace: "pre-wrap",}}>Daily<br/>Double</div>;
		    case "questionDecide":
		    	Meteor.call('gameLogic.resetCurrentQuestionLogic');
			    if(this.props.gameQuestions["currentQuestion"]["isDailyDouble"]){
				    Meteor.call('gameLogic.setState',"DailyDouble");
			    }else{
				    Meteor.call('gameLogic.setState',"read");
			    }
			    break;
		    case "read":
		    case "open":
		    case "answer":
		    case "DDread":
		    case "DDanswer":
	        case "next":
		    	return(
			    <div className="flex-container" style={{flexDirection:"column",flex:1}}>
				    <div style={questionStyle}>{this.props.gameQuestions["currentQuestion"]["question"]}</div>
				    <div style={answerStyle}  >{this.props.gameQuestions["currentQuestion"]["answer"]}</div>

			    </div>);
		    case "FJwager":
			    return <div style={{fontSize:"20vmin",flex:1,alignItems:"center",justifyContent:"center",
				    whiteSpace: "pre-wrap",textTransform: "uppercase"}}>{this.props.gameQuestions["currentRound"]['category']}</div>;
			    break;
		    case "FJread":
		    case "FJopen":
		    case "FJanswer":
			    var player =  this.props.gameLogic["FJ"]["currentPlayer"];
			    var wager;
			    if(player!=0){
				    wager = "Wager: "+this.props.gameLogic["player" + player]["wager"];
			    }else{
				    wager ="";
			    }
			    return(
				    <div className="flex-container" style={{flexDirection:"column",flex:1}}>
					    <div style={questionStyle}>{this.props.gameQuestions["currentRound"]["question"]}</div>
					    <div style={answerStyle}  >{this.props.gameQuestions["currentRound"]["answer"]}</div>
					    <div style={{position:"absolute",top:10,right:10,
						    fontSize: "3vw",
						    minWidth: "10vw",
					    }}>{wager}</div>
				    </div>);
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
