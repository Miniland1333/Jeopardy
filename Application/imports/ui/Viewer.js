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
                {this.props.isReady ?
                    <div>
                        <h1>I am the Viewer!</h1>
                    </div>:<div></div>
                }
                </div>
        </DocumentTitle>
    )}
});


export default createContainer(() => {
    var handle1 = Meteor.subscribe('gameLogic');
    var handle2 = Meteor.subscribe('gameQuestions');

    return {
        isReady:handle1.ready()&&handle2.ready(),
    };
}, Viewer);