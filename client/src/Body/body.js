import React from 'react';
import { Route } from 'react-router-dom';

import AuthRoute from '../authentication/AuthRoute';
import ClassHome from './ClassHome/class-home';
import Home from '../Home/home';
import Login from '../authentication/Login';
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
    <AuthRoute
      Component={() => <ClassHome assignments={assignments334} />}
      exact
      path="/"
    />
    <Route path="/login" component={Login} />
    <Route path="*" component={null} />
  </div>
);

export default Body;