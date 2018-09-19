/* eslint-disable no-console */
import fetch from 'isomorphic-fetch';
import {buildRequest} from './apiHelper';

class ExposedItemApi {

  static retrieve(user, params = {}) {

    user = Object.assign({}, user);

    let request = buildRequest(`/rest/bpm/wle/v1/exposed${buildRetrieveQueryString(params)}`, { user });

    return fetch(request).then(
      response => {
        if (response.status == 200) {
          return response.json();
        } else {
          console.log('Failed to retrieve exposed items.');
          throw 'Failed to retrieve exposed items.';
        }
      },
      error => {
        console.log('An error occurred.', error);
        throw 'An error occurred.';
      }
    );
  }


  static start(user, startUrl) {

    user = Object.assign({}, user);

    let request = new Request(`/bpm-rest${startUrl}`, {
      method: 'POST',
      headers: new Headers({
        "Authorization": "Basic " + btoa(user.username + ":" + user.password)
      })
    });

    return fetch(request).then(
      response => {
        if (response.status == 200) {
          return response.json();
        } else {
          console.log('Failed to start exposed item.');
          throw 'Failed to start exposed item.';
        }
      },
      error => {
        console.log('An error occurred.', error);
        throw 'An error occurred.';
      }
    );
  }
}

export default ExposedItemApi;

/**
 * Builds a query string for IBM BPM Exposed Items API based on the params object supplied.
 * The sample params object supplied could look like the following:
 *
 * {
 *   includeServiceSubtypes: [
 *     'url', 'dashboard', 'administration_service', 'startable_service', 'not_exposed'
 *   ],
 *   excludeProcessStartUrl: true,
 *   excludeReferencedFromToolkit: [
 *     'process', 'report', 'scoreboard', 'dashboard', 'startable_service', 'url', 'administration_service' // or 'null', or 'all'
 *   ],
 *   federationMode: true
 * }
 *
 * Which produces this query string:
 *
 * ?includeServiceSubtypes=url,dashboard,administration_service,startable_service,not_exposed&excludeProcessStartUrl=true
 * &excludeReferencedFromToolkit=process,report,scoreboard,dashboard,startable_service,url,administration_service&federationMode=true
 *
 * @param {Object} params
 * @return {String} a query string based on the params supplied
 */
function buildRetrieveQueryString(params) {

  let queryString = '';

  queryString += '&includeServiceSubtypes=' + (params.includeServiceSubtypes ? params.includeServiceSubtypes.join(',') : 'startable_service'); // url, dashboard, administration_service, startable_service, not_exposed
  queryString += '&excludeProcessStartUrl=' + (params.excludeProcessStartUrl === undefined ? false : params.excludeProcessStartUrl);
  queryString += '&excludeReferencedFromToolkit=' + (params.excludeReferencedFromToolkit ? params.excludeReferencedFromToolkit.join(',') : null); // process, report, scoreboard, dashboard, startable_service, url, administration_service; or to all.
  queryString += '&federationMode=' + (params.federationMode === undefined ? true : params.federationMode); // Unknown

  return encodeURI('?' + queryString.substring(1));
}
