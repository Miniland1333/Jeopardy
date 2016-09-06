import React, {Component, PropTypes} from 'react';
import { Meteor } from 'meteor/meteor';


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

var StudentContent = React.createClass({
	propTypes:{
		gameLogic:React.PropTypes.object,
	},
	handleChange:function () {
		
	},
	render:function () {
		var teamNumber = this.props.gameLogic["connections"][Meteor.connection._lastSessionId];
		if(teamNumber==undefined) {
			
			return (<div className="flex-container" style={{flexDirection: "column"}}>
					<h1>Tap a box to register!</h1>
					<p>{Meteor.connection._lastSessionId}</p>
				</div>
			);
		}else if(this.props.gameLogic["state"]=="pickQuestion"&&this.props.gameLogic["lastWinner"]==teamNumber){
			var points = this.props.gameLogic["player"+teamNumber]["points"];
			var max = Math.max(this.props.gameLogic["round"]==1?1000:2000,points);
			
			
			var wager=Math.max(5, Math.min(this.props.gameLogic["player"+teamNumber]["wager"], max));
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
				<div style={confirmStyle} onClick={()=>Meteor.call('gameLogic.setState','read')}>Confirm Wager</div>
			</div>;
			
		}else{
			return <div className="flex-container" style={{flexDirection:"column",flex:1}}>
				<div  style={{background:"#f6f6f6",borderRadius:"8px",margin:"30px",flex:1}}/>
			</div>;

		}
	}
});


module.exports = StudentContent;