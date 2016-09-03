import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import DocumentTitle from 'react-document-title';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

import {gameLogic} from "../../api/gameLogic"




var Student = React.createClass({
    getInitialState:function() {
        return {
            teamNumber:"", //this is set during Start or during reconnect
        }
    },
    render:function(){
        return (
            <DocumentTitle title='Jeopardy'>
                <div>
                    {this.props.isReady ?
                        <div>
                            <h1>I am a Student!</h1>
                            <p>{this.props.connectionId}</p>
                        </div>:<div></div>
                    }
                </div>
            </DocumentTitle>
        )}
});


export default createContainer(() => {
    var handle1 = Meteor.subscribe('gameLogic');
    
    return {
        isReady:handle1.ready(),
        connectionId:Meteor.connection._lastSessionId
    };
}, Student);