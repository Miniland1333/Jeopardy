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
					if(currentRound[category]["categoryName"]!="") {
						var question = pickRandomProperty(currentRound[category]);
						var bundle = {};
						bundle['dailyDouble.' + name] = {
							category: category,
							question: question,
						};
						var duplicate = false;
						
						function isEqual(name, category, question) {
							if (dailyDouble[name]['category'] == category && dailyDouble[name]['question'] == question) {
								duplicate = true;
							}
						}
						
						for (var prop in dailyDouble) {
							if (dailyDouble.hasOwnProperty(prop)) {
								isEqual(prop, category, question);
							}
						}
						if (!duplicate) {
							gameQuestions.update({}, {$set: bundle});
							done = true;
						}
					}
				}
			}
		}
	},
	'gameQuestions.checkRemainingColumns'(){
		var catCount = 0;
		
		for (var i = 1; i <= 6; i++) {
			//code to remove category name if questions are empty
			var bundle ={};
			var currentCategory = gameQuestions.find().fetch()[0]["currentRound"]["category" + i];
			var empty = true;
			for(var q=1;q<=5;q++){
				if(currentCategory["question"+q]["question"].trim()!=""){
					empty = false;
				}
			}
			if(empty){
				bundle["currentRound.category" + i+".categoryName"]="";
				gameQuestions.update({},{$set:bundle});
			}
			
			//only categories with a name are counted
			currentCategory = gameQuestions.find().fetch()[0]["currentRound"]["category" + i];
			var catName = currentCategory["categoryName"];
			if (catName.trim() != "") {
				catCount++;
				
			}else {
				//code to remove questions from empty category
				bundle ={};
				var categoryTemplate = {
					categoryName:"",
				};
				for(var c=1;c<=5;c++){
					categoryTemplate["question"+c] = {
						isSinglePlay:false,
						question:"",
						answer:"",
					};
				}
				bundle["currentRound.category" + i] = categoryTemplate;
				gameQuestions.update({},{$set:bundle});
			}
		}
		gameQuestions.update({},{$set:{remainingColumns:catCount}});
	},
	'gameQuestions.pickQuestion'(key1,key2,question,answer,isSinglePlay,round){
		var dailyDouble = gameQuestions.find().fetch()[0]['dailyDouble'];
		var isDailyDouble = false;
		
		function isEqual(name){
			if(dailyDouble[name]['category']==key1&&dailyDouble[name]['question']==key2){
				isDailyDouble=true;
			}
		}
		if(round==1){
			isEqual('single');
		}else{
			isEqual('double1');
			isEqual('double2');
		}
		var value;
			switch (key2) {
				case "question1":
					value = 200;
					break;
				case "question2":
					value = 400;
					break;
				case "question3":
					value = 600;
					break;
				case "question4":
					value = 800;
					break;
				case "question5":
					value = 1000;
					break;
			}
			value = value*round;
		var bundle={};
		bundle['currentQuestion'] = {
			question: question,
			answer: answer,
			isSinglePlay: isSinglePlay,
			isDailyDouble: isDailyDouble,
			value:value,
		};
		gameQuestions.update({},{$set:bundle});
		//Pops Question and then checks Columns.
		bundle={};
		bundle["currentRound."+key1+"."+key2]={
			isSinglePlay:false,
			question:"",
			answer:"",
		};
		gameQuestions.update({},{$set:bundle});
		Meteor.call('gameQuestions.checkRemainingColumns');
	}
});