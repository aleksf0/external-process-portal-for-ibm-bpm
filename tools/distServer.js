/* eslint-disable no-console */

// This file configures a web server for testing the production build
// on your local machine.

import config from 'config';
import { chalkProcessing, chalkSuccess, chalkError } from './chalkConfig';
import express from 'express';
import compression from 'compression';
import historyApiFallback from 'express-history-api-fallback';
import url from 'url';
import proxy from '../mods/proxy-middleware';
import fs from 'fs';
import path from 'path';

console.log(chalkProcessing('Opening production build...'));

const port = 4000;
const app = express();

if (config.get('authentication') === 'basic') { // setting proxy server to bypass CORS

  let certPath = config.get('api.certPath');
  let proxyOptions = url.parse(config.get('api.environmentUrl'));
  proxyOptions.route = '/bpm-rest'; // requests to /bpm-rest/x/y/z are proxied to https://dev-bpm.danskenet.net/x/y/z
  proxyOptions.ca = [fs.readFileSync(/^([A-z]:|\/)/.test(certPath) ? certPath : process.env.PWD + path.sep + certPath, { encoding: 'utf-8' })];
  proxyOptions.suppressHttpAuthPopup = true;
  proxyOptions.headers = { 'accept': '*/*' };

  app.use(proxy(proxyOptions)); // putting proxy at index 0 in the middleware array
}

app.use(compression());
app.use(express.static('dist'));
app.use(historyApiFallback('index.html', { root: 'dist' }));

app.listen(port, function (err) {
  if (err) {
    console.log(chalkError(err));
  } else {
    console.log(chalkSuccess('Express server started and listening on port ' + port));
  }
});
