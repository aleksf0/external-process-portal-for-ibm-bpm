import * as types from './actionTypes';
import environmentApi from '../api/environmentApi';
import {beginAjaxCall, ajaxCallError} from './ajaxStatusActions';

function loginSuccess(user) {
  return {
    type: types.LOGIN_SUCCESS,
    user
  };
}

export function login(user) {
  return function (dispatch) {
    dispatch(beginAjaxCall());
    return environmentApi.retrieveSystemDetails(user).then(() => {
      dispatch(loginSuccess(user));
    }).catch(error => {
      dispatch(ajaxCallError(error));
      throw(error);
    });
  };
}

export function logout() {
  return { type: types.LOGOUT };
}
