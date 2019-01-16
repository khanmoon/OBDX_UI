const fs = require('fs');
const glob = require('multi-glob').glob;
const path = require('path');

const extensionsRoot = '../extensions/';
const widgetsRoot = '../components/widgets/';

var extensionsJSON = require(path.join(extensionsRoot, 'extension.json'));
var widgetJSON = require('../framework/json/design-dashboard/moduleComponents.json');

glob([`${extensionsRoot}**/*-bindings.js`],
  function(err, files) {
    if (err) {
      throw err;
    }
    files.forEach(function(element) {
      extensionsJSON.components.push(`${element.match(/\.\.\/extensions\/components\/(.*?)\/ko\//)[1]}`);
    });
    fs.writeFile(path.join(extensionsRoot, 'extension.json'), JSON.stringify(extensionsJSON), function(err) {
      if (err) throw err;
      console.log('\nExtensions JSON generated');
    });
  });

glob([`${widgetsRoot}**/*-bindings.js`],
  function(err, files) {
    if (err) {
      throw err;
    }
    widgetJSON.components.length = 0;
    files.forEach(function(fileName) {
      var matches = fileName.match(/\.\.\/components\/widgets\/(.*?)\/(.*?)\/ko\//);
      var manifest = null;
      try {
        manifest = require(path.join(fileName.match(/(.*?)\/ko/)[1], 'manifest.json'));
      } catch (e) {
        throw new Error(`FATAL: Manifest missing for ${fileName}.\nFound no valid manifest at ${path.join(fileName.match(/(.*?)\/ko/)[1], 'manifest.json')}`);
      }
      widgetJSON.components.push(Object.assign({
        id: matches[1],
        module: matches[2]
      }, manifest));
    });
    fs.writeFile('../framework/json/design-dashboard/moduleComponents.json', JSON.stringify(widgetJSON), function(err) {
      if (err) throw err;
      console.log('\nWidgets List JSON generated');
    });
  });
