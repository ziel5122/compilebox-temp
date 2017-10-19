import jwt from 'jsonwebtoken';
import { combineReducers } from 'redux';

const admin = (state = false, action) => {
  switch (action.type) {
    case 'SET_ADMIN':
      return action.admin;
    default:
      return state;
  }
};

const loggedIn = (state = false, action) => {
  switch (action.type) {
    case 'SET_LOGGED_IN':
      console.log(action);
      const li = action.loggedIn;
      console.log(li);
      return li;
      // return action.loggedIn
    default:
      return state;
  }
};

const loginErrorText = (state = '', action) => {
  switch (action.type) {
    case 'SET_ERROR_TEXT':
      return action.errorText;
    default:
      return state;
  }
};

const password = (state = '', action) => {
  switch (action.type) {
    case 'SET_PASSWORD':
      return action.password;
    default:
      return state;
  }
};

const username = (state = '', action) => {
  switch (action.type) {
    case 'SET_USERNAME':
      return action.username;
    default:
      return state;
  }
};

export default combineReducers({
  admin,
  loggedIn,
  loginErrorText,
  username,
  password,
});