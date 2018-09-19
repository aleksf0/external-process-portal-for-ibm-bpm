import * as types from './actionTypes';
import pickedProcessInstanceApi from '../api/pickedProcessInstanceApi';
import { beginAjaxCall, ajaxCallError } from './ajaxStatusActions';

function retrieveSummarySuccess(summary) {
  return {
    type: types.RETRIEVE_PROCESS_INSTANCE_SUMMARY_SUCCESS,
    summary
  };
}

function retrieveBusinessDataSuccess(businessData) {
  return {
    type: types.RETRIEVE_PROCESS_INSTANCE_BUSINESS_DATA_SUCCESS,
    businessData
  };
}

function retrieveTasksSuccess(tasks) {
  return {
    type: types.RETRIEVE_PROCESS_INSTANCE_TASKS_SUCCESS,
    tasks
  };
}

function retrieveActivitiesSuccess(activities) {
  return {
    type: types.RETRIEVE_PROCESS_INSTANCE_ACTIVITIES_SUCCESS,
    activities
  };
}

export function retrieveSummary(user, processInstanceId) {
  return function (dispatch) {
    dispatch(beginAjaxCall());
    return pickedProcessInstanceApi.retrieveParts(user, { processInstanceId, parts: ['summary'] }).then(body => {
      let summary = {};
      if (body.data) {
        summary = body.data;
      }
      dispatch(retrieveSummarySuccess(summary));
    }).catch(error => {
      dispatch(ajaxCallError(error));
      throw (error);
    });
  };
}

export function retrieveBusinessData(user, processInstanceId) {

  return function (dispatch) {
    dispatch(beginAjaxCall());
    return pickedProcessInstanceApi.retrieveBusinessData(user, { params: { selectedInstanceId: processInstanceId } }).then(body => {
      let businessData = [];
      if (body.data
        && body.data.data
        && body.data.data.businessData
        && body.data.data.businessData.items) {
        businessData = body.data.data.businessData.items;
      }
      dispatch(retrieveBusinessDataSuccess(businessData));
    }).catch(error => {
      dispatch(ajaxCallError(error));
      throw (error);
    });
  };
}

export function retrieveTasks(user, processInstanceId, completionStateFilter) {

  return function (dispatch) {
    dispatch(beginAjaxCall());
    return pickedProcessInstanceApi.retrieveTasks(user, resolveRetrieveTasksOptions(processInstanceId, completionStateFilter)).then(body => {
      let tasks = [];
      if (body.data
        && body.data.data
        && body.data.data.instanceTasksData
        && body.data.data.instanceTasksData.tasks
        && body.data.data.instanceTasksData.tasks.items) {
        tasks = body.data.data.instanceTasksData.tasks.items;
      }
      dispatch(retrieveTasksSuccess(tasks));
    }).catch(error => {
      dispatch(ajaxCallError(error));
      throw (error);
    });
  };
}

export function retrieveActivities(user, processInstanceId, activityFilterName) {

  return function (dispatch) {
    dispatch(beginAjaxCall());
    return pickedProcessInstanceApi.retrieveActivities(user, resolveRetrieveAtivitiesOptions(processInstanceId, activityFilterName)).then(body => {
      let activities = [];
      if (body.data
        && body.data.data
        && body.data.data.activityListData
        && body.data.data.activityListData.activities
        && body.data.data.activityListData.activities.items) {
        activities = body.data.data.activityListData.activities.items;
      }
      dispatch(retrieveActivitiesSuccess(activities));
    }).catch(error => {
      dispatch(ajaxCallError(error));
      throw (error);
    });
  };
}

export function retrieveAll(user, processInstanceId) {
  return function (dispatch) {
    return Promise.all([
      dispatch(retrieveSummary(user, processInstanceId)),
      dispatch(retrieveBusinessData(user, processInstanceId)),
      dispatch(retrieveTasks(user, processInstanceId, 'Open')),
      dispatch(retrieveActivities(user, processInstanceId, 'READY'))
    ]);
  };
}

export function storeIsPreloadedFromParent(isPreloadedFromParent) {
  return {
    type: types.STORE_IS_PROCESS_INSTANCE_PRELOADED_FROM_PARENT,
    isPreloadedFromParent
  };
}

export function reset() {
  return {
    type: types.RESET_PROCESS_INSTANCE
  };
}

function resolveRetrieveTasksOptions(processInstanceId, completionStateFilter) {

  let options;

  switch (completionStateFilter) {

    case 'Open':
      options = {
        params: {
          selectedInstanceId: processInstanceId,
          instanceTasksProperties: {
            sortCriteria: {
              items: [
                'DUEDATE_ASC',
                'ID_ASC'
              ]
            },
            filters: {
              items: [
                {
                  statusFilter: {
                    items: [
                      'NEW',
                      'RECEIVED'
                    ]
                  }
                }
              ]
            }
          }
        }
      };
      break;

    case 'Completed':
      options = {
        params: {
          selectedInstanceId: processInstanceId,
          instanceTasksProperties: {
            sortCriteria: {
              items: [
                'COMPLETEDDATE_DESC',
                'ID_ASC'
              ]
            },
            filters: {
              items: [
                {
                  statusFilter: {
                    items: [
                      'CLOSED'
                    ]
                  }
                }
              ]
            }
          }
        }
      };
      break;
  }

  return options;
}

function resolveRetrieveAtivitiesOptions(processInstanceId, activityFilterName) {

  let options;

  switch (activityFilterName) {

    case 'READY':
      options = {
        params: {
          selectedInstanceId: processInstanceId,
          activityListProperties: {
            sortCriteria: {
              items: [
                'STATE_ASC',
                'OPTIONTYPE_ASC',
                'NAME_ASC'
              ]
            },
            filters: {
              items: [
                {
                  executionStateFilter: {
                    items: [
                      'READY',
                      'WAITING',
                    ]
                  },
                  executionTypeFilter: {
                    items: [
                      'MANUAL'
                    ]
                  }
                }
              ]
            }
          }
        }
      };
      break;

    case 'IN_PROGRESS':
      options = {
        params: {
          selectedInstanceId: processInstanceId,
          activityListProperties: {
            sortCriteria: {
              items: [
                'STATE_ASC',
                'OPTIONTYPE_ASC',
                'NAME_ASC'
              ]
            },
            filters: {
              items: [
                {
                  executionStateFilter: {
                    items: [
                      'WORKING'
                    ]
                  }
                },
                {
                  executionStateFilter: {
                    items: [
                      'WAITING'
                    ]
                  },
                  executionTypeFilter: {
                    items: [
                      'AUTOMATIC'
                    ]
                  }
                }
              ]
            }
          }
        }
      };
      break;

    case 'COMPLETED':
      options = {
        params: {
          selectedInstanceId: processInstanceId,
          activityListProperties: {
            sortCriteria: {
              items: [
                'STATE_ASC',
                'NAME_ASC'
              ]
            },
            filters: {
              items: [
                {
                  executionStateFilter: {
                    items: [
                      'COMPLETED',
                      'FAILED',
                      'SKIPPED'
                    ]
                  }
                }
              ]
            }
          }
        }
      };
      break;

    case 'ALL':
      options = {
        params: {
          selectedInstanceId: processInstanceId,
          activityListProperties: {
            sortCriteria: {
              items: [
                'STATE_ASC',
                'NAME_ASC'
              ]
            },
            filters: {
              items: [
                {
                  executionStateFilter: {
                    items: [
                      'READY',
                      'WAITING',
                      'WORKING',
                      'COMPLETED',
                      'FAILED',
                      'SKIPPED'
                    ]
                  }
                }
              ]
            }
          }
        }
      };
      break;
  }

  return options;
}
