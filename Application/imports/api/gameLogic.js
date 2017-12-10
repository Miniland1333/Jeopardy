/**
 * Created by Henry on 8/27/2016.
 * Storage for the internal game logic
 */
//Available to Everyone
import {Meteor} from "meteor/meteor";
import {Mongo} from "meteor/mongo";
import {gameQuestions} from "./gameQuestions";

export const gameLogic = new Mongo.Collection('gameLogic');

if (Meteor.isServer) {
	// This code only runs on the server
	Meteor.publish('gameLogic', function tasksPublication() {
		return gameLogic.find();
	});
}

Meteor.methods({
	'gameLogic.init'() {
		gameLogic.remove({});
		//initializes gameLogic
		const setupBundle = {};
		for (let i = 1; i <= 6; i++) {
			setupBundle["player" + i] = {
				teamName: "",
				status: "",
				connectionId: "",
				teamNumber: i,
			}
		}
		const bundle = {
			numPlayers: 0,
			round: 0,
			currentQuestionLogic: {open: false, first: 0, RungInLate: [], Incorrect: []},
			lastWinner: "",
			state: "",
			setupPlayers: setupBundle,
			connections: {},
			gameName: "Please select a game",
			FJ: {currentPlayer: 0, currentAnswer: "", remaining: "empty"},
			
		};
		gameLogic.insert(bundle);
	},
	'gameLogic.setupPlayers'() {
		//Turns setupPlayer into players
		const setupPlayers = gameLogic.find().fetch()[0]["setupPlayers"];
		Meteor.call('gameLogic.resetConnections');
		let numPlayers = 0;
		for (let i = 1; i <= 6; i++) {
			const player = setupPlayers["player" + i];
			if (player["status"] === "ready") {
				const bundle = {};
				numPlayers++;
				bundle["player" + numPlayers] = {
					teamName: player["teamName"],
					points: 0,
					connectionId: player["connectionId"],
					finalPhoto: "",
					status: "active",
					wager: 0,
					teamNumber: numPlayers,
				};
				Meteor.call('gameLogic.setConnectionId', numPlayers, 1, player["connectionId"]);
				gameLogic.update({}, {$set: bundle});
			}
		}
		gameLogic.update({}, {$set: {numPlayers: numPlayers}});
	},
	'gameLogic.addPlayer'(teamNumber, teamName) {
		const bundle = {};
		bundle["player" + teamNumber] = {
			teamName: teamName,
			points: 0,
			connectionId: "",
			finalPhoto: "",
			status: "reconnect",
			wager: 0,
			teamNumber: teamNumber,
		};
		gameLogic.update({}, {$set: bundle});
		gameLogic.update({}, {$set: {numPlayers: teamNumber}});
		
	},
	'gameLogic.setTeamName'(teamNumber, teamName) {
		
		const bundle = {};
		bundle["setupPlayers.player" + teamNumber + ".teamName"] = teamName;
		gameLogic.update({}, {$set: bundle});
	},
	'gameLogic.setGame'(name) {
		gameLogic.update({}, {$set: {gameName: name}});
	},
	'gameLogic.resetConnections'() {
		gameLogic.update({}, {$set: {connections: {}}});
	},
	'gameLogic.kickAll'() {
		for (let i = 1; i <= gameLogic.find().fetch()[0].numPlayers; i++)
			Meteor.call('gameLogic.kick', i);
	},
	'gameLogic.kick'(teamNumber, connectionId) {
		//resets a setupPlayer{player} or sets player to reconnect
		const round = gameLogic.find().fetch()[0]["round"];
		if (teamNumber === 0) {
			//Use connectionId to find team number
			if (connectionId !== undefined) {
				teamNumber = gameLogic.find().fetch()[0]["connections"][connectionId];
				if (teamNumber === undefined) {
					teamNumber = 0;
				}
			}
		}
		
		//Will skip if not connected to a team
		if (teamNumber !== 0) {
			const bundle = {};
			Meteor.call('gameLogic.setConnectionId', teamNumber, round, "", connectionId);
			if (round === 0) {
				console.log("Kicked player" + teamNumber + " (" + connectionId + ")");
				bundle["setupPlayers.player" + teamNumber] = {
					teamName: "",
					status: "",
					connectionId: "",
					teamNumber: teamNumber,
				};
				gameLogic.update({}, {$set: bundle});
			}
			else if (gameLogic.find().fetch()[0]["player" + teamNumber]["status"] === "active") {
				console.log("Player" + teamNumber + "disabled (" + connectionId + ")");
				bundle["player" + teamNumber + ".connectionId"] = "";
				bundle["player" + teamNumber + ".status"] = "reconnect";
				gameLogic.update({}, {$set: bundle});
			}
		}
	},
	
	'gameLogic.setStatus'(teamNumber, teamStatus, round) {
		const bundle = {};
		if (round === 0) {
			bundle["setupPlayers.player" + teamNumber + ".status"] = teamStatus;
			gameLogic.update({}, {$set: bundle});
			
		}
		else {
			bundle["player" + teamNumber + ".status"] = teamStatus;
			gameLogic.update({}, {$set: bundle});
			
		}
	},
	'gameLogic.changePoints'(teamNumber, pointDiff) {
		const originalPoints = gameLogic.find().fetch()[0]["player" + teamNumber]["points"];
		const newPoints = originalPoints + pointDiff;
		
		const bundle = {};
		bundle["player" + teamNumber + ".points"] = newPoints;
		gameLogic.update({}, {$set: bundle});
	},
	'gameLogic.setConnectionId'(teamNumber, round, connectionId, formerId) {
		const bundle = {};
		if (round === 0) {
			bundle["setupPlayers.player" + teamNumber + ".connectionId"] = connectionId;
		}
		else {
			bundle["player" + teamNumber + ".connectionId"] = connectionId;
		}
		gameLogic.update({}, {$set: bundle});
		if (formerId) {
			const temp = {};
			temp["connections." + formerId] = "";
			gameLogic.update({}, {$unset: temp});
		}
		else if (connectionId) {
			const bundle2 = {};
			bundle2["connections." + connectionId] = teamNumber;
			gameLogic.update({}, {$set: bundle2}, {upsert: true});
		}
	},
	'gameLogic.sortPlayers'(playerArray) {
		const logic = gameLogic.find().fetch()[0];
		
		const bundle = {};
		for (let i = 1; i <= logic.numPlayers; i++) {
			let tempArray = logic["player" + playerArray[i - 1]]; //players are 1 indexed, arrays 0 indexed
			tempArray.teamNumber = i; //needs new teamNumber
			
			Meteor.call('gameLogic.setConnectionId',i,gameLogic.find().fetch()[0]["round"],tempArray.connectionId);
			bundle["player" + i] = tempArray;
		}
		
		gameLogic.update({}, {$set: bundle});
	},
	'gameLogic.advance'() {
		//Check for Round Skipping
		const round = gameLogic.find().fetch()[0]['round'] + 1;
		Meteor.call('gameLogic.setRound', round);
		Meteor.call('gameLogic.setState', 'intro');
		Meteor.call('gameLogic.loadRound');
	},
	'gameLogic.loadRound'() {
		const round = gameLogic.find().fetch()[0]['round'];
		Meteor.call('gameQuestions.loadRound', round);
		if (round === 3) {
			const currentRound = gameQuestions.find().fetch()[0]["FinalJeopardy"];
			const hasCategory = currentRound.category;
			const hasQuestion = currentRound.question;
			Meteor.call('gameLogic.eliminate');
			if (!(hasCategory && hasQuestion)) {
				Meteor.call('gameLogic.setState', "complete");
			}
		}
		else {
			if (gameQuestions.find().fetch()[0]["remainingColumns"] === 0) {
				Meteor.call('gameLogic.advance');
				return;
			}
			
			switch (round) {
				case 1:
					Meteor.call('gameLogic.lastWinner', Math.floor((Math.random() * gameLogic.find().fetch()[0]['numPlayers']) + 1));
					break;
				case 2:
					//Least
					let least = 0;
					let lowestAmount = 999999999;
					for (let h = 1; h <= gameLogic.find().fetch()[0]['numPlayers']; h++) {
						const playerAmount = gameLogic.find().fetch()[0]['player' + h]['points'];
						if (playerAmount < lowestAmount) {
							least = h;
							lowestAmount = playerAmount;
						}
					}
					Meteor.call('gameLogic.lastWinner', least);
					break;
				case 3:
					break;
			}
		}
	},
	'gameLogic.setState'(state) {
		gameLogic.update({}, {$set: {state: state}});
	},
	'gameLogic.setRound'(roundNumber) {
		gameLogic.update({}, {$set: {round: roundNumber}});
		if (roundNumber === 1)
			gameLogic.update({}, {$unset: {setupPlayers: ""}});
		Meteor.call('gameLogic.setState', 'intro');
	},
	'gameLogic.lastWinner'(number) {
		gameLogic.update({}, {$set: {lastWinner: number}});
	},
	'gameLogic.resetCurrentQuestionLogic'() {
		const bundle = {};
		bundle["currentQuestionLogic"] = {open: false, first: 0, RungInLate: [], Incorrect: []};
		gameLogic.update({}, {$set: bundle});
	},
	'gameLogic.setWager'(teamNumber, wager) {
		const bundle = {};
		bundle["player" + teamNumber + ".wager"] = wager;
		gameLogic.update({}, {$set: bundle});
	},
	'gameLogic.handleClick'(teamNumber) {
		const logic = gameLogic.find().fetch()[0];
		if (!(logic["currentQuestionLogic"]["Incorrect"].includes(teamNumber)
				|| logic["currentQuestionLogic"]["RungInLate"].includes(teamNumber))
			&& ["open", "answer"].includes(logic.state)) {
			if (!logic["currentQuestionLogic"]["first"]) {
				gameLogic.update({}, {
					$set: {
						"currentQuestionLogic.first": teamNumber,
						"currentQuestionLogic.firstTime": ServerTime.now(),
						state: "answer",
					}
				});
			}
			else {
				gameLogic.update({}, {$push: {"currentQuestionLogic.RungInLate": teamNumber}});
				const bundle = {};
				bundle["player" + teamNumber + ".lateTime"] = ServerTime.now();
				gameLogic.update({}, {$set: bundle});
			}
		}
	},
	'gameLogic.setFirst'(teamNumber) {
		gameLogic.update({}, {
			$set: {
				"currentQuestionLogic.first": teamNumber,
				"currentQuestionLogic.firstTime": ServerTime.now(),
				state: "answer",
			}
		});
	},
	'gameLogic.addLate'(teamNumber) {
		gameLogic.update({}, {$push: {"currentQuestionLogic.RungInLate": teamNumber}});
		const bundle = {};
		bundle["player" + teamNumber + ".lateTime"] = ServerTime.now();
		gameLogic.update({}, {$set: bundle});
	},
	'gameLogic.addIncorrect'(teamNumber) {
		gameLogic.update({}, {$push: {"currentQuestionLogic.Incorrect": teamNumber}});
		Meteor.call('gameLogic.reopen');
	},
	'gameLogic.reopen'() {
		gameLogic.update({}, {$set: {"currentQuestionLogic.RungInLate": [], "currentQuestionLogic.first": undefined}});
	},
	'gameLogic.eliminate'() {
		const obj = gameLogic.find().fetch()[0];
		let remainingNumber = obj["numPlayers"];
		if (remainingNumber > 0) {
			for (let prop in obj) {
				if (obj.hasOwnProperty(prop)
					&& prop.includes("player")
					&& obj[prop]["points"] <= 0) {
					remainingNumber--;
					
					const bundle = {};
					
					bundle[prop + ".status"] = "out";
					gameLogic.update({}, {$set: bundle});
				}
			}
		}
		if (remainingNumber <= 0) {
			Meteor.call('gameLogic.setState', "complete");
		}
	},
	
	'gameLogic.finalAnswer'(teamNumber, JSON) {
		const bundle = {};
		bundle["player" + teamNumber + ".finalPhoto"] = JSON;
		gameLogic.update({}, {$set: bundle});
	},
	'gameLogic.setupFinalAnswer'() {
		const obj = gameLogic.find().fetch()[0];
		const remaining = [];
		for (let prop in obj) {
			if (obj.hasOwnProperty(prop)
				&& prop.includes("player")
				&& obj[prop]["status"] === "active") {
				remaining.push(obj[prop]["teamNumber"]);
			}
		}
		const bundle = {};
		bundle["FJ.remaining"] = remaining;
		gameLogic.update({}, {$set: bundle});
	},
	'gameLogic.getFJNext'() {
		const logic = gameLogic.find().fetch()[0];
		//Least
		let least = 0;
		let lowestAmount = 999999999;
		logic["FJ"]["remaining"].forEach(function (h) {
			const playerAmount = logic['player' + h]['points'];
			if (playerAmount < lowestAmount) {
				least = h;
				lowestAmount = playerAmount;
			}
		});
		if (logic['player' + least]['finalPhoto'] !== "") {
			const bundle = {};
			bundle["FJ.currentPlayer"] = least;
			bundle["FJ.currentAnswer"] = logic['player' + least]['finalPhoto'];
			gameLogic.update({}, {$set: bundle});
		}
	},
	'gameLogic.removeFJ'(teamNumber) {
		const bundle = {
			"FJ.currentPlayer": 0
		};
		gameLogic.update({}, {$set: bundle});
		gameLogic.update({}, {$pull: {"FJ.remaining": teamNumber}});
	},
	
});