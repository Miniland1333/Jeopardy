import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import FastClick from "./fastclick"

import App from '../imports/simple-todos/ui/App.js';
import PageNotFound from '../imports/ui/PageNotFound';
import Viewer from '../imports/ui/Viewer';
import Editor from '../imports/ui/Editor/Editor';
import Teacher from '../imports/ui/Teacher';
import Student from '../imports/ui/Student';


var renderRoutes = () => (
    <Router history={browserHistory}>
        <Route path="/" component={App}/>
        
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
if (window.navigator.standalone) {
    window.addEventListener('load', function() {
        new FastClick(document.body);
    }, false);
}


