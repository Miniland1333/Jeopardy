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
                {this.props.isReady ?
                    <div>
                        <h1 style={{fontFamily:"D7MBI"}}>I am the Teacher!</h1>
                    </div>:<div></div>
                }
                </div>
        </DocumentTitle>
    )}
});


export default createContainer(() => {
    var handle1 = Meteor.subscribe('gameDatabase');
    var handle2 = Meteor.subscribe('gameLogic');
    var handle3 = Meteor.subscribe('gameQuestions');

    return {
        isReady:handle1.ready()&&handle2.ready()&&handle3.ready(),
    };
}, Teacher);