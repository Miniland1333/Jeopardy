/**
 * Created by Henry on 8/27/2016.
 * Storage for the internal game logic
 */
//Available to Everyone
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';


export const gameLogic = new Mongo.Collection('gameLogic');

if (Meteor.isServer) {
	// This code only runs on the server
	Meteor.publish('gameLogic', function tasksPublication() {
		return gameLogic.find();
	});
}

Meteor.methods({
	'gameLogic.init'(){
		gameLogic.remove({});
		//initializes gameLogic
		var setupBundle={};
		for(var i=1;i<=6;i++){
			setupBundle["player"+i] = {
				teamName:"",
				status:"",
				connectionId:"",
				teamNumber:i,
			}
		}
		var bundle={
			numPlayers:0,
			round:0,
			CurrentQuestionLogic:{open:false,RungInLate:[],Incorrect:[]},
			lastWinner:"",
			state:"",
			setupPlayers:setupBundle,
		};
		/*for(var j=1;j<=6;j++){
			bundle["player"+j] = {
				teamName:"",
				points:0,
				connectionId:"",
				finalPhoto:"",
				status:"",
				wager:0,
				teamNumber:j,
			}
		}*/
		//Finalized at start
		gameLogic.insert(bundle);
	},
	'gameLogic.setupPlayers'(){
		//Turns setupPlayer into players
		
		gameLogic.update({},{$unset:{setupPlayers:""}});
	},
	'gameLogic.setTeamName'(teamNumber,teamName){
		
		var bundle={};
		bundle["setupPlayers.player"+teamNumber+".teamName"]=teamName;
		gameLogic.update({},{$set:bundle});
	},
	'gameLogic.kick'(teamNumber,connectionId){
		//resets a setupPlayer{player} or sets player to reconnect
		var round = gameLogic.find().fetch()[0]["round"];
		if(teamNumber==0){
			//Use connectionId to find team number
			if(round==0){
				
			}else{
				
			}
		}
		
		//Will skip if not connected to a team
		if(teamNumber!=0) {
			var bundle = {};
			if (round == 0) {
				console.log("Kicked player" + teamNumber + " (" + connectionId + ")");
				bundle["setupPlayers.player" + teamNumber] = {
					teamName: "",
					status: "",
					connectionId: "",
					teamNumber: teamNumber,
				};
				gameLogic.update({}, {$set: bundle});
			} else {
				console.log("Kicked player" + teamNumber + " (" + connectionId + ")");
				bundle["player" + teamNumber] = {
					teamName: "",
					points: 0,
					connectionId: "",
					finalPhoto: "",
					status: "",
					wager: 0,
					teamNumber: teamNumber,
				};
				gameLogic.update({}, {$set: bundle});
			}
		}
	},
	'gameLogic.setStatus'(teamNumber,teamStatus,round){
		var bundle = {};
		if (round == 0) {
			bundle["setupPlayers.player"+teamNumber+".status"]=teamStatus;
			gameLogic.update({}, {$set: bundle});
			
		}else{
			bundle["player" + teamNumber+".status"]=teamStatus;
			gameLogic.update({}, {$set: bundle});
			
		}
	},
	'gameLogic.changePoints'(teamNumber,pointDiff){
		
	},
	"gameLogic.setConnectionId"(teamNumber,connectionId){
		var bundle = {};
		bundle["setupPlayers.player"+teamNumber+".connectionId"]=connectionId;
		gameLogic.update({}, {$set: bundle});
	},
});