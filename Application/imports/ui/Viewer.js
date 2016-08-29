import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import DocumentTitle from 'react-document-title';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

import {gameLogic} from "../api/gameLogic"
import {gameQuestions} from "../api/gameQuestions"



var Viewer = React.createClass({
    render:function(){ return (
        <DocumentTitle title='Jeopardy Viewer'>
            <div>
                <h1>I am the Viewer!</h1>
            </div>
        </DocumentTitle>
    )}
});


export default createContainer(() => {
    Meteor.subscribe('gameLogic');
    Meteor.subscribe('gameQuestions');

    return {
    };
}, Viewer);