console.time('ESLint JSDoc completed. Time taken');
const fs = require('fs');
const util = require("util");
const readFile = util.promisify(fs.readFile);
const {
  exec
} = require('child_process');

(async function main() {
  var eslintJSON = {};
  await readFile('eslint-jsdoc.json', 'utf8').then(results => JSON.parse(results)).then(json => {
    eslintJSON = json;
  });
  exec(`cd ../ && svn log -r ${eslintJSON.currentRevNum}:HEAD --verbose`, {
    maxBuffer: 20000 * 1024
  }, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    var logList = stdout.match(/A \/trunk\/core\/channel\/components\/.*\.js/gi);
    logList = [...new Set(logList)];
    var components = [];
    logList.forEach(function (line) {
      var result = line.match(/components.*$/);
      components.push(`../${result[0]}`);
    });
    eslintJSON.jsdoc = eslintJSON.jsdoc.concat(components);
    exec(`svn info -r HEAD`, {
      maxBuffer: 20000 * 1024
    }, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      eslintJSON.currentRevNum = stdout.match(/Revision:\s(.*)/)[1];
      fs.writeFile('eslint-jsdoc.json', JSON.stringify(eslintJSON), function (err) {
        if (err) throw err;
        console.timeEnd('ESLint JSDoc completed. Time taken');
      });
    });
  });
})();
