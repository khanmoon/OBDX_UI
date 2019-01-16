module.exports = function (grunt) {
  require('time-grunt')(grunt);
  const sass = require('node-sass');

  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-cache-bust');
  grunt.loadNpmTasks('grunt-cwebp');
  grunt.loadNpmTasks('grunt-css-mqpacker');
  grunt.loadNpmTasks('grunt-css-clean');
  grunt.loadNpmTasks('grunt-newer');
  require("matchdep").filterAll("grunt-contrib-*").forEach(grunt.loadNpmTasks);
  grunt.initConfig({
    properties: grunt.file.readJSON('properties.json'),
    fileCleanup: grunt.file.readJSON('fileCleanup.json'),
    eslintJSDoc: grunt.file.readJSON('eslint-jsdoc.json'),
    uglify: {
      components: {
        files: [{
          cwd: "../",
          expand: true,
          src: ["./extensions/**/*.js", "./resources/**/*.js", "./components/**/*.js", "./lzn/**/*.js"],
          dest: "../destInt/"
        }]
      },
      core: {
        files: [{
          cwd: "../",
          expand: true,
          src: ["./framework/**/*.js", "./web-analytics/**/*.js", '!./framework/js/pages/security.js', '!./framework/js/libs/**'],
          dest: "../destInt/"
        }]
      }
    },
    htmlmin: {
      min: {
        options: {
          removeComments: true,
          ignoreCustomComments: [
            /^\s+ko/,
            /\/ko\s+$/
          ],
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
          minifyURLs: true,
          keepClosingSlash: true
        },
        files: [{
          cwd: "../",
          expand: true,
          src: ['./{components,partials,extensions,lzn,pages,third-party}/**/*.html', './framework/elements/**/*.html', './index.html', './oauthredirect.html'],
          dest: "../destInt/"
        }]
      }
    },
    'string-replace': {
      genericReplacements: {
        files: [{
          src: '../destInt/pages/home.html',
          dest: '../destInt/pages/home.html'
        }, {
          src: '../destInt/index.html',
          dest: '../destInt/index.html'
        }, {
          src: '../destInt/framework/js/pages/require-config.js',
          dest: '../destInt/framework/js/pages/require-config.js'
        }, {
          src: '../destInt/framework/js/base-models/validations/obdx-locale.js',
          dest: '../destInt/framework/js/base-models/validations/obdx-locale.js'
        }, {
          src: '../destInt/framework/js/base-models/base-model.js',
          dest: '../destInt/framework/js/base-models/base-model.js'
        }, {
          src: '../destInt/framework/css/main.css',
          dest: '../destInt/framework/css/main.css'
        }, {
          src: '../destInt/framework/css/loader.css',
          dest: '../destInt/framework/css/loader.css'
        }, {
          src: '../destInt/framework/css/obdx-font.css',
          dest: '../destInt/framework/css/obdx-font.css'
        }, {
          src: '../destInt/components/login/login-form-web/login-form-web.js',
          dest: '../destInt/components/login/login-form-web/login-form-web.js'
        }, {
          src: '../destInt/components/wallet-external/add-fund/add-fund.js',
          dest: '../destInt/components/wallet-external/add-fund/add-fund.js'
        }, {
          src: '../destInt/components/wallet/add-payment-mode/add-payment-mode.js',
          dest: '../destInt/components/wallet/add-payment-mode/add-payment-mode.js'
        }, {
          src: '../destInt/components/social-media/facebook/facebook.js',
          dest: '../destInt/components/social-media/facebook/facebook.js'
        }, {
          src: '../destInt/components/social-media/linkedin/linkedin.js',
          dest: '../destInt/components/social-media/linkedin/linkedin.js'
        }, {
          src: '../destInt/components/inputs/map/map.js',
          dest: '../destInt/components/inputs/map/map.js'
        }, {
          src: '../destInt/components/location-maintenance/location-add/location-add.js',
          dest: '../destInt/components/location-maintenance/location-add/location-add.js'
        }, {
          src: '../destInt/components/location-maintenance/location-update/location-update.js',
          dest: '../destInt/components/location-maintenance/location-update/location-update.js'
        }, {
          src: '../destInt/components/atm-branch-locator/locator/locator.js',
          dest: '../destInt/components/atm-branch-locator/locator/locator.js'
        }, {
          src: '../destInt/components/payments/payment-peer-to-peer/payment-peer-to-peer.js',
          dest: '../destInt/components/payments/payment-peer-to-peer/payment-peer-to-peer.js'
        }, {
          src: '../destInt/framework/js/constants/constants.js',
          dest: '../destInt/framework/js/constants/constants.js'
        }, {
          src: '../destInt/components/home/mobile-landing/mobile-landing.js',
          dest: '../destInt/components/home/mobile-landing/mobile-landing.js'
        }],

        options: {
          replacements: [{
            pattern: /@@RESOURCE_BASE_PATH/g,
            replacement: '<%= properties.resource_base_path %>'
          }, {
            pattern: /@@IMAGE_RESOURCE_PATH/g,
            replacement: '<%= properties.image_base_path %>'
          }, {
            pattern: /@@BRAND_RESOURCE_PATH/g,
            replacement: '<%= properties.brand_base_path %>'
          }, {
            pattern: /@@APPLICATION_BASE_URL/g,
            replacement: '<%= properties.application_base_url %>'
          }, {
            pattern: /@@OAM_BASE_URL/g,
            replacement: '<%= properties.oam_base_url %>'
          }, {
            pattern: /@@OBDX_BASE_PATH/g,
            replacement: '<%= properties.obdx_base_path %>'
          }, {
            pattern: /@@localCurrency/g,
            replacement: '<%= properties.localCurrency %>'
          }, {
            pattern: /@@FB_SDK_URL/g,
            replacement: '<%= properties.fb_sdk_url %>'
          }, {
            pattern: /@@LINKEDIN_SDK_URL/g,
            replacement: '<%= properties.linkedin_sdk_url %>'
          }, {
            pattern: /@@FB_API_KEY/g,
            replacement: '<%= properties.fb_api_key %>'
          }, {
            pattern: /@@LINKEDIN_API_KEY/g,
            replacement: '<%= properties.linkedin_api_key %>'
          }, {
            pattern: /@@GOOGLE_MAP_SDK/g,
            replacement: '<%= properties.google_map_sdk %>'
          }, {
            pattern: /@@GOOGLE_MAP_URL/g,
            replacement: '<%= properties.google_map_url %>'
          }, {
            pattern: /@@FB_SEND_MESSAGE_API/g,
            replacement: '<%= properties.fb_send_message_api %>'
          }, {
            pattern: /@@DEFAULT_APP_VERSION/g,
            replacement: '<%= properties.default_application_version %>'
          }, {
            pattern: /@@SECURE_PAGE/g,
            replacement: '<%= properties.secure_page %>'
          }, {
            pattern: /@@PUBLIC_PAGE/g,
            replacement: '<%= properties.public_page %>'
          }, {
            pattern: /@@DEFAULT_ENTITY/g,
            replacement: '<%= properties.default_entity %>'
          }, {
            pattern: /@@WEB_ANALYTICS/g,
            replacement: '<%= properties.web_analytics %>'
          }, {
            pattern: /@@BUST_ARGS/g,
            replacement: Date.now()
          }, {
            pattern: /@@AXE_URL/g,
            replacement: '<%= properties.axe_url %>'
          }, {
            pattern: /@@ochat_socket_url/g,
            replacement: '<%= properties.ochat_socket_url %>'
          }, {
            pattern: /@@chatbot_id/g,
            replacement: '<%= properties.chatbot_id %>'
          }]
        }
      }
    },
    eslint: {
      default: {
        options: {
          configFile: './.eslintrc.json',
          cache: true,
          cacheLocation: '.defaulteslintcache'
        },
        src: ['../components/**/*.js', '../lzn/**/*.js', '../resources/**/*.js', '../framework/js/**/*.js', '../framework/elements/**/*.js', '../extensions/**/*.js', '!../framework/js/workers/**', '!../framework/js/libs/**']
      },
      jsdoc: {
        options: {
          useEslintrc: false,
          rules: {
            'require-jsdoc': 2,
            'valid-jsdoc': 2
          },
          cache: true,
          cacheLocation: '.jsdoceslintcache'
        },
        src: '<%= eslintJSDoc.jsdoc %>'
      }
    },
    cwebp: {
      dynamic: {
        options: {
          q: 95
        },
        files: [{
          expand: true,
          cwd: '../images',
          src: ['**/*.{png,jpg,jpeg}'],
          dest: '../destInt/images'
        }]
      }
    },
    css_mqpacker: {
      main: {
        options: {
          map: false
        },
        expand: true,
        cwd: '../destInt/',
        src: ['{components,lzn,extensions}/**/*.css', 'framework/elements/**/*.css', 'framework/css/*.css'],
        dest: '../destInt/'
      }
    },
    css_clean: {
      main: {
        options: {
          level: 2
        },
        expand: true,
        cwd: '../destInt/',
        src: ['{components,lzn,extensions}/**/*.css', 'framework/elements/**/*.css', 'framework/css/*.css'],
        dest: '../destInt/'
      }
    },
    sass: {
      bundle: {
        options: {
          implementation: sass,
          sourcemap: 'none',
          outputStyle: 'compressed'
        },
        files: {
          '../destInt/framework/css/main.css': '../framework/sass/main.scss',
          '../destInt/framework/css/loader.css': '../framework/sass/loader.scss',
          '../destInt/framework/css/obdx-font.css': '../framework/sass/obdx-font.scss'
        }
      }
    },
    copy: {
      core: {
        files: [{
          cwd: '../',
          expand: true,
          src: ['./framework/js/pages/security.js', './framework/js/libs/**', "./framework/css/**"],
          dest: '../destInt/'
        }]
      },
      misc: {
        files: [{
          cwd: '../',
          expand: true,
          src: ["./**/*.json", "./webhelp/**", "./images/**", "./build.fingerprint", "./lzn/manifest", "./sw.js", "!./_build/**", "!./destInt/**", "!./dist/**"],
          dest: '../destInt/'
        }]
      }
    },
    clean: {
      options: {
        'force': true
      },
      postBuildCleanUp: '<%= fileCleanup.postBuildCleanUp %>',
      stringReplaceCleanup: '<%= fileCleanup.stringReplace %>'
    },
    cacheBust: {
      taskName: {
        options: {
          baseDir: '../dist/',
          assets: ['framework/js/pages/require-config.js', 'sw.js'],
          algorithm: 'sha512'
        },
        files: [{
          expand: true,
          cwd: '../dist/',
          src: ['index.html', '**/home.html']
        }]
      }
    },
    concurrent: {
      cssCleanup: ['css_mqpacker', 'css_clean'],
      eslint: ["eslint:default", "eslint:jsdoc"],
      require: ["requirejs:compileComponents", "requirejs:compileCore"],
      generateWorkspace: {
        tasks: [
          "newer:copy:core", "newer:copy:misc", 'newer:htmlmin', 'cwebp',
          'newer:uglify:components', 'newer:uglify:core',
          'sass:bundle', 'componentCSS'
        ],
        options: {
          limit: 4,
          logConcurrentOutput: true
        }
      },
      finalize: ['clean:postBuildCleanUp', 'clean:stringReplaceCleanup', 'cacheBust']
    }
  });
  grunt.loadTasks('grunt');

  grunt.registerTask('default', ['checkBuildParameters', 'concurrent:eslint', 'concurrent:generateWorkspace', 'concurrent:cssCleanup', 'inlinecss', 'string-replace:genericReplacements', 'concurrent:require', 'fileMove', 'concurrent:finalize']);

  grunt.registerTask('inlinecss', 'Inline the loader css', function () {
    var loader = grunt.file.read('../destInt/framework/css/loader.css'),
      index = grunt.file.read('../destInt/index.html'),
      home = grunt.file.read('../destInt/pages/home.html');
    grunt.file.write('../destInt/index.html', index.replace(/<link data-embed.*?loader\.css.*?>/, `<style>${loader}</style>`));
    grunt.file.write('../destInt/pages/home.html', home.replace(/<link data-embed.*?loader\.css.*?>/, `<style>${loader}</style>`));
  });

  grunt.registerTask('fileMove', 'Move the require-config to proper location', function () {
    grunt.file.copy("../destInt/tmp/require-config.tmp", "../dist/framework/js/pages/require-config.js");
  });

  grunt.registerTask('checkBuildParameters', 'Check whether essential build parameters are set or not', function () {
    let properties = grunt.file.readJSON('properties.json'),
      essentialKeys = [
        "resource_base_path", "image_base_path", "brand_base_path", "application_base_url", "default_application_version", "secure_page", "public_page", "default_entity"
      ];
    essentialKeys.forEach(key => {
      if (properties[key] === "" || properties[key] == null || (properties[key] != null && properties[key].trim() === "")) {
        grunt.fatal(`Key "${key}" not found in properties.json. Please reconfigure the parameters and run the build again.`, 1);
      }
    });
  });

  grunt.registerTask('componentCSS', 'Compile the component CSS', function (path) {
    require("./component-sass")(grunt, path);
  });

  //mobilebuild tasks

  grunt.registerTask('mobilebuild', ['concurrent:eslint', 'concurrent:generateWorkspace', 'componentCSS:mobile_properties', 'concurrent:cssCleanup', 'mobile-build:imagePath', 'inlinecss', 'mobile-build:replace', 'concurrent:require', 'fileMove', 'concurrent:finalize']);

  grunt.registerTask('mobile-build', 'make mobile specific code changes', function (arg1) {
    grunt.loadTasks('mobile');
    grunt.log.writeln('mobile tasks loaded');
    if (arg1 === "replace") {
      grunt.log.writeln("Running: string-replace:genericReplacements");
      grunt.task.run('string-replace:genericReplacements');
    } else if (arg1 === "imagePath") {
      grunt.log.writeln("Running: string-replace:cssMobileAppReplacements");
      grunt.task.run('string-replace:cssMobileAppReplacements');
    }
  });

  grunt.registerTask('mobile-dev', 'make unminified ios src code changes', function () {
    grunt.loadTasks('mobile');
    grunt.log.writeln('mobile-dev tasks loaded');
    grunt.log.writeln("Running: mobile dev ui changes");
    grunt.task.run('copy:dev-copy-mobile');
    grunt.task.run('sass:bundle');
    grunt.task.run('string-replace:cssMobileAppReplacements');
    grunt.task.run('string-replace:genericReplacements');
  });

};
