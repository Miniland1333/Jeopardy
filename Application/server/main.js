import {Meteor} from "meteor/meteor";
import "../imports/api/gameDatabase";
import "../imports/api/gameQuestions";
import "../imports/api/pingDatabase";
import {editorDatabase} from "../imports/api/editorDatabase";
import {pingDatabase} from "../imports/api/pingDatabase";
import {gameLogic} from "../imports/api/gameLogic";
import { ServerTime } from 'meteor/socialize:server-time';

Meteor.startup(() => {
	// code to run on server at startup

	//Comment out below to prevent initialization

	if (!editorDatabase.find().fetch().length)
		Meteor.call("editorDatabase.init");
	if (!gameLogic.find().fetch().length)
		Meteor.call("gameLogic.init");

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
		const TIMEOUT_SECONDS = 30;
		let pings = pingDatabase.find().fetch();
		for (const ping of pings) {
			if (ServerTime.now() - ping.time > TIMEOUT_SECONDS * 1000) {
				console.log("Timeout " + ping.connectionId);
				Meteor.call('gameLogic.kick', 0, ping.connectionId);
				Meteor.call('pingDatabase.kick', ping.connectionId);
			}
		}

	}, 5000);

	Meteor.setTimeout(() => Meteor.call("pingDatabase.init"), 6000);
});
