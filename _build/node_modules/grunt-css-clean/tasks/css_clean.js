/*
 * grunt-css-clean
 * https://github.com/ilijian/grunt-css-clean
 *
 * Copyright (c) 2015 lijian
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('css_clean', 'Remove duplicated css according to application priority', function() {

    var CleanCSS = require('clean-css');

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      console.log(f.toString());

      f.src.forEach(function(srcpath) {

        if (!grunt.file.exists(srcpath)) {

          grunt.log.warn('Source file "' + srcpath + '" not found.');

        } else {

          var minifiedContent = new CleanCSS().minify(grunt.file.read(srcpath)).styles;
          grunt.file.write(f.dest, minifiedContent);
          grunt.log.writeln('File "' + f.dest + '" created.');

        }

      });
      
    });
    
  });

};
