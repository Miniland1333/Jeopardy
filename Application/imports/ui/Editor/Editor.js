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
            round:"Single"
        };
    },
    handleRoundChange:function (round) {
        this.setState({round:round});
    },
    render:function (){
        return (
        <DocumentTitle title='Jeopardy Editor'>
            <div>
                <EditorHeader
                    onRoundChange={this.handleRoundChange}
                    gameList={gameDatabase}
                    editorDatabase={editorDatabase}
                    databaseName={editorDatabase.find().fetch()[0]}/>
                <h1>I am the Editor!</h1>
            </div>
        </DocumentTitle>
    )}
});


export default createContainer(() => {
    Meteor.subscribe('gameDatabase');
    Meteor.subscribe('editorDatabase');

    return {
    };
}, Editor);