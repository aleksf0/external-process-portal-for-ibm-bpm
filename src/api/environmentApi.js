/* eslint-disable no-console */
import fetch from 'isomorphic-fetch';
import {buildRequest} from './apiHelper';

class EnvironmentApi {

  static retrieveSystemDetails(user) {

    user = Object.assign({}, user);

    let request = buildRequest('/rest/bpm/wle/v1/systems', { user });

    return fetch(request).then(
      response => {
        if (response.status == 200) {
          return response.json();
        } else {
          console.log('Authentication failed.');
          throw 'Authentication failed.';
        }
      },
      error => {
        console.log('An error occurred.', error);
        throw 'An error occurred.';
      }
    );
  }
}

export default EnvironmentApi;
