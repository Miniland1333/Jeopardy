import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import App from '../imports/ui/App.js';
import PageNotFound from '../imports/ui/PageNotFound'

var renderRoutes = () => (
    <Router history={browserHistory}>
      <Route path="/" component={App}/>
      <Route path="/*" component={PageNotFound}/>
    </Router>
);

Meteor.startup(() => {
  render(renderRoutes(), document.getElementById('render-target'));
});