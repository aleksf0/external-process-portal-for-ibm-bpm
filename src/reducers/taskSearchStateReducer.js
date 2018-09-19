import * as types from '../actions/actionTypes';
import initialState from './initialState';
import merge from 'deepmerge';

export default function taskSearchStateReducer(state = initialState.taskSearchState, action) {

  switch (action.type) {
    case types.SEARCH_TASKS_SUCCESS:
      action.taskSearchState.results.items = formatTasks(action.taskSearchState.results.items);
      return Object.assign({}, state, action.taskSearchState);
    case types.RESET_TASK_SEARCH:
      return merge(initialState.taskSearchState, { searchCriteria: { searchFilter: state.searchCriteria.searchFilter } });
    default:
      return state;
  }
}

function formatTasks(items) {
  return items.map(item => {
    let formattedItem = {};
    formattedItem.id = item.TKIID;
    formattedItem.subject = item.TAD_DISPLAY_NAME;
    formattedItem.processInstanceId = item.PI_PIID;
    formattedItem.processInstanceName = item.PI_DISPLAY_NAME;
    formattedItem.dueDate = item.DUE;
    formattedItem.priority = item.PRIORITY;
    formattedItem.isAtRisk = item.IS_AT_RISK;
    formattedItem.assignedToUserFullName = null; //TODO: consider inserting currently logged in user name
    formattedItem.assignedToTeamName = item.ASSIGNED_TO_ROLE_DISPLAY_NAME;
    formattedItem.closedDate = item.COMPLETED ? item.COMPLETED : null;
    return formattedItem;
  });
}
