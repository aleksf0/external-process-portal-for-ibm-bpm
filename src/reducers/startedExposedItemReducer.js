import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function startedExposedItemReducer(state = initialState.startedExposedItem, action) {

  switch (action.type) {
    case types.START_EXPOSED_ITEM_SUCCESS:
      return Object.assign({}, state, action.startedExposedItem);
    default:
      return state;
  }

}
