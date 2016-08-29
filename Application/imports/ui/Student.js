import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import DocumentTitle from 'react-document-title';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

import {gameLogic} from "../api/gameLogic"




var Student = React.createClass({
    render:function(){ return (
        <DocumentTitle title='Jeopardy'>
            <div>
                <h1>I am a Student!</h1>
            </div>
        </DocumentTitle>
    )}
});


export default createContainer(() => {
    Meteor.subscribe('gameLogic');

    return {
    };
}, Student);