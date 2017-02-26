import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import FastClick from "./fastclick"

import App from '../imports/simple-todos/ui/App.jsx';
import PageNotFound from '../imports/ui/PageNotFound';
import Viewer from '../imports/ui/Viewer/Viewer';
import Editor from '../imports/ui/Editor/Editor';
import Teacher from '../imports/ui/Teacher/Teacher';
import Student from '../imports/ui/Student/Student';


const renderRoutes = () => (
    <Router history={browserHistory}>
        <Route path="/" component={Student}/>
        
        <Route path="/Viewer" component={Viewer}/>
        <Route path="/Editor" component={Editor}/>
        <Route path="/Teacher" component={Teacher}/>
        <Route path="/Student" component={Student}/>
        
        <Route path="/viewer" component={Viewer}/>
        <Route path="/editor" component={Editor}/>
        <Route path="/teacher" component={Teacher}/>
        <Route path="/student" component={Student}/>
        
        <Route path="/App" component={App}/>
        <Route path="/app" component={App}/>
        <Route path="/*" component={PageNotFound}/>
    </Router>
);

Meteor.startup(() => {
    render(renderRoutes(), document.getElementById('render-target'));
});
window.addEventListener('load', function() {
	if (window.navigator.standalone) {
		new FastClick(document.body);
	}
}, false);

window.addEventListener("orientationchange", function(event) {
	refresh();
}, false);

$(window).resize(refresh);

function refresh(){
	if (navigator.userAgent.match(/(Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini)/i)) {
		$(".Main").css({
			"height": window.innerHeight,
			"width": window.innerWidth,
		});
		$("body").css({
			"height": window.innerHeight,
			"width": window.innerWidth,
		});
		$("#myModal").css({
			"height": window.innerHeight,
			"width": window.innerWidth,
		});
		$("#optionsModal").css({
			"height": window.innerHeight,
			"width": window.innerWidth,
		});
	}
}