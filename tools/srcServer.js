// This file configures the development web server
// which supports hot reloading and synchronized testing.

// Require Browsersync along with webpack and middleware for it
import config from 'config';
import browserSync from 'browser-sync';
import historyApiFallback from 'connect-history-api-fallback'; // Required for react-router browserHistory, see https://github.com/BrowserSync/browser-sync/issues/204#issuecomment-102623643
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../webpack.config.dev';
import url from 'url';
import proxy from '../mods/proxy-middleware';
import fs from 'fs';
import path from 'path';

const bundler = webpack(webpackConfig);

let middleware = [
  historyApiFallback(),
  webpackDevMiddleware(bundler, {
    publicPath: webpackConfig.output.publicPath, // Dev middleware can't access config, so we provide publicPath
    noInfo: false, // These settings suppress noisy webpack output so only errors are displayed to the console.
    quiet: false,  // for other settings see http://webpack.github.io/docs/webpack-dev-middleware.html
    stats: {
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false
    },
  }),
  webpackHotMiddleware(bundler) // bundler should be the same as above
];

if (config.get('authentication') === 'basic') { // setting proxy server to bypass CORS

  let proxyOptions = url.parse(config.get('api.environmentUrl'));
  proxyOptions.route = '/bpm-rest'; // requests to /bpm-rest/x/y/z are proxied to https://dev-bpm.somecompany.org/x/y/z
  if (config.has('api.certPath') && config.get('api.certPath')) {
    let certPath = config.get('api.certPath');
    proxyOptions.ca = [fs.readFileSync(/^([A-z]:|\/)/.test(certPath) ? certPath : process.env.PWD + path.sep + certPath, { encoding: 'utf-8' })];
  }
  proxyOptions.suppressHttpAuthPopup = true;
  proxyOptions.headers = { 'accept': '*/*' };

  middleware.unshift(proxy(proxyOptions)); // putting proxy at index 0 in the middleware array
}

browserSync({ // Run Browsersync and use middleware for Hot Module Replacement
  port: 3000,
  ui: {
    port: 3001
  },
  //ghostMode: false, // Clicks, Scrolls & Form inputs on any device will be mirrored to all others. Comment out if false.
  server: {
    baseDir: 'src',
    middleware
  },
  files: [ // no need to watch '*.js' here, webpack will take care of it for us, including full page reloads if HMR won't work
    'src/*.html'
  ]
});
