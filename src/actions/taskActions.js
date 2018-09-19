import * as types from './actionTypes';
import taskApi from '../api/taskApi';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';

function searchSuccess(taskSearchState) {
  return {
    type: types.SEARCH_TASKS_SUCCESS,
    taskSearchState
  };
}

export function search(user, searchCriteria) {

  return function (dispatch) {

    let params = {
      searchFilter: searchCriteria.searchFilter,
      size: searchCriteria.limit
    };

    // Override default params values when searching for completed tasks
    if (searchCriteria.completionStateFilter === 'Completed') {
      params.sortAttributes = ['COMPLETED DESC'];
      params.interactionFilter = 'CHECK_COMPLETED';
      params.selectedAttributes = ['TAD_DISPLAY_NAME', 'PI_DISPLAY_NAME', 'COMPLETED', 'NAME', 'PI_PIID', 'PI_NAME', 'OWNER', 'STATE', 'TKIID', 'PRIORITY'];
    }

    dispatch(beginAjaxCall());
    return taskApi.search(user, params).then(body => {
      let items = [];
      let total = 0;
      if (body.items) {
        items = body.items;
        total = body.totalCount;
      }
      dispatch(searchSuccess({ searchCriteria, results: { items, total } }));
    }).catch(error => {
      dispatch(ajaxCallError(error));
      throw (error);
    });
  };
}

export function resetTaskSearch() {
  return {
    type: types.RESET_TASK_SEARCH
  };
}
