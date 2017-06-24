import React from 'react';
import ReactRouter, { BrowserRouter as Router, Route} from 'react-router-dom';
import Home from '../components/Home';

const routes = (
  <Router>
    <div>
      <Route exact path='/' component={Home}>
      </Route>
    </div>
  </Router>
);

export default routes;
