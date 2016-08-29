/**
 * Created by Henry on 8/27/2016.
 * Storage for the internal game logic
 */
//Available to Everyone
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';


export const gameLogic = new Mongo.Collection('gameLogic');

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('gameLogic', function tasksPublication() {
        return gameLogic.find();
    });
}

Meteor.methods({
    'gameLogic.init'(){
        gameLogic.remove({});
        //initializes gameLogic
    },
    'gameLogic.setupPlayers'(){
        //Turns setupPlayer into players
    },
    'gameLogic.setTeamName'(teamNumber,teamName){

    },
    'gameLogic.kick'(teamNumber){
        //resets a setupPlayer{player}
    },
    'gameLogic.setStatus'(teamNumber,teamStatus){

    },
});