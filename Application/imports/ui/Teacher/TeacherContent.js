import React, {Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';

import GameDropdown from "./GameDropdown";

import Question from "./Question";

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
			    return <div className="flex-container" style={{fontFamily:"gyparody",fontSize:"20vmin",flex:1,alignItems:"center",justifyContent:"center",
				    whiteSpace: "pre-wrap",}}>Jeopardy!</div>;
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