/**
 * Created by Henry on 8/27/2016.
 * Storage for all available games
 */
//Available only to Server and Editor
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';


export const editorDatabase = new Mongo.Collection('editorDatabase');

if (Meteor.isServer) {
	// This code only runs on the server
	Meteor.publish('editorDatabase', function editorDatabasePublication() {
		return editorDatabase.find();
	});
}

Meteor.methods({
	'editorDatabase.init'(){
		editorDatabase.remove({});
		//initializes editorDatabase
		var categoryTemplate = {
			categoryName:"",
		};
		for(var i=1;i<=5;i++){
			/*            categoryTemplate["question"+i] = {
			 isSinglePlay:true,
			 question:"question"+i,
			 answer:"answer"+i,
			 };*/
			categoryTemplate["question"+i] = {
				isSinglePlay:false,
				question:"",
				answer:"",
			};
		}
		
		var gameTemplate = {};
		for(var j=1;j<=6;j++){
			gameTemplate["category"+j] = categoryTemplate;
		}
		
		editorDatabase.insert({
			name:"",
			Jeopardy:gameTemplate,
			DoubleJeopardy:gameTemplate,
			FinalJeopardy:{
				category:"",
				question:"",
				answer:"",
			},
		});
	},
	'editorDatabase.load'(game){
		editorDatabase.remove({});
		editorDatabase.insert({
			name:game.name,
			Jeopardy:game.Jeopardy,
			DoubleJeopardy:game.DoubleJeopardy,
			FinalJeopardy:game.FinalJeopardy
		});
	},
	'editorDatabase.updateName'(name){
		check(name, String);
		editorDatabase.update({},{$set:{name : name}});
	},
	'editorDatabase.updateCategory'(round,identifier,name){
		//check if finalJ
		if(round=="FinalJeopardy"){
			editorDatabase.update({},{$set:{"FinalJeopardy.category":name}});
		}else {
			var bundle = {};
			bundle[round + "." + identifier + ".categoryName"] = name;
			editorDatabase.update({}, {$set: bundle});
		}
		console.log(editorDatabase.find().fetch());
		
	},
	'editorDatabase.updateQuestion'(round,identifier1,identifier2,question,answer,isSinglePlay){
		//check if finalJ
		if(round=="FinalJeopardy"){
			editorDatabase.update({},{$set:{"FinalJeopardy.question":question,"FinalJeopardy.answer":answer}});
		}else {
			var minibundle = {
				question: question,
				answer: answer,
				isSinglePlay: isSinglePlay,
			};
			var bundle = {};
			bundle[round + "." + identifier1 + "." + identifier2] = minibundle;
			
			editorDatabase.update({}, {$set: bundle});
		}
	},
});