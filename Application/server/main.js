import {Meteor} from "meteor/meteor";
import "../imports/api/editorDatabase";
import "../imports/api/gameDatabase";
import "../imports/api/gameLogic";
import "../imports/api/gameQuestions";
import "../imports/api/pingDatabase";
import {pingDatabase} from "../imports/api/pingDatabase";

Meteor.startup(() => {
	// code to run on server at startup

	//Comment out below to prevent initialization
	// Meteor.call("gameLogic.init");
	Meteor.call("pingDatabase.init");
	Meteor.call("gameLogic.kickAll");

	Meteor.onConnection(function (connection) {
		connection.onClose(function () {
			console.log("Closed " + connection.id);
			Meteor.call('gameLogic.kick', 0, connection.id);
			Meteor.call('pingDatabase.kick', connection.id);
		});
		console.log(connection.id);
	});

	Meteor.setInterval(() => { //checks Ping for Timeouts
		let pings = pingDatabase.find().fetch();
		for (const ping of pings) {
			if (ServerTime.now() - ping.time > 10000) {
				console.log("Timeout " + ping.connectionId);
				Meteor.call('gameLogic.kick', 0, ping.connectionId);
				Meteor.call('pingDatabase.kick', ping.connectionId);
			}
		}

	}, 10000);

	Meteor.setTimeout(() => Meteor.call("pingDatabase.init"), 6000);
});
