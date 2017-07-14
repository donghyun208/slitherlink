import React from 'react';
import ReactRouter, { BrowserRouter as Router, Route} from 'react-router-dom';
import Main from '../components/Main';
import Home from '../components/Home';
import Tutorial from '../components/Tutorial';

const routes = (
  <Router>
    <Main>
      <Route exact path='/tutorial' component={Tutorial}/>
      <Route exact path='/:roomID?' component={Home}/>
    </Main>
  </Router>
);

export default routes;
