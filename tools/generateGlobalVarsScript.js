/* eslint-disable no-console */
import config from 'config';
import pjson from '../package';
import moment from 'moment';
import { chalkSuccess, chalkProcessing } from './chalkConfig';
import cheerio from 'cheerio';
import uglifyjs from 'uglify-js';
import fs from 'fs';

const isDist = process.argv[2] === '--dist';

const path = (isDist ? './dist' : './src');
const fileName = 'globalVars' + (isDist ? '.' + fs.statSync(__filename).mtime.valueOf().toString() : '') + '.js';
const mapFileName = fileName + '.map';
const filePath = path + '/' + fileName;
const mapFilePath = path + '/' + mapFileName;

generateGlobalVarsFile(fileName, filePath, mapFileName, mapFilePath, isDist);

if (isDist) {
  patchIndexHtmlWithGlobalVarsReference(fileName);
}

function generateGlobalVarsFile(fileName, filePath, mapFileName, mapFilePath, isDist) {

  const beautifiedContents = uglifyjs.minify(`
  //# Generated via ${__filename} at ${new Date}
  /* eslint-disable no-var, no-unused-vars */
  var globalVars = {
    config: ${JSON.stringify(config.util.toObject())},
    environment: {
      name: ${JSON.stringify(process.env.NODE_ENV).toUpperCase()},
      version: ${JSON.stringify(pjson.version)},
      deploymentDateTime: ${JSON.stringify(moment().format(config.get('dateTimeFormat')))}
    }
  };`, { output: { comments: true, beautify: true } });

  if (!isDist) {
    generateFile(filePath, beautifiedContents.code);
  } else {
    let minifiedContents = getMinifiedContents(fileName, filePath, mapFileName, beautifiedContents.code);
    generateFile(filePath, minifiedContents.code);
    generateFile(mapFilePath, minifiedContents.map);
  }
}

function getMinifiedContents(fileName, filePath, mapFileName, contents) {
  return uglifyjs.minify({ [fileName]: contents }, {
    output: {
      comments: true
    },
    sourceMap: {
      root: 'Custom source-maps',
      filename: filePath, // location of output source
      url: mapFileName, // path to source-map in source file
      includeSources: true // whether to include source in the source-map
    }
  });
}

function patchIndexHtmlWithGlobalVarsReference(fileName) {
  const indexHtmlPath = 'dist/index.html';
  console.log(chalkProcessing(`Patching ${indexHtmlPath}`));
  fs.readFile(indexHtmlPath, 'utf8', (err, markup) => {
    if (err) throw err;
    const $ = cheerio.load(markup);
    $('head script[src^=globalVars]').attr('src', fileName);
    fs.writeFile(indexHtmlPath, $.html(), 'utf8', function (err) {
      if (err) throw err;
      return console.log(chalkSuccess(`${indexHtmlPath} patched successfully`));
    });
  });
}

function generateFile(filePath, contents) {
  console.log(chalkProcessing(`Generating ${filePath}`));
  fs.writeFile(filePath, contents, function (err) {
    if (err) throw err;
    return console.log(chalkSuccess(`${filePath} generated successfully`));
  });
}
