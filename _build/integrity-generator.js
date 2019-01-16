const promisify = require("util").promisify;
const readFile = promisify(require('fs').readFile);
const writeFile = promisify(require('fs').writeFile);
const renameFile = promisify(require('fs').rename);
const glob = promisify(require("multi-glob").glob);
const crypto = require('crypto');
const algorithm = 'sha512';
const minify = require('uglify-js').minify;
const buildFingerPrint = {
  timeStamp: Date.now()
};

function computeHash(fileContent, digest) {
  return crypto.createHash(algorithm).update(fileContent, 'utf8').digest(digest || 'base64');
}

function readSingleFile(fileName) {
  return readFile(fileName, 'utf-8').then(fileData => `'${fileName.match(/((components|framework).*?)\.js/)[1]}':'${algorithm}-${computeHash(fileData)}'`);
}

function batchRead(array) {
  var promises = [];
  array.forEach(function (item) {
    promises.push(readSingleFile(item));
  });
  return Promise.all(promises);
}

function hashForFile(fileName, digest) {
  return readFile(fileName, 'utf-8').then(fileData => computeHash(fileData, digest));
}

function replaceHashes(fileContents, hashes) {
  fileContents = fileContents.replace(/<script defer="defer" src=['"](.*?)['"]/, `<script defer integrity="sha512-${hashes[0]}" src="$1"`);
  fileContents = fileContents.replace(/<script defer="defer" src=['"]((.*security\.)js?)['"]/, `<script defer integrity="sha512-${hashes[1]}" src="$2${hashes[3]}.js"`);
  fileContents = fileContents.replace(/<script defer="defer" src=['"](.*?)['"]/, `<script defer integrity="sha512-${hashes[2]}" src="$1"`);
  fileContents = fileContents.replace(/<script async src=['"](.*?)['"]/, `<script async integrity="sha512-${hashes[4]}" src="$1"`);
  return fileContents;
}

Promise.all([
    glob([
      '../dist/components/**/*.js',
      '../dist/framework/elements/**/*.js',
      '../dist/framework/js/base-models/platform/*.js',
      '../dist/framework/js/base-models/ko/formatters.js'
    ]).then(batchRead).then(hashes => hashes.join()),
    readFile("../dist/framework/js/pages/security.js", "utf8")
  ])
  .then(values => values[1].replace(/\/\/__replace_location__/, values[0]))
  .then(result => minify(result).code)
  .then(result => writeFile("../dist/framework/js/pages/security.js", result, "utf8"))
  .then(() => console.log("\u2713 Security file generated successfully"))
  .then(() => Promise.all([
    hashForFile('../dist/framework/js/libs/oraclejet/js/libs/require/require.js'),
    hashForFile('../dist/framework/js/pages/security.js'),
    hashForFile('../dist/framework/js/pages/require-config.js'),
    hashForFile('../dist/framework/js/pages/security.js', 'hex'),
    hashForFile('../dist/framework/js/workers/service-worker.js')
  ]))
  .then(hashes => Promise.all([
    readFile("../dist/index.html", "utf8")
    .then(result => replaceHashes(result, hashes))
    .then(result => writeFile('../dist/index.html', result))
    .then(() => console.log("\u2713 Integrity computed for scripts in /index.html")),
    readFile("../dist/pages/home.html", "utf8")
    .then(result => replaceHashes(result, hashes))
    .then(result => writeFile('../dist/pages/home.html', result))
    .then(() => console.log("\u2713 Integrity computed for scripts in /pages/home.html"))
  ]))
  .then(() => writeFile('../dist/build.fingerprint', JSON.stringify(buildFingerPrint)))
  .then(() => hashForFile('../dist/framework/js/pages/security.js', 'hex'))
  .then(hash => renameFile('../dist/framework/js/pages/security.js', `../dist/framework/js/pages/security.${hash}.js`))
  .then(() => renameFile("../dist/framework/css/main.css", `../dist/framework/css/main.${buildFingerPrint.timeStamp}.css`))
  .then(() => console.log("\u2713 Integrity generator completed successfully"));