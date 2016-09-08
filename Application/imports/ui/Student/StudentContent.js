import React, {Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';
import './../paper-full';

var buttonStyle={
	backgroundColor:"#555555",
	fontSize:"24px",
	margin:"5px",
	height:"30px",
	width:"100px",
	display:"inline-block",
	borderRadius: 8,
};
var confirmStyle={
	backgroundColor:"#007d0a",
	fontSize:"26px",
	margin:"5px",
	height:"50px",
	display:"block",
	borderRadius: 8,
};
var teamNumber;

var StudentContent = React.createClass({
	propTypes:{
		gameLogic:React.PropTypes.object,
	},
	handleFirst:function () {
		Meteor.call("gameLogic.setFirst",teamNumber);
		Meteor.call("gameLogic.setState","answer");
	},
	handleLate:function () {
		Meteor.call('gameLogic.addLate',teamNumber);
	},
	render:function () {
		
		var wager;
		var max;
		var points;
		
		teamNumber = this.props.gameLogic["connections"][Meteor.connection._lastSessionId];
		if(teamNumber==undefined) {
			
			return (<div className="flex-container" style={{flexDirection: "column"}}>
					<h1>Tap a box to register!</h1>
					<p>{Meteor.connection._lastSessionId}</p>
				</div>
			);
		}else if(this.props.gameLogic["state"]=="wager"&&this.props.gameLogic["lastWinner"]==teamNumber){
			points = this.props.gameLogic["player" + teamNumber]["points"];
			max = Math.max(this.props.gameLogic["round"] == 1 ? 1000 : 2000, points);
			
			
			wager = Math.max(5, Math.min(this.props.gameLogic["player" + teamNumber]["wager"], max));
			Meteor.call('gameLogic.setWager',teamNumber,wager);
			return <div className="flex-container" style={{flexDirection:"column",flex:1}}>
				<div style={{flex:1}}></div>
				<div>
					<div style={buttonStyle} onClick={()=>Meteor.call('gameLogic.setWager',teamNumber,wager+=10000)}>+10,000</div>
					<div style={buttonStyle} onClick={()=>Meteor.call('gameLogic.setWager',teamNumber,wager+=1000)}>+1,000</div>
					<div style={buttonStyle} onClick={()=>Meteor.call('gameLogic.setWager',teamNumber,wager+=100)}>+100</div>
					<div style={buttonStyle} onClick={()=>Meteor.call('gameLogic.setWager',teamNumber,wager+=10)}>+10</div>
					<div style={buttonStyle} onClick={()=>Meteor.call('gameLogic.setWager',teamNumber,wager+=1)}>+1</div>
				</div>
				<div style={{fontFamily: "D7",
					fontSize: "4vw",
					padding: "10px",
					border: "4px solid #f1f1f1",
					borderRadius: 20,
				}}>
					Wager: {wager}
				</div>
				<div>
					<div style={buttonStyle} onClick={()=>Meteor.call('gameLogic.setWager',teamNumber,wager-=10000)}>-10,000</div>
					<div style={buttonStyle} onClick={()=>Meteor.call('gameLogic.setWager',teamNumber,wager-=1000)}>-1,000</div>
					<div style={buttonStyle} onClick={()=>Meteor.call('gameLogic.setWager',teamNumber,wager-=100)}>-100</div>
					<div style={buttonStyle} onClick={()=>Meteor.call('gameLogic.setWager',teamNumber,wager-=10)}>-10</div>
					<div style={buttonStyle} onClick={()=>Meteor.call('gameLogic.setWager',teamNumber,wager-=1)}>-1</div>
				</div>
				<div style={{fontSize:15}}>You can wager between $5 and ${max}</div>
				<div style={{flex:1}}></div>
				<div style={confirmStyle} onClick={()=>Meteor.call('gameLogic.setState','DDread')}>Confirm Wager</div>
			</div>;
			
		}else if(this.props.gameLogic["state"]=="read"){
			return <div className="flex-container" style={{flexDirection:"column",flex:1}}>
				<div  style={{background:"#f6f6f6",borderRadius:"8px",margin:"30px",flex:1}}/>
			</div>;
		}else if(this.props.gameLogic["state"]=="open"){
			var incorrect = this.props.gameLogic["currentQuestionLogic"]["Incorrect"];
			if(!incorrect.includes(teamNumber)){
				//If not on incorrect list
				return <div className="flex-container" style={{flexDirection:"column",flex:1}}>
					<div onClick={this.handleFirst} style={{background:"#f6f6f6",borderRadius:"8px",margin:"30px",flex:1}}/>
				</div>;
			}else{
				return <div className="flex-container" style={{flexDirection:"column",flex:1}}>
					<div  style={{background:"#ff3f3f",borderRadius:"8px",margin:"30px",flex:1}}/>
				</div>;
			}

			
		}else if(this.props.gameLogic["state"]=="answer"){
			if(this.props.gameLogic["currentQuestionLogic"]["first"]==teamNumber){
				return <div className="flex-container" style={{flexDirection:"column",flex:1}}>
					<div  style={{background:"#00b500",borderRadius:"8px",margin:"30px",flex:1}}/>
				</div>;
			}else if(this.props.gameLogic["currentQuestionLogic"]["RungInLate"].includes(teamNumber)){
				return <div className="flex-container" style={{flexDirection:"column",flex:1}}>
					<div  style={{background:"#ff3f3f",borderRadius:"8px",margin:"30px",flex:1}}/>
				</div>;
			}else{
				return <div className="flex-container" style={{flexDirection:"column",flex:1}}>
					<div onClick={this.handleLate} style={{background:"#f6f6f6",borderRadius:"8px",margin:"30px",flex:1}}/>
				</div>;
			}
			
		}else if (this.props.gameLogic["player" + teamNumber]["status"] == "active") {
			switch (this.props.gameLogic["state"]) {
				case "FJwager":
					if (!this.props.gameLogic["currentQuestionLogic"]["RungInLate"].includes(teamNumber)) {
						points = this.props.gameLogic["player" + teamNumber]["points"];
						
						wager = Math.max(0, Math.min(this.props.gameLogic["player" + teamNumber]["wager"], points));
						Meteor.call('gameLogic.setWager', teamNumber, wager);
						return <div className="flex-container" style={{flexDirection: "column", flex: 1}}>
							<div style={{flex: 1}}></div>
							<div>
								<div style={buttonStyle} onClick={()=>Meteor.call('gameLogic.setWager', teamNumber, wager += 10000)}>+10,000</div>
								<div style={buttonStyle} onClick={()=>Meteor.call('gameLogic.setWager', teamNumber, wager += 1000)}>+1,000</div>
								<div style={buttonStyle} onClick={()=>Meteor.call('gameLogic.setWager', teamNumber, wager += 100)}>+100</div>
								<div style={buttonStyle} onClick={()=>Meteor.call('gameLogic.setWager', teamNumber, wager += 10)}>+10</div>
								<div style={buttonStyle} onClick={()=>Meteor.call('gameLogic.setWager', teamNumber, wager += 1)}>+1</div>
							</div>
							<div style={{
								fontFamily: "D7",
								fontSize: "4vw",
								padding: "10px",
								border: "4px solid #f1f1f1",
								borderRadius: 20,
							}}>
								Wager: {wager}
							</div>
							<div>
								<div style={buttonStyle} onClick={()=>Meteor.call('gameLogic.setWager', teamNumber, wager -= 10000)}>-10,000</div>
								<div style={buttonStyle} onClick={()=>Meteor.call('gameLogic.setWager', teamNumber, wager -= 1000)}>-1,000</div>
								<div style={buttonStyle} onClick={()=>Meteor.call('gameLogic.setWager', teamNumber, wager -= 100)}>-100</div>
								<div style={buttonStyle} onClick={()=>Meteor.call('gameLogic.setWager', teamNumber, wager -= 10)}>-10</div>
								<div style={buttonStyle} onClick={()=>Meteor.call('gameLogic.setWager', teamNumber, wager -= 1)}>-1</div>
							</div>
							<div style={{fontSize: 15}}>You can wager between $0 and ${points}</div>
							<div style={{flex: 1}}></div>
							<div style={confirmStyle} onClick={()=>Meteor.call('gameLogic.addLate', teamNumber)}>Confirm
								Wager
							</div>
						</div>;
					} else {
						return null;
					}
				case "FJopen":
				case "FJanswer":
					paper.setup("writingPad");
					
					var path;
					var tool = new Tool();
					var textItem = new PointText({
						content: 'Write your answer',
						point: new Point(20, 30),
						fillColor: 'black',
					});
				
				tool.onMouseDown = function (event) {
					
					// Create a new path and set its stroke color to black:
					path = new Path({
						segments: [event.point],
						strokeColor: 'white',
						// Select the path, so we can see its segment points:
						fullySelected: true
					});
				};

				tool.onMouseDrag=function(event) {
					path.add(event.point);
				};

				tool.onMouseUp=function(event) {
					var segmentCount = path.segments.length;
					
					// When the mouse is released, simplify it:
					path.simplify(10);
				};
					return <canvas style={{border:"2px solid white",height:"50vmin",width:"50vmin"}} id="writingPad">
						
					</canvas>;
				default:
					return null;
				
			}
		} else {
			return null;
		}
	}
});


module.exports = StudentContent;