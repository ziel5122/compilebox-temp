import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const LockedRoute = ({ Component, lockProp, to, ...rest }) => (
  <Route
    render={props => (
      lockProp ? <Component {...props} /> : <Redirect to={to} />
    )}
    {...rest}
  />
);

export default LockedRoute;