import React from "react";
import {withTracker} from "meteor/react-meteor-data";
import DocumentTitle from "react-document-title";
import {Meteor} from "meteor/meteor";

import {gameLogic} from "../../api/gameLogic";

import StudentHeader from "./StudentHeader";
import StudentContent from "./StudentContent";
import newScream from "./newScream";
import newBrim from "./newBrim";


class Student extends React.Component {
	componentDidMount() {
		this.update()
	}
	
	componentDidUpdate() {
		this.update()
	}
	
	update() {
		let scream,
			brim;
		
		if (navigator.userAgent.match(/(iPhone|iPod)/i) && !window.navigator.standalone) {
			scream = newScream({
				width: {
					portrait: 320,
					landscape: 568
				}
			});
			
			brim = newBrim({
				viewport: scream
			});
			
			brim.on('viewchange', function (e) {
				document.body.className = e.viewName;
			});
		}
	}
	
	render() {
		return (
			<DocumentTitle title='Jeopardy'>
				<div>
					<div id="brim-mask"
					     style={{color: "#fff", pointerEvents: "none", display: "none", background: "#663399"}}>
						<h1 style={{
							fontWeight: 300,
							margin: '1em 0',
							padding: '0 0 0.25em 0',
							borderBottom: '1px dotted #ccc',
							textAlign: 'center',
							fontSize: '3em',
							lineHeight: '1.1em',
							display: "block"
						}}>Scroll up to enter Fullscreen</h1>
					</div>
					<div id="brim-main" style={{color: "#fff"}}>
						{this.props.isReady ?
							<div className="flex-container Main" style={{flexDirection: "column"}}>
								<StudentHeader gameLogic={this.props.gameLogic[0]}/>
								<StudentContent gameLogic={this.props.gameLogic[0]}/>
							</div> : <div/>
						}
					</div>
					{navigator.userAgent.match(/(iPhone|iPod)/i) && !window.navigator.standalone ?
						<div id="brim-treadmill" style={{height: 10000000000000000}}/> : []}
				</div>
			</DocumentTitle>
		)
	}
}


export default withTracker(() => {
	const handle1 = Meteor.subscribe('gameLogic');
	
	return {
		isReady: handle1.ready(),
		connectionId: Meteor.connection._lastSessionId,
		gameLogic: gameLogic.find().fetch(),
	};
})(Student);