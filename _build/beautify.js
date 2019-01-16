var beautify = require("js-beautify").js_beautify,
  fs = require("fs");
var glob = require("multi-glob").glob;

function readSingleFile(fileName, callback) {
  "use strict";
  return new Promise(function(resolve, reject) {
    fs.readFile(fileName, "utf-8", function(err, fileData) {
      if (err) {
        reject(err);
        callback(err, fileName);
      }
      callback(void 0, fileName, fileData);
      resolve();
    });
  });
}

function batchRead(array, callback) {
  "use strict";
  var promises = [];
  array.forEach(function(item) {
    promises.push(readSingleFile(item, callback));
  });
  return Promise.all(promises);
}


glob(["../components/**/*.js", "../resources/**/*.js"],
  function(err, files) {
    "use strict";
    if (err) {
      throw err;
    }
    batchRead(files, function(err, fileName, data) {
      fs.writeFile(fileName, beautify(data, {
        indent_size: 2
      }), function(err) {
        if (err) throw err;
      });
    });
  });
