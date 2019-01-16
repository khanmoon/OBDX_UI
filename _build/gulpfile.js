var gulp = require("gulp");
const promisify = require("util").promisify;
const sassRender = promisify(require("node-sass").render);
const writeFile = promisify(require("fs").writeFile);
const readFile = promisify(require("fs").readFile);
const glob = promisify(require("multi-glob").glob);
const path = require("path");
const notifier = require('node-notifier');
var state = 0;

gulp.task("auto-sass", function() {
  "use strict";
  gulp.watch(["../components/**/*.scss", "../framework/elements/**/*.scss", "../lzn/**/*.scss"]).on('change', function(file) {
    console.time("Time taken");
    return collateInputOutput([file.path]).then(() => {
      console.timeEnd("Time taken");
      state--;
      if (state === 0) {
        notifier.notify({
          title: 'Auto SASS',
          icon: path.join(__dirname, 'sass.png'),
          message: "Issue fixed"
        });
      }
    }).catch(err => {
      console.error(err);
      state++;
      notifier.notify({
        title: 'Auto SASS Error',
        icon: path.join(__dirname, 'sass.png'),
        message: `File: ${path.parse(file.path).name}\n${err.formatted}`
      });
    });
  });
  gulp.watch(["../framework/sass/**/*.scss"]).on('change', function(file) {
    console.time("Time taken");
    return collateInputOutput([], true).then(() => {
      console.timeEnd("Time taken");
      state--;
      if (state === 0) {
        notifier.notify({
          title: 'Auto SASS',
          icon: path.join(__dirname, 'sass.png'),
          message: "Issue fixed"
        });
      }
    }).catch(err => {
      console.error(err);
      state++;
      notifier.notify({
        title: 'Auto SASS Error',
        icon: path.join(__dirname, 'sass.png'),
        message: `File: ${path.parse(file.path).name}\n${err.formatted}`
      });
    });
  });
});

gulp.task('default', ['auto-sass']);

function collateInputOutput(inputFiles, isMainSCSS) {

  var promises = [];
  if (isMainSCSS) {
    promises.push(compileSASS('../framework/sass/main.scss', '../framework/css/main.css', isMainSCSS));
  } else {
    inputFiles.forEach((file, index) => {
      promises.push(compileSASS(file, file.replace(/\.scss$/, ".css")));
    });
  }

  return Promise.all(promises);
}

function compileSASS(inputFile, outputFile, isMainSCSS) {
  return readFile(inputFile, "utf8").then(contents => {
    return sassRender({
	  file: inputFile,
      data: isMainSCSS ? contents : `@import "utils";\n.${path.parse(outputFile).name}-container{${contents}}`,
      includePaths: ["../framework/sass/"],
      outputStyle: 'compressed',
      sourceMap: true,
      sourceMapEmbed: true
    }).then(result => writeFile(outputFile, result.css, "utf8"));
  });
}
