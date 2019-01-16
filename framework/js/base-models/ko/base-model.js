  /**
   * Base Model will be extended by all components. This class has utility methods and variables which are required at a framework level.<br>
   * This file specifies all those functions which are dependent on [KnockoutJS]{@link http://knockoutjs.com}.
   * @module baseModel
   * @requires jquery
   * @requires knockout
   * @requires ojs/ojcore
   * @requires base-model
   * @requires knockout-mapping
   * @requires base-models/validations/validations
   * @requires base-models/ko/formatters
   * @requires base-models/ko/help
   * @requires base-models/ko/custom-bindings
   * @requires knockout-helper
   * @requires framework/js/constants/constants
   * @requires extensions/extension.json
   */
  define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "base-model",
    "base-models/validations/validations",
    "base-models/ko/help",
    "ojL10n!resources/nls/generic",
    "framework/js/constants/constants",
    "text!lzn/manifest",
    "text!extensions/extension.json",
    "base-models/css",
    "extensions/override/obdx-locale",
    "base-models/ko/custom-bindings",
    "knockout-helper",
    "ojs/ojknockout"
  ], function(oj, ko, $, BaseModel, Validations, Help, Locale, Constants, localization, extensions, CSS, obdxLocaleExtension) {
    "use strict";
    /**
     * Base Model will be extended by all components. This class has utility methods and variables which are required at a framework level.<br>
     * This file specifies all those functions which are dependent on [KnockoutJS]{@link http://knockoutjs.com}.
     * @class
     * @alias BaseKOModel
     * @memberof module:baseModel
     */
    var BaseKOModel = function() {
      /**
       * Assign <code>this</code> to <code>self</code>.
       * @member {Object}
       */
      var self = this;

      ko.utils.extend(self, new BaseModel());
      ko.utils.extend(self, new Help(self));
      /**
       * This variable hold the object for current extensions.
       * @type {Object}
       */
      var runTimeLocalization, runTimelocalizationData;
      var Extensions = JSON.parse(extensions);
      var localizationPromise = new Promise(function(resolve) {
        if (localization) {
          require(["text!lzn/" + localization + "/manifest.json"], function(localizationManifest) {
            ko.utils.extend(self, new Validations(JSON.parse(localizationManifest)));
            resolve(JSON.parse(localizationManifest));
          });
        } else {
          ko.utils.extend(self, new Validations());
          resolve();
        }
      });

      /**
       * Knockout Observable which returns boolean true/false depending on whether the screen is large and above.
       * @instance
       * @memberof BaseKOModel
       * @alias large
       * @type {Observable.<Boolean>}
       */
      self.large = ko.observable();

      /**
       * Knockout Observable which returns boolean true/false depending on whether the screen is medium sized only.
       * @instance
       * @memberof BaseKOModel
       * @alias medium
       * @type {Observable.<Boolean>}
       */
      self.medium = ko.observable();

      /**
       * Knockout Observable which returns boolean true/false depending on whether the screen is small only.
       * @instance
       * @memberof BaseKOModel
       * @alias small
       * @type {Observable.<Boolean>}
       */
      self.small = ko.observable();

      /**
       * Knockout Observable which returns boolean true/false depending on whether the screen is extra large and above.
       * @instance
       * @memberof BaseKOModel
       * @alias xl
       * @type {Observable.<Boolean>}
       */
      self.xl = ko.observable();

      /**
       * Create a key in knockout object for mapping plugin.
       * @type {Object}
       */
      require(["knockout-mapping"], function(mapping) {
        ko.mapping = mapping;
      });
      /**
       * The current language of the page as determined from <code>navigator</code> or user requested value picked from <code>sessionStorage</code>.
       * @type {String}
       * @member
       */
      // eslint-disable-next-line no-storage/no-browser-storage
      var language = sessionStorage.getItem("user-locale") || document.getElementsByTagName("html")[0].getAttribute("lang") || "en";

      /**
       * Set the language [lang]{@linkcode BaseKOModel~lang} as locale for <code>oj.Config</code> so that localization for Oracle JET is properly set.
       * @type {Object}
       */
      oj.Config.setLocale(language, function() {
        var direction = Constants.RTL_LOCALES.indexOf(language) === -1 ? "ltr" : "rtl";
        document.getElementsByTagName("html")[0].setAttribute("dir", direction);
        document.getElementsByTagName("html")[0].setAttribute("lang", language);
      });

      var screenSize = {
        xl: "screen and (min-width: 1281px)",
        large: "screen and (min-width: 1024px)",
        medium: "screen and (max-width: 1023px) and (min-width: 768px)",
        small: "screen and (max-width: 767px)"
      };

      function setScreenSize(mediaQuery) {
        Object.keys(screenSize).forEach(function(key) {
          if (screenSize[key].replace(/\s/g, "") === mediaQuery.media.replace(/\s/g, "")) {
            self[key](mediaQuery.matches);
          }
        });
        return mediaQuery;
      }
      Object.keys(screenSize).forEach(function(key) {
        setScreenSize(window.matchMedia(screenSize[key])).addListener(setScreenSize);
      });

      /**
       * Array to store the list of authorized components for a particular user which will be consumed by
       * [knockout custom component loader]{@linkcode BaseKOModel~componentCustomLoader}.
       * @instance
       * @memberof BaseKOModel
       * @alias authorisedCompoList
       * @type {Observable.<Array>}
       */
      self.authorisedCompoList = ko.observableArray([]);

      /**
       * Observable to store the time at which the last middleware request was fired.<br>
       * Declared inside [BaseKOModel]{@linkcode BaseKOModel} but is set in [service base]{@linkcode BaseService~genericCompleteHandler}.
       * @instance
       * @memberof BaseKOModel
       * @alias lastUpdatedTime
       * @type {Observable.<String>}
       */
      self.lastUpdatedTime = ko.observable();
      /**
       * Knockout Custom Component loader to selectively load only those components which are specified in [authorisedCompoList]{@linkcode BaseKOModel#authorisedCompoList}.<br>
       * For more details, refer the [official KnockoutJS documentation]{@link http://knockoutjs.com/documentation/component-loaders.html#custom-component-loader}.
       * @type {Object}
       * @member
       */
      var componentCustomLoader = {
        loadComponent: function(name, componentConfig, callback) {
          localizationPromise.then(function(Localization) {
            if (componentConfig.module !== "core" && Extensions.components.indexOf(componentConfig.module + "/" + name) > -1) {
              componentConfig.basePath = "extensions/components";
            } else if (runTimelocalizationData && componentConfig.basePath === "components" && runTimelocalizationData.components.indexOf(componentConfig.module + "/" + name) > -1) {
              componentConfig.basePath = "lzn/" + runTimeLocalization + "/components";
            } else if (Localization && componentConfig.basePath === "components" && Localization.components.indexOf(componentConfig.module + "/" + name) > -1) {
              componentConfig.basePath = "lzn/" + localization + "/components";
            }
            var componentPath = componentConfig.basePath + "/" + componentConfig.module + "/" + name + (Constants.buildFingerPrint.timeStamp ? "" : "/loader");
            ko.components.defaultLoader.loadComponent(name, {
              require: (componentConfig.compLoader ? componentConfig.compLoader(name, componentConfig, componentPath) : componentPath)
            }, callback);
          });
        }
      };

      /**
       * Set the custom loader [componentCustomLoader]{@linkcode BaseKOModel~componentCustomLoader} as the primary Knockout component loader.
       * @type {Boolean}
       */
      ko.components.loaders.unshift(componentCustomLoader);

      /**
       * Using deferUpdates as true reduces the UI clutter. Notifications happen asynchronously, immediately after the current task and generally before any UI redraws.
       * But you should take care because it will break code that depends on synchronous updates or on notification of intermediate values. Recommended workaround is using <b>ko.tasks.runEarly()</b>.
       * @type {Boolean}
       */
      ko.options.deferUpdates = true;

      /**
       * The function to wrap a variable as an observable.
       * In case the value is already an observable, then the variable is not wrapped.
       * @instance
       * @function checkAndBindObservable
       * @memberof BaseKOModel
       * @param {Object} attr - The variable whose which has to be wrapped as an observable.
       * @param {Object} value - The default value of to initialize the variable with in case it is undefined.
       * @returns {Observable.<*>} - The variable wrapped as an observable.
       */
      self.checkAndBindObservable = function(attr, value) {
        return ko.observable(ko.utils.unwrapObservable(attr) || value || "");
      };

      /**
       * This function is used to register a knockout component.<br>
       * Once a knockout component is registered, it can be used as a reusable template wherever required,
       * wherein both the component's template and view model shall be loaded.
       *
       * @function registerComponent
       * @instance
       * @param {String} componentId  - The name of the component.
       * @param {object} moduleId - The module name the component is a part of.
       * @param {object} compLoader    - Callback for component loader to be used while component registration.
       * @memberof BaseKOModel
       * @return {void}
       */
      self.registerComponent = function(componentId, moduleId, compLoader) {
        var basePath = "components";
        if (!ko.components.isRegistered(componentId)) {
          ko.components.register(componentId, {
            basePath: basePath,
            module: moduleId,
            compLoader: compLoader
          });
        }
      };

      /**
       * This function is used to register a OBDX core elements.<br>
       * Once a knockout component is registered, it can be used as a reusable template wherever required,
       * wherein both the component's template and view model shall be loaded.
       *
       * @function registerElement
       * @instance
       * @param {String} components  - The name of the component.
       * @param {object} [moduleId = 'api'] - The module name the component is a part of.
       * @memberof BaseKOModel
       * @return {void}
       */
      self.registerElement = function(components, moduleId) {
        var basePath = "framework/elements";
        if (!Array.isArray(components)) components = [components];
        components.forEach(function(componentId) {
          if (!ko.components.isRegistered(componentId)) {
            ko.components.register(componentId, {
              basePath: basePath,
              module: moduleId || "api"
            });
          }
        });
      };

      /**
       * Converts a javascript object to JSON string implemenation.<br>
       * Uses [trimPayload]{@linkcode BaseModel#trimPayload} as replacer function for <code>JSON.stringify</code>.
       * @function removeTempAttributes
       * @instance
       * @memberof BaseKOModel
       * @param  {Object} data The javascript object to be converted.
       * @return {String}      JSON string is returned.
       */
      self.removeTempAttributes = function(data) {
        return JSON.stringify(ko.toJS(data), self.trimPayload);
      };
      self.messages = ko.observableArray();
      var createMessageObject = function(messageList) {
        for (var i = 0; i < messageList.length; i++) {
          if ((messageList[i].code || messageList[i].errorCode) !== "DIGX_UM_042") {
            if ((messageList[i].detail || messageList[i].errorMessage) && !self.messages().filter(function(element) {
                return (element.summary === messageList[i].code) || (element.summary === messageList[i].errorCode);
              }).length) {
              self.messages.push({
                "detail": self.characterEncoding({
                  message: messageList[i].detail || messageList[i].errorMessage
                }).message,
                "severity": (messageList[i].type || "ERROR").toLowerCase(),
                "summary": messageList[i].code || messageList[i].errorCode,
                "id": Math.ceil((Math.random() * 9999999999) + 1)
              });
            }
          }
          createMessageObject(messageList[i].relatedMessage || []);
        }
      };
      /**
       * This function is used to display the server side error message or devloper configured messages.<br>
       * Registers and opens a new component <code>message-box</code> for displaying the error messages.
       * @function showMessages
       * @memberof BaseKOModel
       * @instance
       * @param {Object} jqXHR  - The jqXHR object of the ajax call.<br>
       *                          Used to extract server sent error messages by [service base]{@linkcode BaseService~genericCompleteHandler}.
       * @param {Array.<String>} errors  - Sets the custom error message(s) to be thrown.<br>
       *                                  The server needn't throw any error, set this property to thow user customized message(s).<br>Pass <code>null</code> as first argument in such cases.
       * @param {String} messageType - The type of message intended, is compulsory if custom message is being thrown.<br>
       *                               Can assume following values,
       *                               <code>ERROR</code>, <code>INFO</code>, <code>SUCCESS</code> or <code>NOTIFICATION</code>.
       * @param {Function} [onClose] - Function to be called when message box opened by this function is closed.
       * @returns {void}
       */
      self.showMessages = function(jqXHR, errors, messageType, onClose) {
        var i = 0;
        if (errors && errors.length > 0) {
          for (i = 0; i < errors.length; i++) {
            self.messages.push({
              "detail": self.characterEncoding({
                message: errors[i]
              }).message,
              "severity": messageType.toLowerCase(),
              "onClose": onClose,
              "id": Math.ceil((Math.random() * 9999999999) + 1)
            });
          }
        } else if (jqXHR && jqXHR.responseJSON) {
          if (jqXHR.responseJSON.message) {
            if (jqXHR.responseJSON.message.validationError) {
              createMessageObject(jqXHR.responseJSON.message.validationError);
            } else {
              createMessageObject([jqXHR.responseJSON.message]);
            }
          }
          if (jqXHR.responseJSON.status && jqXHR.responseJSON.status.message) {
            createMessageObject([jqXHR.responseJSON.status.message]);
          }
        }
      };
      self.authViewModel = ko.observable();
      self.onTFAScreen = ko.observable(false);
      /**
       * Generic method to invoke authorization screen (OTP Screen, HOTP Screen, etc).
       * @param  {Object} jqXHR                  The jqXHR object of the ajax call.
       * @param  {Object} context                The context of the request to be passed forward.
       * @param  {Function} requestFunction        The request function to invoke the middleware request again with authorization credentials.<br>
       *                                         Can be [fireAjax]{@linkcode BaseService#fireAjax} or [getNonceForServiceInstance]{@linkcode BaseService~getNonceForServiceInstance}.
       * @param  {Function} successHandlerFunction The success handler of the middleware request.
       * @returns {void}
       */
      self.showAuthScreen = function(jqXHR, context, requestFunction, successHandlerFunction) {
        self.authViewModel({
          serverResponse: jqXHR,
          currentContext: context,
          fireRequest: requestFunction,
          originalSuccess: successHandlerFunction
        });
        self.registerComponent("generic-authentication", "base-components");
        if (context.url.substr(0, context.url.indexOf("?")) === "me") {
          CSS.loadCSS(Promise.resolve());
        }
        self.onTFAScreen(true);
      };

      /**
       * Switch the language of the application.
       * @function setLocale
       * @instance
       * @memberof BaseKOModel
       * @param {String} newLanguage  - The language to be set.<br>
       *                             Use valid <code>ISO 639-1</code> language code.
       * @returns {void}
       */
      self.setLocale = function(newLanguage) {
        if (language !== newLanguage) {
          // eslint-disable-next-line no-storage/no-browser-storage
          sessionStorage.setItem("user-locale", newLanguage);
          window.location.reload();
        }
      };

      /**
       * This method used for getting server date time on user desired format
       * @function getDate
       * @instance
       * @memberof BaseKOModel
       * @param {String} [dateType] - Desired format of server date.<br>
       *                             Use valid <code>ISO 639-1</code> language code.
       * @returns {Date}
       */
      self.getDate = function(dateType) {
        var date = new Date(Constants.currentServerDate.getTime());
        if (Constants.timezoneOffset) {
          date.setMinutes(date.getMinutes() + date.getTimezoneOffset() + (-1 * Constants.timezoneOffset));
        }
        switch (dateType) {
          case "DATE_TIME":
            return date;
          default:
            return new Date(date.toDateString());
        }
      };

      /**
       * Returns the <code>ISO 639-1</code> of the current language of the application.
       * @function getLocale
       * @instance
       * @memberof BaseKOModel
       * @return {String} The <code>ISO 639-1</code> code of the language.
       */
      self.getLocale = function() {
        return oj.Config.getLocale();
      };

      /**
       * Extends the formatter instance returned from dashboard-binding.
       * @param  {Formatter} Formatter Instance of {@linkcode Formatter}.
       * @returns {void}
       */
      self.setFormatter = function(Formatter) {
        return localizationPromise.then(function(Localization) {
          return ko.utils.extend(self, new Formatter(Localization));
        });
      };
      function applyExtensions(){
        self.updateValidation(obdxLocaleExtension);
        self.updateFormatter(obdxLocaleExtension);
      }
      self.updateLocalization = function(lzn, metaData) {
        if (lzn) {
          runTimeLocalization = lzn;
          runTimelocalizationData = metaData;
          self.updateValidation(metaData.obdxLocale);
          self.updateFormatter(metaData.obdxLocale);
        }
        applyExtensions();
      };

      /**
       * The global error handler for RequireJS.<br>
       * To detect errors that are not caught by local errbacks, this overridden implementation of <code>requirejs.onError()</code> is used.
       * @function onError
       * @inner
       * @callback
       * @memberof BaseKOModel
       * @param  {Object} err The error object returned by RequireJS.
       * @returns {void}
       */
      require.onError = function(err) {
        // eslint-disable-next-line no-console
        console.error(err);
        if (err.requireType === "timeout" || err.requireType === "scripterror") {
          self.showMessages(null, [Locale.error], "ERROR", function() {
            window.location.reload();
          });
        }
      };
    };
    /**
     * Holds the instance of [BaseKOModel]{@linkcode BaseKOModel}
     * @memberof module:baseModel
     * @inner
     * @type {BaseKOModel}
     */
    var instance;
    return {
      /**
       * Get the base model instance. Checks [instance]{@linkcode module:baseModel~instance} for instance.
       * @function getInstance
       * @memberof module:baseModel
       * @static
       * @returns {BaseKOModel} The base service instance.
       */
      getInstance: function() {
        if (!instance) {
          instance = new BaseKOModel();
        }
        return instance;
      }
    };
  });
