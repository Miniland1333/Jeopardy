import React, {Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';

import EditModal from "./EditModal"


var divStyle = {
    display: 'flex',
    flex: 1,
    textAlign: 'center',
    flexDirection: 'column',
    margin: 0,
    whiteSpace: "pre-wrap",
};
var Question = React.createClass({
    getInitialState:function () {
        return  {
            EditModal:false,
        };
    },
    propTypes:{
        roundName:React.PropTypes.string,
        key1:React.PropTypes.string,
        key2:React.PropTypes.string,
        game:React.PropTypes.object,
        cell:React.PropTypes.object,
    },
    handleQuestionClick:function () {
        if(!this.state.EditModal){
            //alert("You clicked " + this.props.roundName + "," + this.props.key1 + "," + this.props.key2);
            this.setState({EditModal: true})
        }
    },
    handleClose:function(){
        this.setState({EditModal:false});
    },
    handleEditModule:function () {
        if(this.state.EditModal){
            return(
                <EditModal
                roundName={this.props.roundName}
                key1={this.props.key1}
                key2={this.props.key2}
                question={this.props.cell.question}
                answer={this.props.cell.answer}
                isSinglePlay={this.props.cell.isSinglePlay}
                isHeader={false}
                handleClose={this.handleClose}
            />)
        }else{
            return [];
        }
    },
    render:function () {
        return(
            <div style={divStyle}>
                <div className="Rtable-cell" onClick={this.handleQuestionClick}>
	                {/*todo add logic for alternate question logic*/}
                    <p style={{margin:0}} className="question">{this.props.cell.question}</p>
                    <h6 style={{margin:0}}>{this.props.cell.isSinglePlay?"SINGLE PLAY":""}</h6>
                    <p style={{margin:0}}>{this.props.cell.answer}</p>
                
                </div>
                {this.handleEditModule()}
            </div>)
    }
    
});

module.exports = Question;