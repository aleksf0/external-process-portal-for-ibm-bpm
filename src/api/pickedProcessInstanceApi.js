/* eslint-disable no-console */
import fetch from 'isomorphic-fetch';
import {buildRequest} from './apiHelper';
import merge from 'deepmerge';

class PickedProcessInstanceApi {

  static retrieveParts(user, options) {

    user = Object.assign({}, user);

    // possible 'parts' values are: all, diagram, header (tasks), data (business data), executionTree (variables), actions, summary, relationships
    let request = buildRequest(`/rest/bpm/wle/v1/process/${options.processInstanceId}?parts=${options.parts.join('|')}`, { user });

    return fetch(request).then(
      response => {
        if (response.status == 200) {
          return response.json();
        } else {
          console.log('Failed to retrieve details of the process instance.');
          throw 'Failed to retrieve details of the process instance.';
        }
      },
      error => {
        console.log('An error occurred.', error);
        throw 'An error occurred.';
      }
    );
  }

  static retrieveBusinessData(user, options) {

    user = Object.assign({}, user);
    options = merge(retrieveBusinessDataDefaultOptions(), options);

    let request = buildRequest(`/rest/bpm/wle/v1/service/${options.serviceId}?snapshotId=${options.snapshotId}&action=start&createTask=false&parts=all&params=${JSON.stringify(options.params)}`, { method: 'POST', user });

    return fetch(request).then(
      response => {
        if (response.status == 200) {
          return response.json();
        } else {
          console.log('Failed to retrieve business data of the process instance.');
          throw 'Failed to retrieve business data of the process instance.';
        }
      },
      error => {
        console.log('An error occurred.', error);
        throw 'An error occurred.';
      }
    );
  }

  static retrieveTasks(user, options) {

    user = Object.assign({}, user);
    options = merge(retrieveTasksDefaultOptions(), options);

    let request = buildRequest(`/rest/bpm/wle/v1/service/${options.serviceId}?snapshotId=${options.snapshotId}&action=start&createTask=false&parts=all&params=${JSON.stringify(options.params)}`, { method: 'POST', user });

    return fetch(request).then(
      response => {
        if (response.status == 200) {
          return response.json();
        } else {
          console.log('Failed to retrieve tasks of the process instance.');
          throw 'Failed to retrieve tasks of the process instance.';
        }
      },
      error => {
        console.log('An error occurred.', error);
        throw 'An error occurred.';
      }
    );
  }

  static retrieveActivities(user, options) {

    user = Object.assign({}, user);
    options = merge(retrieveActivitiesDefaultOptions(), options);

    let request = buildRequest(`/rest/bpm/wle/v1/service/${options.serviceId}?snapshotId=${options.snapshotId}&action=start&createTask=false&parts=all&params=${JSON.stringify(options.params)}`, { method: 'POST', user });

    return fetch(request).then(
      response => {
        if (response.status == 200) {
          return response.json();
        } else {
          console.log('Failed to retrieve activities of the process instance.');
          throw 'Failed to retrieve activities of the process instance.';
        }
      },
      error => {
        console.log('An error occurred.', error);
        throw 'An error occurred.';
      }
    );
  }
}

export default PickedProcessInstanceApi;

function retrieveBusinessDataDefaultOptions() {
  return {
    serviceId: globalVars.config.api.toolkits.dashboards.serviceIds.instanceBusinessData,
    snapshotId: globalVars.config.api.toolkits.dashboards.snapshotId,
    params: {
      selectedInstanceId: 0
    }
  };
}

function retrieveTasksDefaultOptions() {
  return {
    serviceId: globalVars.config.api.toolkits.dashboards.serviceIds.instanceTasks,
    snapshotId: globalVars.config.api.toolkits.dashboards.snapshotId,
    params: {
      selectedInstanceId: 0,
      instanceTasksProperties: {
        sortCriteria: {
          listAllSelectedIndices: [],
          items: []
        },
        filters: {
          listAllSelectedIndices: [],
          items: [
            {
              statusFilter: {
                listAllSelectedIndices: [],
                items: []
              }
            }
          ]
        },
        checkActions: {
          listAllSelectedIndices: [],
          items: [
            'ACTION_VIEW_TASK',
            'ACTION_CLAIM',
            'ACTION_COMPLETE',
            'ACTION_CANCELCLAIM',
            'ACTION_REASSIGNTOUSER',
            'ACTION_REASSIGNTOGROUP',
            'ACTION_UPDATEPRIORITY',
            'ACTION_UPDATEDUEDATE'
          ]
        }
      }
    }
  };
}

function retrieveActivitiesDefaultOptions() {
  return {
    serviceId: globalVars.config.api.toolkits.dashboards.serviceIds.instanceActivities,
    snapshotId: globalVars.config.api.toolkits.dashboards.snapshotId,
    params: {
      selectedInstanceId: 0,
      activityListProperties: {
        checkActions: [
          'ACTION_VIEW_ACTIVITY',
          'ACTION_START_ACTIVITY'
        ],
        sortCriteria: {
          listAllSelectedIndices: [],
          items: []
        },
        filters: {
          listAllSelectedIndices: [],
          items: []
        },
        hiddenFilter: 'NOT_HIDDEN'
      }
    }
  };
}
