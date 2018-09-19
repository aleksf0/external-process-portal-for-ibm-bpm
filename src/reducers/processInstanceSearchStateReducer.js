import * as types from '../actions/actionTypes';
import initialState from './initialState';
import merge from 'deepmerge';

export default function processInstanceSearchStateReducer(state = initialState.processInstanceSearchState, action) {

  switch (action.type) {
    case types.SEARCH_PROCESS_INSTANCES_SUCCESS:
      return Object.assign({}, state, action.processInstanceSearchState);
    case types.RESET_PROCESS_INSTANCE_SEARCH:
      return merge(initialState.processInstanceSearchState, { searchCriteria: { searchFilter: state.searchCriteria.searchFilter } });
    default:
      return state;
  }
}
