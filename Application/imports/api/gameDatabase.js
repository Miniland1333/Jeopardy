/**
 * Created by Henry on 8/27/2016.
 * Storage for all available games
 */
//Available only to Server and Teacher
import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";


export const gameDatabase = new Mongo.Collection('gameDatabase');

if (Meteor.isServer) {
	// This code only runs on the server
	Meteor.publish('gameDatabase', function tasksPublication() {
		return gameDatabase.find();
	});
}

Meteor.methods({
	'gameDatabase.save'(game){
		//saves game from editorDatabase
		gameDatabase.remove({name: game.name});
		gameDatabase.insert({
			name: game.name,
			Jeopardy: game.Jeopardy,
			DoubleJeopardy: game.DoubleJeopardy,
			FinalJeopardy: game.FinalJeopardy
		});
		console.log("Saved " + game.name + "!");
	},
	'gameDatabase.remove'(gameName){
		//saves game from editorDatabase
		gameDatabase.remove({name: gameName});
	}
	
});