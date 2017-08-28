import Paper from 'material-ui/Paper';
import React from 'react';
import { Route } from 'react-router-dom';

import Menu from '../Menu/menu';

const OSHome = ({ match }) => (
  <div style={{ width: '100%' }}>
    <Paper style={{ display: 'inline-block', height: '100%' }}>
      <Menu match={match} />
    </Paper>
    <Paper>
      <Route path={`${match.url}/20170828`} />
      <Route path={`${match.url}/20170904`} />
      <Route path={`${match.url}/20170911`} />
      <Route path={`${match.url}/20170918`} />
    </Paper>
  </div>
);

export default OSHome;
