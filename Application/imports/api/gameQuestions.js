/**
 * Created by Henry on 8/27/2016.
 * Storage for the current game's remaining questions
 */
//Available to Server, Teacher, and Viewer
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';


export const gameQuestions = new Mongo.Collection('gameQuestions');

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('gameQuestions', function tasksPublication() {
        return gameQuestions.find();
    });
}

Meteor.methods({
    'gameQuestions.load'(game){
        //copies game into gameQuestions or editorDatabase
        gameQuestions.remove({});
    },

});