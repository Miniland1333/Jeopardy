import React, {Component, PropTypes} from 'react';




var itemStyle = {
	height:15,
	width:"10vw",
	margin:"1vw",
	padding:0,
	justifyContent:"space-around",
	background:"#ffffff",
	opacity:".38",
	border:"none",
	//#00ff37 green
	//#ffffff38 transparent
};

var CountDown = React.createClass({
	propTypes:{
		isGreen:React.PropTypes.bool,
		visible:React.PropTypes.bool,
	},
	render:function () {
		if (this.props.visible){
			return <div className="flex-container" style={{background:"transparent"}}>
				<div className="five"  style={itemStyle}/>
				<div className="four"  style={itemStyle}/>
				<div className="three" style={itemStyle}/>
				<div className="two"   style={itemStyle}/>
				<div className="one"   style={itemStyle}/>
				<div className="two"   style={itemStyle}/>
				<div className="three" style={itemStyle}/>
				<div className="four"  style={itemStyle}/>
				<div className="five"  style={itemStyle}/>
			</div>
		}else {
			return <div/>
		}
	}
});


module.exports = CountDown;