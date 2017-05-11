import {Meteor} from "meteor/meteor";
import "../imports/simple-todos/api/tasks.js";
import "../imports/api/editorDatabase";
import "../imports/api/gameDatabase";
import {gameLogic} from "../imports/api/gameLogic";
import "../imports/api/gameQuestions";


Meteor.startup(() => {
	// code to run on server at startup
	
	//Comment out below to prevent initialization
	//Meteor.call("gameLogic.init");
	Meteor.call('gameLogic.kick', 1, gameLogic.find().fetch()[0]["player" + 1]["connectionId"]);
	Meteor.call('gameLogic.kick', 2, gameLogic.find().fetch()[0]["player" + 2]["connectionId"]);
	
	Meteor.onConnection(function (connection) {
		connection.onClose(function () {
			console.log("closed " + connection.id);
			Meteor.call('gameLogic.kick', 0, connection.id);
		});
		console.log(connection.id);
	});
});
