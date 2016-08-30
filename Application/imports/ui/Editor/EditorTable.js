import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';


var EditorTable = React.createClass({
    propTypes:{
        round: PropTypes.string.isRequired,
        editorDatabase: PropTypes.array.isRequired,
    },
    renderInput:function () {
        console.log(this.props.editorDatabase);
    },
    
    render:function () {
        return(
            <div>
                <div className="flex-container">
                    {this.renderInput()}
                </div>
            </div>
        )
    }
});


module.exports = EditorTable