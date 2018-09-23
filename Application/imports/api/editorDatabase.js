/**
 * Created by Henry on 8/27/2016.
 * Storage for all available games
 */
//Available only to Server and Editor
import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {check} from "meteor/check";


export const editorDatabase = new Mongo.Collection('editorDatabase');

if (Meteor.isServer) {
	// This code only runs on the server
	Meteor.publish('editorDatabase', function editorDatabasePublication() {
		return editorDatabase.find();
	});
}

Meteor.methods({
	'editorDatabase.reset'() {
		editorDatabase.remove({});
	},
	'editorDatabase.init'(username = "mainEditor") {
		// console.log(username);

		//initializes editorDatabase
		const categoryTemplate = {
			categoryName: "",
			categoryExplanation: "",
		};
		for (let i = 1; i <= 5; i++) {
			categoryTemplate["question" + i] = {
				isSinglePlay: false,
				question: "",
				answer: "",
			};
		}

		const gameTemplate = {};
		for (let j = 1; j <= 6; j++) {
			gameTemplate["category" + j] = categoryTemplate;
		}

		editorDatabase.update({username: {$exists: false}}, {$set: {username: "mainEditor"}});
		editorDatabase.update({username: username}, {
			$set: {
				username: username,
				name: "",
				Jeopardy: gameTemplate,
				DoubleJeopardy: gameTemplate,
				FinalJeopardy: {
					category: "",
					question: "",
					answer: "",
				},
			}
		}, {upsert: true});
	},
	'editorDatabase.load'(game, username = "mainEditor") {
		let bundle = {
			username: username,
			name: game.name,
			Jeopardy: game.Jeopardy,
			DoubleJeopardy: game.DoubleJeopardy,
			FinalJeopardy: game.FinalJeopardy,
			lastSave: game.savedOn,
		};
		editorDatabase.update({username: username}, {$set: bundle}, {upsert: true});
	}
	,
	'editorDatabase.updateName'(name, username = "mainEditor") {
		check(name, String);
		editorDatabase.update({username: username}, {$set: {name: name}});
	}
	,
	'editorDatabase.updateCategory'(round, identifier, name, categoryExplanation, username = "mainEditor") {
		//check if finalJ
		if (round === "FinalJeopardy") {
			editorDatabase.update({username: username}, {$set: {"FinalJeopardy.category": name}});
		}
		else {
			const bundle = {};
			bundle[round + "." + identifier + ".categoryName"] = name;
			bundle[round + "." + identifier + ".categoryExplanation"] = categoryExplanation;
			editorDatabase.update({username: username}, {$set: bundle});
		}
		//console.log(editorDatabase.find().fetch());

	}
	,
	'editorDatabase.updateQuestion'(round, identifier1, identifier2, question, answer, isSinglePlay, username = "mainEditor") {
		//check if finalJ
		if (round == "FinalJeopardy") {
			editorDatabase.update({username: username}, {
				$set: {
					"FinalJeopardy.question": question,
					"FinalJeopardy.answer": answer
				}
			});
		}
		else {
			const minibundle = {
				question: question,
				answer: answer,
				isSinglePlay: isSinglePlay,
			};
			const bundle = {};
			bundle[round + "." + identifier1 + "." + identifier2] = minibundle;

			editorDatabase.update({username: username}, {$set: bundle});
		}
	},
	'editorDatabase.studentEditor'(username = "mainEditor") {
		const editorDB = editorDatabase.find({id: username}).fetch()[0];
		if (!editorDB) {
			Meteor.call('editorDatabase.init', username);
		}
	},
	'editorDatabase.removeStudents'(){
		editorDatabase.update({username: {$exists: false}}, {$set: {username: "mainEditor"}});
		editorDatabase.remove({username: {$ne: "mainEditor"}});
	}
})
;