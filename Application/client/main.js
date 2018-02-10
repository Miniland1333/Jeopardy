import React from "react";
import {Meteor} from "meteor/meteor";
import {render} from "react-dom";
import {Route, Router, Switch} from "react-router";
import createBrowserHistory from 'history/createBrowserHistory';
import "jquery";

import attachFastClick from "fastclick";
import "../imports/api/editorDatabase";
import "../imports/api/gameDatabase";
import "../imports/api/gameLogic";
import "../imports/api/gameQuestions";
import "../imports/api/pingDatabase";

const customHistory = createBrowserHistory();

const renderRoutes = () => (
	<Router history={customHistory}>
		<Switch>
			<Route exact path="/" component={Student}/>
			
			<Route path="/Viewer" component={Viewer}/>
			<Route path="/Editor" component={Editor}/>
			<Route path="/Teacher" component={Teacher}/>
			<Route path="/Student" component={Student}/>
			
			<Route path="/viewer" component={Viewer}/>
			<Route path="/editor" component={Editor}/>
			<Route path="/teacher" component={Teacher}/>
			<Route path="/student" component={Student}/>
			
			<Route path="/click" component={ClickDemo}/>
			
			<Route component={PageNotFound}/>
		</Switch>
	</Router>
);

const Viewer = asyncComponent(() =>
	import("../imports/ui/Viewer/Viewer").then(module => module.default));
const Editor = asyncComponent(() =>
	import("../imports/ui/Editor/Editor").then(module => module.default));
const Teacher = asyncComponent(() =>
	import("../imports/ui/Teacher/Teacher").then(module => module.default));
const Student = asyncComponent(() =>
	import("../imports/ui/Student/Student").then(module => module.default));
const PageNotFound = asyncComponent(() =>
	import("../imports/ui/PageNotFound").then(module => module.default));
const ClickDemo = asyncComponent(() =>
	import("../imports/ui/ClickDemo").then(module => module.default));

function asyncComponent(getComponent) {
	return class AsyncComponent extends React.Component {
		static Component = null;
		state = {Component: AsyncComponent.Component};
		
		componentWillMount() {
			if (!this.state.Component) {
				getComponent().then(Component => {
					AsyncComponent.Component = Component;
					this.setState({Component})
				})
			}
		}
		
		render() {
			const {Component} = this.state;
			if (Component) {
				return <Component {...this.props} />
			}
			return null
		}
	}
}

Meteor.startup(() => {
	render(renderRoutes(), document.getElementById('render-target'));
	attachFastClick(document.body);
});
