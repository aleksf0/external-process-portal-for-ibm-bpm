import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function userReducer(state = initialState.user, action) {

  switch (action.type) {
    case types.LOGIN_SUCCESS:
      return Object.assign({}, state, {
        username: action.user.username,
        password: action.user.password,
        isAuthenticated: true
      });
    default:
      return state;
  }
}
