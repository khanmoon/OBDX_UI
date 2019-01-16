module.exports = function(grunt) {
  "use strict";
  grunt.loadNpmTasks("grunt-fixmyjs");
  grunt.initConfig({
    fixmyjs: {
      options: {
        config: ".jshintrc",
        indentpref: "tabs"
      },
      test: {
        files: [{
          expand: true,
          cwd: "../",
          src: ["admin/**/*.js",
            "framework/components/**/*.js",
            "retail/**/*.js",
            "corporate/**/*.js",
            "!./**/node_modules/**"
          ],
          dest: "../"
        }]
      }
    }
  });
};
