/* eslint-disable no-console */
import fetch from 'isomorphic-fetch';
import {buildRequest} from './apiHelper';
import merge from 'deepmerge';

class ProcessInstanceApi {

  static search(user, options) {
    user = Object.assign({}, user);
    options = merge(searchDefaultOptions(), options);

    if (!/\S/.test(options.params.searchFilter)) {
      options.params.searchFilter = null;
    }

    let request = buildRequest(`/rest/bpm/wle/v1/service/${options.serviceId}?snapshotId=${options.snapshotId}&action=start&createTask=false&parts=all&params=${JSON.stringify(options.params)}`, { method: 'POST', user });

    return fetch(request).then(
      response => {
        if (response.status == 200) {
          return response.json();
        } else {
          console.log('Failed to retrieve process instances.');
          throw 'Failed to retrieve process instances.';
        }
      },
      error => {
        console.log('An error occurred.', error);
        throw 'An error occurred.';
      }
    );
  }
}

export default ProcessInstanceApi;

function searchDefaultOptions() {

  return {
    serviceId: globalVars.config.api.toolkits.dashboards.serviceIds.instanceSearch,
    snapshotId: globalVars.config.api.toolkits.dashboards.snapshotId,
    params: {
      searchFilter: null,
      stateFilter: 'Active',
      maxResults: 25
    }
  };

}
