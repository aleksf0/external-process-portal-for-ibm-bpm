import * as types from './actionTypes';
import processInstanceApi from '../api/processInstanceApi';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';

function searchSuccess(processInstanceSearchState) {
  return {
    type: types.SEARCH_PROCESS_INSTANCES_SUCCESS,
    processInstanceSearchState
  };
}

export function search(user, searchCriteria) {

  return function (dispatch) {

    let options = {
      params: {
        searchFilter: searchCriteria.searchFilter,
        maxResults: searchCriteria.limit,
        stateFilter: searchCriteria.completionStateFilter
      }
    };
    dispatch(beginAjaxCall());
    return processInstanceApi.search(user, options).then(body => {
      let items = [];
      let total = 0;
      if (body.data && body.data.data && body.data.data.instanceListData && body.data.data.instanceListData.instances
        && body.data.data.instanceListData.instances.items) {
        items = body.data.data.instanceListData.instances.items;
        total = body.data.data.instanceListData.total;
      }
      dispatch(searchSuccess({ searchCriteria, results: { items, total } }));
    }).catch(error => {
      dispatch(ajaxCallError(error));
      throw (error);
    });
  };
}

export function resetProcessInstanceSearch() {
  return {
    type: types.RESET_PROCESS_INSTANCE_SEARCH
  };
}
