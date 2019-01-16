module.exports = function(grunt) {
  "use strict";
  grunt.config("requirejs", {
    compileComponents: {
      options: {
        baseUrl: "../destInt/",
        mainConfigFile: "../_build/build-config-components.js",
        dir: "../dist",
        keepBuildDir: false,
        optimize: "none",
        preserveLicenseComments: false,
        optimizeCss: "none",
        pragmasOnSave: {
          excludeRequireCss: true
        },
        modules: [{
            name: "text"
          }, {
            name: "ojL10n"
          }, {
            name: "css",
            exclude: ["jquery"]
          }, {
            name: "json",
            exclude: ["text", "framework/js/constants/constants"]
          },
          //__obdx_replace__
        ]
      }
    },
    compileCore: {
      options: {
        baseUrl: "../destInt/",
        name: "require-config",
        optimize: "uglify2",
        //__mobile_replace__
        include: ["knockout",
          "jquery",
          "knockout-mapping",
          "knockout-helper",
          "baseModel",
          "baseService",
          "text",
          "ojs/ojcore",
          "css",
          "framework/js/view-model/generic-view-model",
          "json"
        ],
        excludeShallow: ["text!build.fingerprint"],
        mainConfigFile: "../_build/build-config.js",
        out: "../destInt/tmp/require-config.tmp"
      }
    }
  });
  grunt.registerTask("require", "Modularized requirejs task", function() {
    grunt.task.run(["requirejs"]);
  });
};
