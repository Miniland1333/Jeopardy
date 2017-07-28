import {Meteor} from "meteor/meteor";
import "../imports/api/editorDatabase";
import "../imports/api/gameDatabase";
import "../imports/api/gameLogic";
import "../imports/api/gameQuestions";
import "../imports/api/pingDatabase";

Meteor.startup(() => {
	// code to run on server at startup
	
	//Comment out below to prevent initialization
	Meteor.call("gameLogic.init");
	Meteor.call("pingDatabase.init");
	
	Meteor.onConnection(function (connection) {
		connection.onClose(function () {
			console.log("closed " + connection.id);
			Meteor.call('gameLogic.kick', 0, connection.id);
			Meteor.call('pingDatabase.kick', connection.id);
		});
		console.log(connection.id);
	});
	
	Meteor.setTimeout(()=>Meteor.call("pingDatabase.init"), 6000);
});
