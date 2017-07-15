import React from 'react';
import ReactRouter, { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Main from '../components/Main';
import Home from '../components/Home';
import Tutorial from '../components/Tutorial';

const routes = (
  <Router>
    <Main>
      <Switch>
        <Route path='/tutorial' component={Tutorial}/>
        <Route path='/:roomID?' component={Home}/>
      </Switch>
    </Main>
  </Router>
);

export default routes;
