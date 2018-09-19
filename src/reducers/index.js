import { combineReducers } from 'redux';
import ajaxCallsInProgress from './ajaxStatusReducer';
import user from './userReducer';
import exposedItems from './exposedItemReducer';
import startedExposedItem from './startedExposedItemReducer';
import taskSearchState from './taskSearchStateReducer';
import processInstanceSearchState from './processInstanceSearchStateReducer';
import pickedProcessInstance from './pickedProcessInstanceReducer';
import { routerReducer } from 'react-router-redux';
import * as types from '../actions/actionTypes';
import { loadingBarReducer } from 'react-redux-loading-bar';

const appReducer = combineReducers({
  ajaxCallsInProgress,
  user,
  exposedItems,
  startedExposedItem,
  taskSearchState,
  processInstanceSearchState,
  pickedProcessInstance,
  routing: routerReducer,
  loadingBar: loadingBarReducer
});

const rootReducer = (state, action) => {
  if (action.type == types.LOGOUT) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
