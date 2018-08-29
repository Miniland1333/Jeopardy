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
	'editorDatabase.init'(name) {
		const editorDB = editorDatabase.find().fetch()[0];
		let student = editorDB && editorDB.student ? editorDB.student : {};

		if (!name) {
			editorDatabase.remove({});
		}


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

		if (!name) {
			editorDatabase.insert({
				name: "",
				Jeopardy: gameTemplate,
				DoubleJeopardy: gameTemplate,
				FinalJeopardy: {
					category: "",
					question: "",
					answer: "",
				},
				student: student || {},
			});
		}
		else {
			student[name] = {
				name: "",
				Jeopardy: gameTemplate,
				DoubleJeopardy: gameTemplate,
				FinalJeopardy: {
					category: "",
					question: "",
					answer: "",
				},
			};
			editorDatabase.update({}, {$set: {student: student}}, {upsert: true});
		}
	},
	'editorDatabase.load'(game) {
		editorDatabase.remove({});
		editorDatabase.insert({
			name: game.name,
			Jeopardy: game.Jeopardy,
			DoubleJeopardy: game.DoubleJeopardy,
			FinalJeopardy: game.FinalJeopardy,
			lastSave: game.savedOn,
		});
	},
	'editorDatabase.updateName'(name) {
		check(name, String);
		editorDatabase.update({}, {$set: {name: name}});
	},
	'editorDatabase.updateCategory'(round, identifier, name, categoryExplanation) {
		//check if finalJ
		if (round === "FinalJeopardy") {
			editorDatabase.update({}, {$set: {"FinalJeopardy.category": name}});
		}
		else {
			const bundle = {};
			bundle[round + "." + identifier + ".categoryName"] = name;
			bundle[round + "." + identifier + ".categoryExplanation"] = categoryExplanation;
			editorDatabase.update({}, {$set: bundle});
		}
		//console.log(editorDatabase.find().fetch());

	},
	'editorDatabase.updateQuestion'(round, identifier1, identifier2, question, answer, isSinglePlay) {
		//check if finalJ
		if (round == "FinalJeopardy") {
			editorDatabase.update({}, {$set: {"FinalJeopardy.question": question, "FinalJeopardy.answer": answer}});
		}
		else {
			const minibundle = {
				question: question,
				answer: answer,
				isSinglePlay: isSinglePlay,
			};
			const bundle = {};
			bundle[round + "." + identifier1 + "." + identifier2] = minibundle;

			editorDatabase.update({}, {$set: bundle});
		}
	},
	'editorDatabase.studentEditor'(name) {
		const editorDB = editorDatabase.find().fetch()[0];
		if (!editorDB.student || !editorDB.student[name]) {
			Meteor.call('editorDatabase.init', name);
		}

		// editorDatabase.update({}, {$set: {student: bundle}}, {upsert: true});
	}
});