var fs = require("fs");
var glob = require("multi-glob").glob;
var errorEncountered = false;
glob(["../admin/**/model/*.js",
    "../framework/**/model/*.js",
    "../corporate/**/model/*.js",
    "../retail/**/model/*.js"
  ],
  function(err, files) {
    "use strict";
    if (err) throw err;
    for (var l = files.length, fileIndex = l; fileIndex--;) {
      var data = fs.readFileSync(files[fileIndex], "utf-8");
      if (data) {
        var dependencies = data.match(/[^\]]*/gi)[0].split("[")[1].replace(/(\r\n|\n|\r)/gm, "").split(",");
        for (var length = dependencies.length, i = length; i--;) {
          if (dependencies[i].match(/jquery/) ||
            dependencies[i].match(/baseService/) ||
            dependencies[i].match(/baseLogger/) ||
            dependencies[i].match(/abstractBaseModel/) ||
            dependencies[i].match(/constants\//) ||
            dependencies[i].match(/contact-info\/model/) ||
            dependencies[i].match(/primary-registration\/model/) ||
            dependencies[i].match(/occupation-info\/model/) ||
            dependencies[i].match(/..\/service/)) {
            continue;
          } else {
            console.log("Model violation encountered. File deleted: ", files[fileIndex]);
            errorEncountered = true;
            fs.unlinkSync(files[fileIndex]);
            break;
          }
        }
      }
    }
    if (errorEncountered) {
      process.exit(1);
    } else {
      console.log("\u2713 No model violation encountered");
    }
  });
