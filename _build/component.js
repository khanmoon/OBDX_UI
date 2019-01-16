const fs = require("fs");
const util = require("util");
const glob = require("multi-glob").glob;
const path = require("path");
const rimraf = require("rimraf");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

console.time("Component generation completed in");

var template = `

define("__comp_path__", function(require){
	return require("__comp_path__/loader");
});`

glob([
  '../dist/components/**/*/loader.js',
  '../dist/framework/elements/**/*/loader.js',
  '../dist/extensions/**/*/loader.js',
  '../dist/lzn/**/*/loader.js'
], function(err, files) {
  if (err) {
    throw err;
  }
  var fileDataPromises = [];
  files.forEach(fileName => {
    fileDataPromises.push(readFile(fileName, 'utf8'));
  });
  Promise.all(fileDataPromises).then(function(fileData) {
    var fileWritePromises = [];
    fileData.forEach((fileContent, index) => {
      fileWritePromises.push(attachTemplate(files[index], fileContent));
    });
    Promise.all(fileWritePromises).then(deleteFolder([
      "../dist/components/!(widgets)/*/",
      "../dist/components/widgets/*/*/",
      "../dist/framework/elements/*/*/",
      "../dist/extensions/components/!(widgets)/*/",
      "../dist/extensions/components/widgets/*/*/",
			"../dist/lzn/*/components/!(widgets)/*/",
			"../dist/lzn/*/components/widgets/*/*/",
    ])).then(() => {
      console.timeEnd("Component generation completed in");
    }).catch((err) => {
      console.error(err.stack);
      process.exit(1);
    })
  });
});

function attachTemplate(fileName, fileContent) {
  var parentDirectory = fileName.split("/").slice(0, -2).join("/");
  return writeFile(path.join(parentDirectory, `${fileName.split("/").splice(-2, 1)}.js`), (fileContent + template.replace(/__comp_path__/g, fileName.match(/((components|framework|lzn|extensions).*)/)[1].split("/").slice(0, -1).join("/"))));
}

function deleteFolder(folders) {
  var promiseList = [];
  folders.forEach(element => {
    promiseList.push(new Promise(function(resolve, reject) {
      rimraf(element, {}, function(err) {
        if (err) reject(err);
        resolve();
      });
    }));
  });
  return Promise.all(promiseList);
}
