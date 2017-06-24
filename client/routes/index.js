import React from 'react';
import ReactRouter, { BrowserRouter as Router, Route} from 'react-router-dom';
import Main from '../components/Main';
import Home from '../components/Home';

const routes = (
  <Router>
    <Main>
      <Route path='/:roomID?' component={Home}>
      </Route>
    </Main>
  </Router>
);

export default routes;
