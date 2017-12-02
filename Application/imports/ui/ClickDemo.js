import React from "react";
import "fastclick";

export default class ClickDemo extends React.Component {
	render()
	{
		return (
			<div id="clickarea" className="clickarea" style={{
				"display": "block",
				"position": "absolute",
				"left": "50%",
				"top": "50%",
				"textAlign": "center",
				"border": "6px solid green",
				"width": "250px",
				"marginLeft": "-125px",
				"marginTop": "-100px",
				"fontSize": "36px",
				"backgroundColor": "rgba(0, 255, 0, .1)",
				"borderRadius": "16px",
				"boxShadow": "0 0 24px rgba(0, 0, 0, .5)",
				"textShadow": "0 1px 0 rgba(255, 255, 255, 1)",
				"padding": "15px"
			}}>
				Tap Here!
				
				<div className="clickresults"
				     style={{"color": "#888", "display": "inline-block", "fontSize": "16px", "textAlign": "left"}}>
					<div id="clickresultfast" className="clickresult"
					     style={{"display": "block", "fontSize": "16px", "textAlign": "center"}}/>
					<div id="clickresultslow" className="clickresult"
					     style={{"display": "block", "fontSize": "16px", "textAlign": "center"}}/>
				</div>
			</div>);
	}
	componentDidMount() {
		"use strict";
		
		const clickarea = document.getElementById('clickarea');
		const clickresultfast = document.getElementById('clickresultfast');
		const clickresultslow = document.getElementById('clickresultslow');

// Register 'fast' click listener.
		clickarea.addEventListener('fastclick', function (e) {
			if (e.detail == clickarea) {
				const currentTime = new Date().getMilliseconds();
				clickresultfast.innerText = 'Fast Click: ' + (currentTime - touchStartTime) + 'ms';
			}
			
		}, false);

// Register 'normal' click listener.
		clickarea.addEventListener('click', function (e) {
			if (e.target == clickarea) {
				const currentTime = new Date().getMilliseconds();
				clickresultslow.innerText = 'Normal Click: ' + (currentTime - touchStartTime) + 'ms';
			}
			
		}, false);


// Record time it takes to detect 'click'.
		var touchStartTime = false;
		document.addEventListener('touchstart', function(){
			touchStartTime = new Date().getMilliseconds();
		}, false);
		
		
		(function () {
			
			// Create custom "Fast click" event.
			let touchClick = false;
			document.addEventListener("touchstart", function () {
				touchClick = true
			}, false);
			document.addEventListener("touchmove", function () {
				touchClick = false
			}, false);
			document.addEventListener("touchend", function (e) {
				
				if (touchClick) {
					
					// Send fast click.
					const event = document.createEvent("CustomEvent");
					event.initCustomEvent("fastclick", true, true, e.target);
					
					e.target.dispatchEvent(event);
					touchClick = false;
				}
			}, false);
			
		}());
		
	}
	
	}





