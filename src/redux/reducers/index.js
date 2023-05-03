import { combineReducers } from 'redux';
import auth from './auth';
import games from './games';
import profile from './profile';
import socket from './socket';

const rootReducer = combineReducers({
  auth,
  games,
  profile,
  socket,
});

export default rootReducer;
