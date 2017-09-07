import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const AuthRoute = ({ Component, loggedIn, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      loggedIn ? <Component {...props} /> : <Redirect to="/login" />
    )}
  />
);

export default AuthRoute;
