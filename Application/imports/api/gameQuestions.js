/**
 * Created by Henry on 8/27/2016.
 * Storage for the current game's remaining questions
 */
//Available to Server, Teacher, and Viewer
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';


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
		gameQuestions.insert({
			currentRound:{},
			remainingColumns:6,
			dailyDouble:{},
			currentQuestion:{},
			Jeopardy:game.Jeopardy,
			DoubleJeopardy:game.DoubleJeopardy,
			FinalJeopardy:game.FinalJeopardy
		});
	},
	'gameQuestions.loadRound'(roundNumber){
		var roundName;
		switch (roundNumber){
			case 1:
				roundName = "Jeopardy";
				break;
			case 2:
				roundName = "DoubleJeopardy";
				break;
			case 3:
				roundName = "FinalJeopardy";
				break;
		}
		console.log(gameQuestions.find().fetch()[0][roundName]);
		gameQuestions.update({},{$set:{currentRound:gameQuestions.find().fetch()[0][roundName]}});
	},
	
});