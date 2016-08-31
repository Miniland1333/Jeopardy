import React, {Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';

import EditModal from "./EditModal"

var CategoryHeader = React.createClass({
    getInitialState:function () {
        return  {
            EditModal:false,
        };
    },
    propTypes:{
        roundName:React.PropTypes.string,
        key1:React.PropTypes.string,
        categoryName:React.PropTypes.string,
    },
    handleQuestionHeaderClick:function () {
        //alert("You clicked "+this.props.roundName+","+this.props.key1);
        this.setState({EditModal:true})
    },
    handleClose:function(){
        this.setState({EditModal:false});
        this.forceUpdate(
            alert("rerendered!",this.state.EditModal)
        );
    },
    handleEditModule:function () {
        return this.state.EditModal?
            <EditModal
                roundName={this.props.roundName}
                categoryName={this.state.EditModal}
                key1={this.props.key1}
                isHeader={true}
                handleClose={this.handleClose}
            /> :[]
    },
    render:function () {
        return(<div className="Header" onClick={this.handleQuestionHeaderClick}>{this.props.categoryName}
            {this.handleEditModule()}
        </div>)
    }
    
});

module.exports = CategoryHeader;