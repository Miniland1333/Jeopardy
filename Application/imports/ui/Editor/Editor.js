import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import DocumentTitle from 'react-document-title';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

import {gameDatabase} from "../../api/gameDatabase";
import {editorDatabase}from "../../api/editorDatabase";
import EditorHeader from "./EditorHeader";



var Editor = React.createClass({
    getInitialState: function () {
        return {
            round:"Single",
        };
    },
    handleRoundChange:function (round) {
        this.setState({round:round});
    },
    render:function (){
        console.log(this.props.isReady);
        return (
        <DocumentTitle title='Jeopardy Editor'>
            <div>
                <EditorHeader
                    onRoundChange={this.handleRoundChange}
                    gameList={gameDatabase}
                    editorDatabase={editorDatabase}
                    databaseName={editorDatabase.find().fetch()}
                    dbReady={this.props.isReady}/>
                <h1>I am the Editor!</h1>
            </div>
        </DocumentTitle>
    )}
});


export default createContainer(() => {
    var handle1 = Meteor.subscribe('gameDatabase');
    var handle2 = Meteor.subscribe('editorDatabase');
    return {isReady:handle1.ready()&&handle2.ready()};
}, Editor);