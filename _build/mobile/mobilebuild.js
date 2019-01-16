module.exports = function(grunt) {
  "use strict";
  grunt.file.defaultEncoding = 'utf8';
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks('grunt-sass');

  grunt.config.merge({

    properties: grunt.file.readJSON('mobile_properties.json'),

    'string-replace': {
      cssMobileAppReplacements: {
        files: [{
          src: '../destInt/framework/css/main.css',
          dest: '../destInt/framework/css/main.css'
        }],
        options: {
          replacements: [{
            pattern: /@@IMAGE_RESOURCE_PATH/g,
            replacement: '<%= properties["image_css_path_"+grunt.option("platform")]  %>'
          }]
        }
      }
    },

    copy: {
      'dev-copy-mobile': {
        files: [
          // includes files within path and its sub-directories
          {
            cwd: '../',
            expand: true,
            //src: ['./**', '!./_build/**', '!./third-party/**', '!./wallet/**', '!./admin/**', '!./.svn/**', '!./mobile/**', '!./config/**', '!./dist/**', '!./**/node_modules/**', '!./scaffolding/**'],
            // or
            //src: ['./framework/**', './images/**', './retail/**', './corporate/**', './index/**', '!./.svn/**', '!./framework/.svn/**', './images/.svn/**', './retail/.svn/**', './corporate/.svn/**', './index/.svn/**'],
            // or for export
            src: ['./components/**', './extensions/**', './framework/**', './images/**', './index/**', './json/**', './partials/**', './resources/**', './index.html', './manifest.json', './sw.js', './build.fingerprint', './lzn/**'],
            dest: '../destInt/'
          }
        ]
      }
    }

  });
};
