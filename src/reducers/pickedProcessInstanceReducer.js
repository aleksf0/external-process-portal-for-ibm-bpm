import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function pickedProcessInstanceReducer(state = initialState.pickedProcessInstance, action) {

  switch (action.type) {
    case types.RESET_PROCESS_INSTANCE:
      return Object.assign({}, initialState.pickedProcessInstance);
    case types.STORE_IS_PROCESS_INSTANCE_PRELOADED_FROM_PARENT:
      return Object.assign({}, state, { isPreloadedFromParent: action.isPreloadedFromParent });
    case types.RETRIEVE_PROCESS_INSTANCE_SUMMARY_SUCCESS:
      return Object.assign({}, state, { summary: action.summary });
    case types.RETRIEVE_PROCESS_INSTANCE_BUSINESS_DATA_SUCCESS:
      return Object.assign({}, state, { businessData: action.businessData });
    case types.RETRIEVE_PROCESS_INSTANCE_TASKS_SUCCESS:
      return Object.assign({}, state, { tasks: action.tasks });
    case types.RETRIEVE_PROCESS_INSTANCE_ACTIVITIES_SUCCESS:
      return Object.assign({}, state, { activities: action.activities });
    default:
      return state;
  }

}
