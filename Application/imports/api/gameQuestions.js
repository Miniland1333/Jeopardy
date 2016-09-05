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
		gameQuestions.update({},{$set:{currentRound:gameQuestions.find().fetch()[0][roundName]}});
		
		//Remove empty categories and update remaining Columns
		if(roundNumber!=3) {

			Meteor.call('gameQuestions.checkRemainingColumns');
			var currentRound = gameQuestions.find().fetch()[0]["currentRound"];
			//Daily Double handling
			if(roundNumber==1){
				//set single
				pickDailyDouble("single");
			}else if(roundNumber==2){
				//set double
				pickDailyDouble("double1");
				pickDailyDouble("double2");
			}
			function pickRandomProperty(obj) {
				var result;
				var count = 0;
				for (var prop in obj) {
					if (obj.hasOwnProperty(prop) && prop != "categoryName" && Math.random() < 1 / ++count) {
						result = prop;
					}
				}
				return result;
			}
			
			function pickDailyDouble(name){
				var dailyDouble = gameQuestions.find().fetch()[0]["dailyDouble"];
				var done = false;
				while(!done){
					var category=pickRandomProperty(currentRound);
					var question = pickRandomProperty(currentRound[category]);
					var bundle = {};
					bundle['dailyDouble.'+name]={
						category:category,
						question:question,
					};
					var duplicate = false;
					for (var prop in dailyDouble) {
						if (dailyDouble.hasOwnProperty(prop)) {
							if (dailyDouble[prop] == {
									category: category,
									question: question,
								}) {
								duplicate = true;
							}
						}
					}
					if(!duplicate){
						gameQuestions.update({},{$set:bundle});
						done=true;
					}
				}
			}
		}
	},
	'gameQuestions.checkRemainingColumns'(){
		var catCount = 0;
		for (var i = 1; i <= 6; i++) {
			var catName = gameQuestions.find().fetch()[0]["currentRound"]["category" + i]["categoryName"];
			if (catName.trim() != "") catCount++;
		}
		gameQuestions.update({},{$set:{remainingColumns:catCount}});
	},
});