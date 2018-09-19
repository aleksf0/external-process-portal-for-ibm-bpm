import merge from 'deepmerge';

export function buildRequest(url, options = {}) {

    const defaultOptions = {
      method: 'GET',
      headers: new Headers({
        'Accept': 'application/json'
      })
    };

    const mergedOptions = merge(defaultOptions, options);

    if (globalVars.config.authentication === 'basic') {
      mergedOptions.headers.append('Authorization', 'Basic ' + btoa(options.user.username + ':' + options.user.password));
      url = '/bpm-rest' + url;
    } else {
      mergedOptions.credentials = 'include';
      url = globalVars.config.api.environmentUrl + url;
    }

    return new Request(url, mergedOptions);
}
