/* eslint-disable no-console */
import fetch from 'isomorphic-fetch';
import {buildRequest} from './apiHelper';

class TaskApi {

  static search(user, params) {

    user = Object.assign({}, user);

    let request = buildRequest(`/rest/bpm/wle/v1/tasks/query/IBM.DEFAULTALLTASKSLIST_75${buildSearchQueryString(params)}`, { user });

    return fetch(request).then(
      response => {
        if (response.status == 200) {
          return response.json();
        } else {
          console.log('Failed to retrieve tasks.');
          throw 'Failed to retrieve tasks.';
        }
      },
      error => {
        console.log('An error occurred.', error);
        throw 'An error occurred.';
      }
    );
  }
}

export default TaskApi;

/**
 * Builds a query string for IBM BPM Task Search API (IBM.DEFAULTALLTASKSLIST_75) based on the params object supplied.
 *
 * This REST API operation is described here:
 * https://www.ibm.com/support/knowledgecenter/en/SSFTDH_8.5.6/com.ibm.wbpm.ref.doc/rest/pfs/rest_bpm_pfs_v1_tasks_query_ibm.defaultalltaskslist_75_get.htm
 *
 * The sample params object supplied could look like the following:
 *
 * {
 *   systemID: '',
 *   selectedAttributes: [
 *     'TAD_DISPLAY_NAME','PRIORITY','DUE','PI_DISPLAY_NAME','ASSIGNED_TO_ROLE_DISPLAY_NAME','NAME','PI_PIID','PI_NAME','OWNER','STATE','IS_AT_RISK','TKIID'
 *   ],
 *   interactionFilter: 'ASSESS_AND_WORK_ON', // WORK_ON, ASSESS_AVAILABLE, ASSESS_AND_WORK_ON, CHECK_COMPLETED, BROWSE_ALL
 *   queryFilter: '',
 *   searchFilter: 'BranchGroup:gr9h OR Branch:4649',
 *   processAppName: '',
 *   sortAttributes: [
 *     'IS_AT_RISK DESC','DUE ASC','TKIID ASC'
 *   ],
 *   offset: 0,
 *   size: 26,
 *   federationMode: true
 * }
 *
 * Which produces this query string for server URL (e.g. https://test-bpm.somecompany.org/rest/bpm/wle/v1/tasks/query/IBM.DEFAULTALLTASKSLIST_75):
 *
 * ?selectedAttributes=TAD_DISPLAY_NAME,PRIORITY,DUE,PI_DISPLAY_NAME,ASSIGNED_TO_ROLE_DISPLAY_NAME,NAME,PI_PIID,PI_NAME,OWNER,STATE,IS_AT_RISK,TKIID
 * &interactionFilter=ASSESS_AND_WORK_ON&searchFilter=BranchGroup:gr9h%20OR%20Branch:4649&sortAttributes=IS_AT_RISK%20DESC,DUE%20ASC,TKIID%20ASC
 * &offset=0&size=26&federationMode=true
 *
 * @param {Object} params
 * @return {String} a query string based on the params supplied
 */
function buildSearchQueryString(params) {

  let queryString = '';

  const defaultSelectedAttributes = [
    'TAD_DISPLAY_NAME', 'PRIORITY', 'DUE', 'PI_DISPLAY_NAME', 'ASSIGNED_TO_ROLE_DISPLAY_NAME',
    'NAME', 'PI_PIID', 'PI_NAME', 'OWNER', 'STATE', 'IS_AT_RISK', 'TKIID'
  ];

  const defaultSortAttributes = ['IS_AT_RISK DESC','DUE ASC','TKIID ASC'];

  queryString += params.systemId ? '&systemID=' + params.systemId : ''; // The ID of a federated IBM BPM system (UUID)
  queryString += '&selectedAttributes=' + (params.selectedAttributes ? params.selectedAttributes.join(',') : defaultSelectedAttributes); // Task fields to retrieve
  queryString += '&interactionFilter=' + (params.interactionFilter ? params.interactionFilter : 'ASSESS_AND_WORK_ON'); // WORK_ON (claimed), ASSESS_AVAILABLE (not claimed), ASSESS_AND_WORK_ON, CHECK_COMPLETED, BROWSE_ALL
  queryString += params.queryFilter ? '&queryFilter=' + params.queryFilter : ''; // A query table condition language expression
  queryString += params.searchFilter ? '&searchFilter=' + params.searchFilter : ''; // Provide search terms to filter the results
  queryString += params.processAppName ? '&processAppName=' + params.processAppName : '';
  queryString += '&sortAttributes=' + (params.sortAttributes ? params.sortAttributes.join(',') : defaultSortAttributes.join(','));   // Comma-separated list of sort criteria
  queryString += '&offset=' + (params.offset !== undefined ? params.offset : 0);
  queryString += '&size=' + (params.size !== undefined ? params.size : 25);
  queryString += '&federationMode=' + (params.federationMode === undefined ? true : params.federationMode); // Unknown

  return encodeURI('?' + queryString.substring(1));
}
