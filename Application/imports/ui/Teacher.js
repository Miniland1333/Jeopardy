import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import DocumentTitle from 'react-document-title';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

import {gameDatabase} from "../api/gameDatabase"
import {gameLogic} from "../api/gameLogic"
import {gameQuestions} from "../api/gameQuestions"


var Teacher = React.createClass({
    render:function(){ return (
        <DocumentTitle title='Jeopardy'>
            <div>
                <h1>I am the Teacher!</h1>
            </div>
        </DocumentTitle>
    )}
});


export default createContainer(() => {
    Meteor.subscribe('gameDatabase');
    Meteor.subscribe('gameLogic');
    Meteor.subscribe('gameQuestions');

    return {
    };
}, Teacher);