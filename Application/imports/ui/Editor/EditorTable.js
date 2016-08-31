import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {Meteor} from 'meteor/meteor';

import Question from "./Question";
import QuestionHeader from "./QuestionHeader"
import EditModal from "./EditModal"

var EditorTable = React.createClass({
    propTypes: {
        round: PropTypes.string.isRequired,
        editorDatabase: PropTypes.array.isRequired,
    },
    resize:function () {
        $(".Main").css({
            "height": window.innerHeight,
            "width":window.innerWidth,
        });
        $("body").css({
            "height": window.innerHeight,
            "width":window.innerWidth,
        });
    },
    renderInput: function () {
        $(window).resize(this.resize);
        this.resize();
        var roundName;
        switch (this.props.round) {
            case "Single":
                roundName = "Jeopardy";
                break;
            case "Double":
                roundName = "DoubleJeopardy";
                break;
            case "Final":
                roundName = "FinalJeopardy"
        }
        var round = this.props.editorDatabase[0][roundName];
        console.log(roundName);
        return (roundName == "FinalJeopardy" ?
                <div key="" className="Table">
                    <div className="Column" key="C1">
                        <QuestionHeader categoryName={round.category} roundName={roundName} key1={"category"}/>
                        <Question cell={round} roundName={roundName} key1={"question"}/>
                    </div>
                </div>
                :
                <div key="" className="Table">
                    {$.map(round, function (column, key1) {
                        return (
                            <div className="Column" key={key1}>
                                {$.map(column, function (cell, key2) {
                                    return key2 == "categoryName" ?
                                        //<div className="Header" key={key1 + "H"}>{cell}</div>
                                        <QuestionHeader key={key1 + "H"} categoryName={cell} roundName={roundName} key1={key1}/>
                                        :
                                        <Question key={key1 + key2} cell={cell} roundName={roundName} key1={key1} key2={key2}/>;
                                    /*                       <div className="Rtable-cell" key={key1 + key2}><p
                                            className="question">{cell.question}</p><p>{cell.answer}</p></div>*/
                                            
                                })}
                            </div>
                        )
                    })}
                </div>
        );
        /*        return(
         <div className="Table">
         <div className="Column">
         <div style={{order:1}} className="Header"><h3 className="question">Eddard Stark</h3></div>
         <div style={{order:2}} className="Rtable-cell"><p className="question">Has a sword named Ice</p></div>
         <div style={{order:3}} className="Rtable-cell"><p className="question">No direwolf</p></div>
         <div style={{order:4}} className="Rtable-cell"><p className="question">Lord of Winterfell</p></div>
         </div>
         <div className="Column">
         <div style={{order:1}} className="Header"><h3 className="question">Jon Snow</h3></div>
         <div style={{order:2}} className="Rtable-cell"><p className="question">Has a sword named Longclaw</p></div>
         <div style={{order:3}} className="Rtable-cell"><p className="question">Direwolf: Ghost</p></div>
         <div style={{order:4}} className="Rtable-cell"><p className="question">Knows nothing</p></div>
         </div>
         <div className="Column">
         <div style={{order:1}} className="Header"><h3 className="question">Arya Stark</h3></div>
         <div style={{order:2}} className="Rtable-cell"><p className="question">This version of Harry Potter adds this type of new character to the series.</p><p>What is the act of seeing ghosts at night or maybe in the toilet?</p></div>
         <div style={{order:3}} className="Rtable-cell"><p className="question">Direwolf: Nymeria</p></div>
         <div style={{order:4}} className="Rtable-cell"><p className="question">No one</p></div>
         </div>
         </div>
         )*/
    },
    modal: function (reference) {
        
    },
    
    render: function () {
        
        
        return (
            <div className="Table">
                {this.renderInput()}
                <EditModal/>
            </div>
        )
    }
});


module.exports = EditorTable;