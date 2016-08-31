import React, {Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';


var cursorStyle = {
    cursor:"pointer"
};

var gameLi = React.createClass({
    propTypes:{
        game:React.PropTypes.object
    },
    handleDelete:function(){
        if(confirm("This will delete "+this.props.game.name+". Are you sure?")) {
            Meteor.call('gameDatabase.remove', this.props.game.name);
        }
    },
    handleLoad:function () {
        if(confirm("This will delete all unsaved work. Continue?")) {
            Meteor.call('editorDatabase.load',this.props.game);
            $("#myDropdown").slideUp();
        }
    },
    render: function () {
        return(
        <li>
            <span className="text" style={cursorStyle} onClick={this.handleLoad}>{this.props.game.name}</span>
            <button className="delete" style={cursorStyle} onClick={this.handleDelete}>&times;</button>
        </li>)
    
    }
});


module.exports = gameLi;