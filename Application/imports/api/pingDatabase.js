import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";

export const pingDatabase = new Mongo.Collection('pingDatabase');

if (Meteor.isServer) {
	// This code only runs on the server
	Meteor.publish('pingDatabase', function pingDatabasePublication() {
		return pingDatabase.find();
	});
}

Meteor.methods({
	'pingDatabase.init'(){
		//removes all existing pings
		pingDatabase.remove({});
	},
	'pingDatabase.updateUser'(connectionId, name, ping){
		const bundle = {};
		bundle[connectionId] = {
			connectionId: connectionId,
			name: name,
			roundTripTime: ping,
		};
		pingDatabase.upsert({}, {$set: bundle});
	},
	'pingDatabase.kick'(connectionId){
		pingDatabase.remove({connectionId});
	},
});