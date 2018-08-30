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
	'gameDatabase.save'(game, username) {
		//saves game from editorDatabase
		const d = new Date();
		gameDatabase.update({username: username, name: game.name}, {
			$set: {
				username: username,
				name: game.name,
				Jeopardy: game.Jeopardy,
				DoubleJeopardy: game.DoubleJeopardy,
				FinalJeopardy: game.FinalJeopardy,
				savedOn: d.toUTCString(),
			}
		}, {upsert: true});
		console.log("Saved " + game.name + "!");
	},
	'gameDatabase.remove'(gameName, username) {
		//saves game from editorDatabase
		gameDatabase.remove({username: username, name: gameName});
	},
	'gameDatabase.upgrade'() {
		gameDatabase.update({username: {$exists: false}}, {$set: {username: "mainEditor"}});
	}
});