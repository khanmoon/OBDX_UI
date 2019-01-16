var script = require("./libs/globbing");
var fs = require("fs");
fs.mkdir("grunt", function (err) {
    "use strict";
    if (err) throw err;
    script().then(function (results) {
        fs.readFile("render-requirejs/libs/requirejs-template.js", "utf8", function (err, data) {
            if (err) throw err;
            var result = data.replace(/\/\/__obdx_replace__/ig, (results));
            if(process.argv[2]) result = result.replace(/\/\/__mobile_replace__/ig, "exclude:[\"css!framework/css/obdx-font\"],");
            fs.writeFile("grunt/requirejs.js", result, "utf8", function (err) {
                if (err) throw err;
                console.log("\u2713 requirejs file rendered successfully!");
            });
        });
    });
});
