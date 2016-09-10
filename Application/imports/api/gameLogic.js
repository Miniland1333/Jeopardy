/**
 * Created by Henry on 8/27/2016.
 * Storage for the internal game logic
 */
//Available to Everyone
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';


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
			CurrentQuestionLogic:{open:false,first:0,RungInLate:[],Incorrect:[]},
			lastWinner:"",
			state:"",
			setupPlayers:setupBundle,
			connections:{},
			gameName:"Please select a game",
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
		var setupPlayers = gameLogic.find().fetch()[0]["setupPlayers"];
		Meteor.call('gameLogic.resetConnections');
		var numPlayers=0;
		for(var i=1;i<=6;i++){
			var player = setupPlayers["player"+i];
			if(player["status"]=="ready"){
				var bundle={};
				numPlayers++;
				bundle["player"+numPlayers]={
					teamName:player["teamName"],
					points:0,
					connectionId:player["connectionId"],
					finalPhoto:"",
					status:"active",
					wager:0,
					teamNumber:numPlayers,
				};
				Meteor.call('gameLogic.setConnectionId',numPlayers,1,player["connectionId"]);
				gameLogic.update({},{$set:bundle});
			}
		}
		gameLogic.update({},{$unset:{setupPlayers:""}});
		gameLogic.update({},{$set:{numPlayers:numPlayers}});
	},
	'gameLogic.setTeamName'(teamNumber,teamName){
		
		var bundle={};
		bundle["setupPlayers.player"+teamNumber+".teamName"]=teamName;
		gameLogic.update({},{$set:bundle});
	},
	'gameLogic.setGame'(name){
		gameLogic.update({},{$set:{gameName:name}});
	},
	'gameLogic.resetConnections'(){
		gameLogic.update({},{$set:{connections:{}}});
	},
	'gameLogic.kick'(teamNumber,connectionId){
		//resets a setupPlayer{player} or sets player to reconnect
		var round = gameLogic.find().fetch()[0]["round"];
		if(teamNumber==0){
			//Use connectionId to find team number
			teamNumber = gameLogic.find().fetch()[0]["connections"][connectionId];
			if(teamNumber==undefined){
				teamNumber=0;
			}
		}
		
		//Will skip if not connected to a team
		if(teamNumber!=0) {
			var bundle = {};
			Meteor.call('gameLogic.setConnectionId',teamNumber,round,"",connectionId);
			if (round == 0) {
				console.log("Kicked player" + teamNumber + " (" + connectionId + ")");
				bundle["setupPlayers.player" + teamNumber] = {
					teamName: "",
					status: "",
					connectionId: "",
					teamNumber: teamNumber,
				};
				gameLogic.update({}, {$set: bundle});
			} else if(gameLogic.find().fetch()[0]["player" + teamNumber]["status"]=="active"){
				console.log("Player" + teamNumber + "disabled (" + connectionId + ")");
				bundle["player" + teamNumber+".connectionId"] = "";
				bundle["player"+ teamNumber+".status"]="reconnect";
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
		var originalPoints = gameLogic.find().fetch()[0]["player"+teamNumber]["points"];
		var newPoints = originalPoints+pointDiff;
		
		var bundle = {};
		bundle["player"+teamNumber+".points"]=newPoints;
		gameLogic.update({},{$set:bundle});
	},
	'gameLogic.setConnectionId'(teamNumber,round,connectionId,formerId){
		var bundle = {};
		if(round==0) {
			bundle["setupPlayers.player" + teamNumber + ".connectionId"] = connectionId;
		}else{
			bundle["player" + teamNumber + ".connectionId"] = connectionId;
		}
		gameLogic.update({}, {$set: bundle});
		if(formerId){
			var temp = {};
			temp["connections."+formerId]="";
			gameLogic.update({},{$unset:temp});
		}else{
			var bundle2 = {};
			bundle2["connections."+connectionId] = teamNumber;
			gameLogic.update({}, {$set: bundle2}, {upsert: true});
		}
	},
	'gameLogic.advance'(){
		var round = gameLogic.find().fetch()[0]['round']+1;
		Meteor.call('gameLogic.setRound',round);
		Meteor.call('gameLogic.setState','intro');
		Meteor.call('gameQuestions.loadRound',round);
		
		switch (round) {
			case 1:
				Meteor.call('gameLogic.lastWinner',Math.floor((Math.random() * gameLogic.find().fetch()[0]['numPlayers']) + 1));
				break;
			case 2:
				//Least
				var least=0;
				var lowestAmount=999999999;
				for(var h=1;h<=gameLogic.find().fetch()[0]['numPlayers'];h++){
					var playerAmount = gameLogic.find().fetch()[0]['player'+h]['points'];
					if(playerAmount<lowestAmount){
						least = h;
						lowestAmount = playerAmount;
					}
				}
				Meteor.call('gameLogic.lastWinner',least);
				break;
			case 3:
				Meteor.call('gameLogic.eliminate');
				break;
		}
	},
	'gameLogic.setState'(state){
		gameLogic.update({},{$set:{state:state}});
	},
	'gameLogic.setRound'(roundNumber){
		gameLogic.update({},{$set:{round:roundNumber}});
		Meteor.call('gameLogic.setState','intro');
	},
	'gameLogic.lastWinner'(number){
		gameLogic.update({},{$set:{lastWinner:number}});
	},
	'gameLogic.resetCurrentQuestionLogic'(){
		var bundle = {};
		bundle["currentQuestionLogic"]={open:false,first:0,RungInLate:[],Incorrect:[]};
		gameLogic.update({},{$set:bundle});
	},
	'gameLogic.setWager'(teamNumber,wager){
		var bundle = {};
		bundle["player"+teamNumber+".wager"]=wager;
		gameLogic.update({},{$set:bundle});
	},
	'gameLogic.setFirst'(teamNumber){
		gameLogic.update({},{$set:{"currentQuestionLogic.first":teamNumber}});
	},
	'gameLogic.addLate'(teamNumber){
		gameLogic.update({},{$push:{"currentQuestionLogic.RungInLate":teamNumber}});
	},
	'gameLogic.addIncorrect'(teamNumber){
		gameLogic.update({},{$push:{"currentQuestionLogic.Incorrect":teamNumber}});
		Meteor.call('gameLogic.reopen');
	},
	'gameLogic.reopen'(){
		gameLogic.update({},{$set:{"currentQuestionLogic.RungInLate":[]}});
	},
	'gameLogic.eliminate'(){
		var obj = gameLogic.find().fetch()[0];
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)
				&& prop.includes("player")
				&& obj[prop]["points"] <= 0) {
				
				var bundle = {};
				
				bundle[prop + ".status"] = "out";
				gameLogic.update({}, {$set: bundle});
			}
		}
	},
	'gameLogic.finalAnswer'(teamNumber,JSON){
		var bundle = {};
		bundle["player"+teamNumber+".wager"]=JSON;
		gameLogic.update({},{$set:bundle});
	},
});