import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import { ServerTime } from 'meteor/socialize:server-time';

export const pingDatabase = new Mongo.Collection('pingDatabase');

if (Meteor.isServer) {
	// This code only runs on the server
	Meteor.publish('pingDatabase', function pingDatabasePublication() {
		return pingDatabase.find();
	});
}

Meteor.methods({
	'pingDatabase.init'() {
		//removes all existing pings
		pingDatabase.remove({});
	},
	'pingDatabase.updateUser'(connectionId, name, ping) {
		pingDatabase.upsert({connectionId: connectionId}, {
			connectionId: connectionId,
			name: name,
			roundTripTime: ping,
			time: ServerTime.now(),
		});
	},
	'pingDatabase.kick'(connectionId) {
		console.log("Kicking " + connectionId);
		pingDatabase.remove({connectionId: connectionId});
	},
});