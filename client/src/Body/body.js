import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';

import AuthRoute from '../AuthRoute';
import ClassHome from '../ClassHome/class-home';
import Home from '../Home/home';
import Login from '../Login';
import styles from './styles';

const assignments334 = [
  {
    dueDate: {
      day: '28',
      month: '08',
      year: '2017',
    },
  },
  {
    dueDate: {
      day: '04',
      month: '09',
      year: '2017',
    },
  },
  {
    dueDate: {
      day: '11',
      month: '09',
      year: '2017',
    },
  },
];

const Body = () => (
  <div style={styles.body}>
    <Route path="/login" component={Login} />
    <Route
      path="/cst334"
      component={({ match }) => (
        <ClassHome assignments={assignments334} match={match} />
      )}
    />
  </div>
);

export default Body;
