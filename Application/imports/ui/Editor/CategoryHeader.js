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
        if(!this.state.EditModal){
            //alert("You clicked "+this.props.roundName+","+this.props.key1);
            this.setState({EditModal:true});
        }
    },
    handleClose:function(){
        this.setState({EditModal:false});
    },
    handleEditModule:function () {
        return this.state.EditModal?
            <EditModal
                roundName={this.props.roundName}
                categoryName={this.state.categoryName}
                key1={this.props.key1}
                isHeader={true}
                className="needclick"
                handleClose={this.handleClose}
            /> :[]
    },
    render:function () {
        return(<div>
            <div className="Header"  onClick={this.handleQuestionHeaderClick}>{this.props.categoryName}</div>
            {this.state.EditModal?
                <EditModal
                    roundName={this.props.roundName}
                    categoryName={this.props.categoryName}
                    key1={this.props.key1}
                    isHeader={true}
                    handleClose={this.handleClose}
                /> :[]}
        </div>)
    }
    
});

module.exports = CategoryHeader;