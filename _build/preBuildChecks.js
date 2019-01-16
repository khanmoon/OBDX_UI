console.time('Total time');
const Regex = require('./regex-list');
const ko = require('../framework/js/libs/oraclejet/js/libs/knockout/knockout-3.4.2.js');
const exclusionArray = require('./preBuildChecksProps').exclusionArray;
const cheerio = require('cheerio');
const parse = require('path').parse;
const fs = require('fs');
const readFile = require('fs').readFile;
const writeFile = require('fs').writeFile;
const extname = require('path').extname;
const normalize = require('path').normalize;
const glob = require('multi-glob').glob;
const tokenize = require('esprima').tokenize;
const Typo = require('typo-js');
const dictionary = new Typo('en_US', null, null, {
  dictionaryPath: 'dictionaries'
});
const crypto = require('crypto');
var fileCache = {};
try {
  var fileCache = JSON.parse(fs.readFileSync("./.preBuildCache", "utf8"))
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

function computeHash(fileContent) {
  return crypto.createHash(digest).update(fileContent, 'utf8').digest('base64');
}

var defaultFileObj = {
    resourceBundles: [
      '../resources/**/*.js',
      '../extensions/resources/**/*.js',
      '../lzn/*/resources/**/*.js'
    ],
    bindings: [
      '../framework/elements/**/*.js',
      '../components/**/*.js',
      '../extensions/**/*.js',
      '../lzn/*/components/**/*.js'
    ],
    html: [
      '../framework/elements/**/*.html',
      '../components/**/*.html',
      '../extensions/**/*.html',
      '../partials/**/*.html',
      '../lzn/*/components/**/*.html',
      '../lzn/*/partials/**/*.html'
    ],
    css: [
      '../components/**/*.css',
      '../lzn/**/*.css',
      '../extensions/**/*.css'
    ],
    scss: [
      '../components/**/*.scss',
      '../lzn/**/*.scss',
      '../extensions/**/*.scss',
      '../framework/sass/**/*.scss'
    ]
  },
  errorEncountered = false,
  errors = {},
  isVerbose = false,
  isPrecommitHook = false,
  isDevMode = !process.env['IS_GRUNT'],
  incrementalRunFileListLoc = null,
  ignoreCache = false,
  cacheHit = 0,
  cacheMiss = 0,
  digest = "md5",
  currentRegexListHash = computeHash(fs.readFileSync("./regex-list.js", "utf8")),
  currentPreBuildChecksFileHash = computeHash(fs.readFileSync("./preBuildChecks.js", "utf8"));

process.argv.forEach((val, index) => {
  if (val === "--verbose" || val === "-v") isVerbose = true;
  if (val === "--precommit") {
    isPrecommitHook = true;
    incrementalRunFileListLoc = process.argv[2];
  }
  if (val === "--ignoreCache") ignoreCache = true;
  if (val.match(/--digest=([^\s]*)/)) digest = val.match(/--digest=([^\s]*)/)[1].trim();
});

if (isPrecommitHook) {
  readFile(incrementalRunFileListLoc, 'utf8', function (err, data) {
    if (err) throw err;
    fileDispatcher(data.trim().split("\n"));
  });
} else {
  runChecks(defaultFileObj);
}

function fileDispatcher(files) {
  var fileObj = {
    resourceBundles: [],
    bindingsHTML: [],
    scss: []
  };
  files.forEach(function (fileName) {
    if (fileName.match('/resources/')) fileObj.resourceBundles.push(fileName);
    if (
      fileName.match('/framework/elements/') ||
      fileName.match('/components/') ||
      fileName.match('/partials/') ||
      fileName.match('/extensions/')) {
      fileObj.bindingsHTML.push(fileName);
    }
    if (fileName.match('.scss')) fileObj.scss.push(fileName);
  });
  runChecks(fileObj);
}

function shouldCheckFile(fileName, fileContent) {
  if (fileCache.regexListHash === currentRegexListHash && fileCache.preBuildFileHash === currentPreBuildChecksFileHash) {
    if (!ignoreCache) {
      if (!fileCache[fileName]) {
        fileCache[fileName] = {
          hasErrors: true,
          hash: computeHash(fileContent)
        }
      }
      if (fileCache[fileName].hash === computeHash(fileContent) && fileCache[fileName].hasErrors === false) {
        cacheHit++;
        return false;
      }
      fileCache[fileName].hash = computeHash(fileContent);
      fileCache[fileName].hasErrors = false;
    } else {
      fileCache = {};
    }
  }
  cacheMiss++;
  return true;
}

function commitCache(cb) {
  fileCache.regexListHash = computeHash(fs.readFileSync("./regex-list.js", "utf8"));
  fileCache.preBuildFileHash = computeHash(fs.readFileSync("./preBuildChecks.js", "utf8"));
  writeFile("./.preBuildCache", JSON.stringify(fileCache), "utf8", cb);
}

function checkResourceBundles(files) {
  console.time('checkResourceBundles');
  return new Promise(function (resolve, reject) {
    glob(files, function (err, files) {
      if (err) {
        throw err;
      }
      batchRead(files, function (err, fileName, data) {
        if (shouldCheckFile(fileName, data)) {
          var array;
          try {
            array = tokenize(data);
          } catch (err) {
            console.log(err.description + '\tat:' + err.lineNumber);
            console.log('Incorrect file:', fileName);
            process.exit(1);
          }
          var stringValues = array.filter(function (object, index) {
            return object.type === 'String' && array[index - 1].type === 'Punctuator' && array[index - 1].value === ':';
          });
          var count = stringValues.length;
          stringValues.forEach(function (element) {
            var matches = element.value.match(/[\s'"]\w+[A-Z]+\w*/);
            if (matches) {
              matches.forEach(function (element) {
                element = element.replace(/['"\s]/, '');
                if (!exclusionArray.includes(element) && !fileName.match(/(obdx-locale)/)) {
                  reporter(data, fileName, 'Resource bundle values have capital case at incorrect place, potential bug detected. %d File(s) will be deleted:\n', element);
                }
              });
            }
          });
          if (count > 100) {
            if (!fileName.match(/(obdx-locale)|(menu)|(theme-labels)|(transactions)/)) {
              reporter(data, "Count:\t" + count + "\t\t" + fileName, 'More than 80 keys found for resource bundles. %d File(s) will be deleted:\n', []);
            }
          }
          if (data && data.match(Regex.STRING_ONLY_SPACES)) {
            reporter(data, fileName,
              'String contains only spaces. %d File(s) deleted:\n', [Regex.STRING_ONLY_SPACES]);
          }
          if (data && data.match(Regex.RB_INVALID_VALUE)) {
            reporter(data, fileName,
              'Wrong key values are used in resource bundle. %d File(s) deleted:\n', [Regex.RB_INVALID_VALUE]);
          }
          if (data && data.match(Regex.RB_END_WITH_SPACE)) {
            reporter(data, fileName,
              'Resource bundle key found with trailing space(s). %d File(s) deleted:\n', [Regex.RB_END_WITH_SPACE]);
          }
          if (data && data.match(Regex.RB_START_WITH_SPACE)) {
            reporter(data, fileName,
              'Resource bundle key found with starting space(s). %d File(s) deleted:\n', [Regex.RB_START_WITH_SPACE]);
          }
          if (data && data.match(Regex.RB_INVALID_DATA_BIND)) {
            reporter(data, fileName,
              'data-bind used in resource bundle. %d File(s) deleted:\n', [Regex.RB_INVALID_DATA_BIND]);
          }
          if (data && data.match(Regex.RB_INVALID_IMPORT)) {
            reporter(data, fileName,
              'Always import resource bundle by ojL10N. %d File(s) deleted:\n', [Regex.RB_INVALID_IMPORT]);
          }
          if (parse(fileName).name.match(Regex.INVALID_FILE_NAME_PATTERN)) {
            reporter(fileName, fileName,
              'Invalid file name found. %d File(s) deleted:\n', [Regex.INVALID_FILE_NAME_PATTERN]);
          }
          if (parse(fileName).name.split('-').length) {
            parse(fileName).name.split('-').forEach(function (element, index, array) {
              if (!dictionary.check(element)) {
                reporter(fileName, fileName,
                  'Name of the file is not meaningful. %d File(s) deleted:\n', []);
              }
            });
          }
        }
      }).then(function () {
        resolve('Done');
        console.timeEnd('checkResourceBundles');
      }).catch(function (err) {
        throw (err);
      });
    });
  });
}

function checkBindings(files) {
  console.time('checkBindings');
  return new Promise(function (resolve, reject) {
    glob(files, function (err, files) {
      if (err) {
        throw err;
      }
      batchRead(files, function (err, fileName, data) {
        if (shouldCheckFile(fileName, data)) {
          if (data) {
            if (fileName.match(/model\.js$/)) {
              var dependencies;
              try {
                dependencies = data.match(/[^\]]*/gi)[0].split("[")[1].replace(/(\r\n|\n|\r)/gm, "").split(",");
              } catch (error) {
                reporter(data, fileName,
                  'Model violation encountered. File deleted:\n', []);
                return;
              }
              for (var length = dependencies.length, i = length; i--;) {
                if (
                  dependencies[i] === "" ||
                  dependencies[i].match(/jquery/) ||
                  dependencies[i].match(/baseService/) ||
                  dependencies[i].match(/baseLogger/) ||
                  dependencies[i].match(/constants\//) ||
                  dependencies[i].match(/contact-info\/model/) ||
                  dependencies[i].match(/primary-registration\/model/) ||
                  dependencies[i].match(/occupation-info\/model/)) {
                  continue;
                } else {
                  reporter(data, fileName,
                    'Model violation encountered. File deleted:\n', []);
                }
              }
            } else {
              var strings = data.match(/"[^"]*"/g);
              for (var i = 0; strings && i < strings.length; i++) {
                var match = strings[i].match(/"[A-Z][^A-Z]+"/);
                if (match) {
                  reporter(data, fileName,
                    'Invalid string literal found. %d File(s) deleted:\n', match[0].slice(1, -1), true);
                }
              }
            }
            if (data.match(Regex.STRING_ONLY_SPACES)) {
              reporter(data, fileName,
                'String contains only spaces. %d File(s) deleted:\n', [Regex.STRING_ONLY_SPACES]);
            }
            if (data.match(Regex.DEPRECATED_METHODS)) {
              reporter(data, fileName,
                'Deprecated Method used. %d File(s) deleted:\n', [Regex.DEPRECATED_METHODS], true);
            }
            if (data.match(Regex.NEW_DATE)) {
              reporter(data, fileName,
                'new Date Statement was found. File will be deleted:\n', [Regex.NEW_DATE]);
            }
            if (data.match(Regex.DIGX_IN_COMPONENT)) {
              reporter(data, fileName,
                '/digx found in component. %d File(s) deleted:\n', [Regex.DIGX_IN_COMPONENT]);
            }
            if (data.match(Regex.INVALID_CONSTANT_COMPARISON)) {
              reporter(data, fileName,
                'Illegal comparison done with resource bundle string. %d File(s) deleted:\n', [Regex.INVALID_CONSTANT_COMPARISON]);
            }
            if (data.match(Regex.KO_SUBSCRIBE)) {
              var subscribeMatch = data.match(Regex.KO_SUBSCRIBE);
              if (subscribeMatch && subscribeMatch[1] && subscribeMatch[2]) {
                var subscribeMatchArray = subscribeMatch[2].trim();
                if (!data.match(new RegExp(`${subscribeMatchArray}.*?dispose\(\)`))) {
                  reporter(data, fileName,
                    'Subscription needs to be explicitly disposed, potential memory leak. %d File(s) deleted:\n', [Regex.KO_SUBSCRIBE]);
                }
              } else {
                if (subscribeMatch && subscribeMatch[3]) {
                  var variable = subscribeMatch[3].trim();
                  if (!data.match(new RegExp(`${variable}\\s*?\\=\\s*?ko`))) {
                    var subscriptionMatch = data.match(new RegExp(`(.*?\\s*?)\\=\\s*?${variable.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&")}.subscribe`));
                    if (!subscriptionMatch || !subscriptionMatch[1] || !data.match(new RegExp(`${subscriptionMatch[1].replace(/(var)|(self\.)/,'').trim()}.dispose()`))) {
                      reporter(data, fileName,
                        'Subscription needs to be explicitly disposed, potential memory leak. %d File(s) deleted:\n', [Regex.KO_SUBSCRIBE]);
                    }
                  }
                }
              }
            }
            if (data.match(Regex.KO_COMPUTED)) {
              var computedMatch = data.match(Regex.KO_COMPUTED);
              var computedReference = computedMatch && computedMatch[1];
              if (!computedReference || !data.match(new RegExp(`${computedReference.replace(/(var)|(self\.)/, '').trim()}\\.dispose()`))) {
                reporter(data, fileName,
                  'Computed needs to be explicitly disposed, potential memory leak. %d File(s) deleted:\n', [Regex.KO_COMPUTED]);
              }
            }
            if (data.match(Regex.KO_MAPPING)) {
              reporter(data, fileName,
                '__ko_mapping__ used. %d File(s) deleted:\n', [Regex.KO_MAPPING]);
            }
            if (data.match(Regex.LOCALE_STRING)) {
              reporter(data, fileName,
                'Illegal usage of toLocaleDateString, toLocaleTimeString or toLocaleString. %d File(s) deleted:\n', [Regex.LOCALE_STRING]);
            }
            if (data.match(Regex.SPLIT_BY_T)) {
              reporter(data, fileName,
                'Illegal usage of split("T") to manipulate time. %d File(s) deleted:\n', [Regex.SPLIT_BY_T]);
            }
            if (data.match(Regex.DELETE_ON_KEY)) {
              reporter(data, fileName,
                'delete used on object key. %d File(s) deleted:\n', [Regex.DELETE_ON_KEY]);
            }
            if (data.match(Regex.HEADER_NAME) || data.match(Regex.HARDCODED_MESSAGES)) {
              reporter(data, fileName,
                'Hardcoded label found. %d File(s) deleted:\n', [Regex.HEADER_NAME, Regex.HARDCODED_MESSAGES]);
            }
            if (data.match(Regex.SELF_PASSED_AS_PARAMS)) {
              reporter(data, fileName,
                'Context is passed as params. %d File(s) deleted:\n', [Regex.SELF_PASSED_AS_PARAMS]);
            }
            if (data.match(Regex.SELF_PARAMS)) {
              if (!fileName.match(/components\/approvals\/transaction\-detail\/transaction-detail\.js/)) {
                reporter(data, fileName,
                  'params variable is modified. %d File(s) deleted:\n', [Regex.SELF_PARAMS]);
              }
            }
            if (data.match(Regex.IS_STRING_REGEX)) {
              var strings = data.match(Regex.IS_STRING_REGEX);
              strings.forEach(function (value) {
                var match = value.slice(1, -1).match(Regex.TITLE_CASE);
                if (match) {
                  reporter(data, fileName,
                    'Potentially hardcoded string found. %d File(s) deleted:\n', match[0]);
                }
              });
            }
            if (parse(fileName).name.match(Regex.INVALID_FILE_NAME_PATTERN)) {
              reporter(fileName, fileName,
                'Invalid file name found. %d File(s) deleted:\n', [Regex.INVALID_FILE_NAME_PATTERN]);
            }
            if (parse(fileName).name.split('-').length) {
              parse(fileName).name.split('-').forEach((element, index, array) => {
                if (!dictionary.check(element)) {
                  reporter(fileName, fileName,
                    'Name of the file is not meaningful. %d File(s) deleted:\n', []);
                }
              });
            }
          }
        }
      }).then(function () {
        resolve('Done');
        console.timeEnd('checkBindings');
      }).catch(function (err) {
        throw (err);
      });
    });
  });
}

function checkCSS(files) {
  console.time('checkCSS');
  return new Promise(function (resolve, reject) {
    glob(files, function (err, files) {
      if (err) {
        throw err;
      }
      if (files.length) {
        files.forEach(file => {
          reporter(file, file,
            'CSS file checked in. %d File(s) deleted:\n', []);
        });
      }
      resolve('Done');
      console.timeEnd('checkCSS');
    });
  });
}

function checkSCSS(files) {
  console.time('checkSCSS');
  return new Promise(function (resolve, reject) {
    glob(files, function (err, files) {
      if (err) {
        throw err;
      }
      batchRead(files, function (err, fileName, data) {
        if (shouldCheckFile(fileName, data)) {
          if (data) {
            if (data.match(Regex.LEFT_RIGHT)) {
              reporter(data, fileName,
                'Left or right property qualifier found. %d File(s) deleted:\n', [Regex.LEFT_RIGHT]);
            }
            if (data.match(Regex.TEXT_ALIGN)) {
              reporter(data, fileName,
                'Text align left/right found. %d File(s) deleted:\n', [Regex.TEXT_ALIGN]);
            }
            if (data.match(Regex.PROP_LEFT_RIGHT)) {
              reporter(data, fileName,
                'Property left/right found. %d File(s) deleted:\n', [Regex.PROP_LEFT_RIGHT]);
            }
            if (data.match(Regex.OJ_OVERRIDE_SCSS)) {
              reporter(data, fileName,
                'Illegal Oracle JET override found. %d File(s) deleted:\n', [Regex.OJ_OVERRIDE_SCSS], true);
            }
          } else {
            reporter(data, fileName,
              'Empty file found. %d File(s) deleted:\n', []);
          }
        }
      }).then(function () {
        resolve('Done');
        console.timeEnd('checkSCSS');
      }).catch(function (err) {
        throw (err);
      });
    });
  });
}


function checkHTML(files) {
  console.time('checkHTML');
  return new Promise(function (resolve, reject) {
    glob(files, function (err, files) {
      if (err) {
        throw err;
      }
      batchRead(files, function (err, fileName, data) {
        if (shouldCheckFile(fileName, data)) {
          if (data) {
            if (data.match(Regex.I_TAG)) {
              reporter(data, fileName,
                '<i> tag found for icons. Replace it by <span>. %d File(s) deleted:\n', [Regex.I_TAG]);
            }
            if (data.match(Regex.DEPRECATED_TAG_SUMMARY) || data.match(Regex.DEPRECATED_TAG_ALIGN)) {
              reporter(data, fileName,
                'Deprecated HTML5 attribute found. This file may contain "summary" or "align" attributes. %d File(s) deleted:\n', [Regex.DEPRECATED_TAG_SUMMARY,
                  Regex.DEPRECATED_TAG_ALIGN
                ]);
            }
            if (data.match(Regex.NEW_DATE)) {
              reporter(data, fileName,
                'new Date Statement was found. File will be deleted:\n', [Regex.NEW_DATE]);
            }
            if (data.match(Regex.DEPRECATED_METHODS)) {
              reporter(data, fileName,
                'Deprecated Method used. %d File(s) deleted:\n', [Regex.DEPRECATED_METHODS], true);
            }
            if (data.match(Regex.DIGX_IN_COMPONENT)) {
              reporter(data, fileName,
                '/digx found in component. %d File(s) deleted:\n', [Regex.DIGX_IN_COMPONENT]);
            }
            if (data.match(Regex.SPLIT_BY_T)) {
              reporter(data, fileName,
                'Illegal usage of split("T") to manipulate time. %d File(s) deleted:\n', [Regex.SPLIT_BY_T]);
            }
            if (data.match(Regex.OJ_OLD_SYNTAX_USED)) {
              reporter(data, fileName,
                'Oracle JET old syntax used. %d File(s) deleted:\n', [Regex.OJ_OLD_SYNTAX_USED]);
            }
            if (data.match(Regex.JQUERY_IN_HTML)) {
              reporter(data, fileName,
                'jQuery used in HTML. %d File(s) deleted:\n', [Regex.JQUERY_IN_HTML], true);
            }
            if (data.match(Regex.FUNCTION_IN_HTML)) {
              reporter(data, fileName,
                'Inline function used in HTML. %d File(s) deleted:\n', [Regex.FUNCTION_IN_HTML], true);
            }
            if (parse(fileName).name.match(Regex.INVALID_FILE_NAME_PATTERN)) {
              reporter(fileName, fileName,
                'Invalid file name found. %d File(s) deleted:\n', [Regex.INVALID_FILE_NAME_PATTERN]);
            }
            if (parse(fileName).name.split('-').length) {
              parse(fileName).name.split('-').forEach((element, index, array) => {
                if (!dictionary.check(element)) {
                  reporter(fileName, fileName,
                    'Name of the file is not meaningful. %d File(s) deleted:\n', []);
                }
              });
            }
            var $ = cheerio.load(data);
            var anchorDataBind = ko.expressionRewriting.parseObjectLiteral($('a').attr('data-bind'));
            var imageDataBind = ko.expressionRewriting.parseObjectLiteral($('img').attr('data-bind'));
            if (anchorDataBind.length) {
              anchorDataBind.forEach(function (element) {
                if (element.key === 'attr') {
                  try {
                    var attributeValue = ko.expressionRewriting.parseObjectLiteral(element.value);
                    Object.keys(attributeValue).forEach(function (key) {
                      if (attributeValue[key].value.match(/^['"][^'"]+?['"]$/) && (attributeValue[key].key === "aria-label" || attributeValue[key].key === "alt" || attributeValue[key].key === "title")) {
                        reporter(data, fileName,
                          'Hardcoded string detected. %d File(s) deleted:\n', attributeValue[key].value);
                      }
                    });
                    var alt = element.value.match(Regex.ALT_IN_DATABIND)[1];
                    var title = element.value.match(Regex.TITLE_IN_DATABIND)[1];
                    if (alt.trim() === title.trim()) {
                      reporter(data, fileName,
                        '"alt" is same as "title" for anchor element. %d File(s) deleted:\n', []);
                    }
                  } catch (error) {}
                }
              });
            }
            if (imageDataBind) {
              imageDataBind.forEach(function (element) {
                if (element.key === 'attr') {
                  try {
                    var attributeValue = ko.expressionRewriting.parseObjectLiteral(element.value);
                    Object.keys(attributeValue).forEach(function (key) {
                      if (attributeValue[key].value.match(/^['"][^'"]+?['"]$/) && (attributeValue[key].key === "aria-label" || attributeValue[key].key === "alt" || attributeValue[key].key === "title")) {
                        reporter(data, fileName,
                          'Hardcoded string detected. %d File(s) deleted:\n', attributeValue[key].value);
                      }
                    });
                    var alt = element.value.match(Regex.ALT_IN_DATABIND)[1];
                    var title = element.value.match(Regex.TITLE_IN_DATABIND)[1];
                    if (alt.trim() === title.trim()) {
                      reporter(data, fileName,
                        '"alt" is same as "title" for image element. %d File(s) will be deleted:\n', []);
                    }
                  } catch (error) {}
                }
              });
            }
            if (data.match(Regex.ANCHOR_WITHOUT_HREF)) {
              reporter(data, fileName,
                'Anchor tag used without href. %d File(s) deleted:\n', [Regex.ANCHOR_WITHOUT_HREF]);
            }
            if (data.match(Regex.DIV_SPAN_CLICK)) {
              reporter(data, fileName,
                'Click found on <div> or <span>. %d File(s) deleted:\n', [Regex.DIV_SPAN_CLICK]);
            }
            if (data.match(Regex.MESSAGE_PLACEHOLDER_HARDCODED)) {
              reporter(data, fileName,
                'Hardcoded Message or Placeholder found. %d File(s) deleted:\n', [Regex.MESSAGE_PLACEHOLDER_HARDCODED]);
            }
            if (data.match(Regex.EMPTY_LABEL)) {
              reporter(data, fileName,
                'Empty label found. %d File(s) deleted:\n', [Regex.EMPTY_LABEL]);
            }
            if (data.match(Regex.TEXT_BINDING_HARDCODING)) {
              reporter(data, fileName,
                'Hardcoded text binding found. %d File(s) deleted:\n', [Regex.TEXT_BINDING_HARDCODING]);
            }
            if (data.match(Regex.INVALID_SUB_HEADING)) {
              reporter(data, fileName,
                'Hardcoded heading in page-section or action-header is found. %d File(s) deleted:\n', [Regex.INVALID_SUB_HEADING]);
            }
            if (data.match(Regex.HARDCODED_ROW_LABEL)) {
              reporter(data, fileName,
                'Hardcoded label in row component is found. %d File(s) deleted:\n', [Regex.HARDCODED_ROW_LABEL]);
            }
            if (data.match(Regex.INLINE_STYLING_TAG) || data.match(Regex.INLINE_STYLING_ROOTATTRIBUTES)) {
              reporter(data, fileName,
                'Inline style tag found. %d File(s) will be deleted:\n', [Regex.INLINE_STYLING_TAG, Regex.INLINE_STYLING_ROOTATTRIBUTES]);
            }
            if (data.match(Regex.HARDCODED_LABEL)) {
              reporter(data, fileName,
                'Hardcoded Label found. %d File(s) will be deleted:\n', [Regex.HARDCODED_LABEL]);
            }
            if (data.match(Regex.ARIA_HARDCODED_LABEL)) {
              reporter(data, fileName,
                'Hardcoded aria Label found. %d File(s) will be deleted:\n', [Regex.ARIA_HARDCODED_LABEL]);
            }
            if (data.match(Regex.CONFIRM_SCREEN)) {
              reporter(data, fileName,
                'Calling of confirm-screen is not proper, call it by showDetails method. %d File(s) will be deleted:\n', [Regex.CONFIRM_SCREEN], true);
            }
            if (data && data.match(Regex.RB_INVALID_VALUE)) {
              reporter(data, fileName,
                'Wrong key values are used in resource bundle. %d File(s) deleted:\n', [Regex.RB_INVALID_VALUE]);
            }
            if (data.match(Regex.RB_INVALID_IMPORT)) {
              reporter(data, fileName,
                'Always import resource bundle by ojL10N. %d File(s) deleted:\n', [Regex.RB_INVALID_IMPORT]);
            }
          }
        }
      }).then(function () {
        resolve('Done');
        console.timeEnd('checkHTML');
      }).catch(function (err) {
        throw (err);
      });
    });
  });
}

function runChecks(fileObj) {
  Promise.all([checkResourceBundles(fileObj.resourceBundles), checkBindings(fileObj.bindings), checkHTML(fileObj.html), checkSCSS(fileObj.scss), (isDevMode ? Promise.resolve() : checkCSS(fileObj.css))]).then(values => {
    if (isVerbose) {
      logger(errors);
    }
    commitCache(function (err) {
      if (err) throw err;
      console.log(`Cache efficiency: ${((cacheHit/(cacheHit + cacheMiss))*100).toFixed(2)}% (${cacheHit}/${cacheHit + cacheMiss})`);
      if (errorEncountered) {
        console.log('\u2717 Checks failed.');
        console.timeEnd('Total time');
        process.exit(1);
      } else {
        console.log('\u2713 All pre-build checks passed');
        console.timeEnd('Total time');
      }
    })
  });
}

function reporter(data, fileName, errorMessage, patterns, warning) {
  warning = warning || false;
  var symbol = warning ? '\n\u26A1 Warning: ' : '\n\u2717 ';
  errorMessage = symbol + errorMessage;
  errors[errorMessage] = errors[errorMessage] || [];
  if (!warning) {
    errorEncountered = true;
  }
  if (fileCache[fileName]) fileCache[fileName].hasErrors = true;
  if (Array.isArray(patterns)) {
    for (var object of patterns) {
      if (data.match(object)) {
        fileName += `  at ${data.match(object)[0].trim()} ${computePosition(data, object)}, index: ${data.match(object).index}`;
      }
    }
  } else {
    fileName += ` at "${patterns}"`;
  }
  errors[errorMessage].push(fileName);
}

function logger(errors) {
  for (var errorInstance in errors) {
    if (errors.hasOwnProperty(errorInstance)) {
      console.log(errorInstance, errors[errorInstance].length);
      for (var l = errors[errorInstance].length, i = l; i--;) {
        console.log(errors[errorInstance][i]);
      }
      console.log('\u2504'.repeat(50));
    }
  }
}

function computePosition(data, match) {
  var lineNumber = 0,
    columnNumber = 0;
  data.split('\n').forEach(function (line, number) {
    if (match.exec(line)) {
      columnNumber = match.exec(line).index + 1;
      lineNumber += number + 1;
    }
  });
  return `line: ${lineNumber}, column: ${columnNumber}`;
}

function readSingleFile(fileName, callback) {
  return new Promise(function (resolve, reject) {
    readFile(fileName, 'utf-8', function (err, fileData) {
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
  var promises = [];
  array.forEach(function (item) {
    promises.push(readSingleFile(item, callback));
  });
  return Promise.all(promises);
}