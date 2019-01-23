/**
 * Base Model will be extended by all components. This class has utility methods and variables which are required at a framework level.<br>
 * This file specifies all those functions which are not dependent on [KnockoutJS]{@link http://knockoutjs.com}.
 * @module base-model
 */
define(["jquery", "platform", "webAnalytics", "framework/js/constants/constants", "base-models/css"],
  function($, Platform, WebAnalytics, Constants, CSS) {
    "use strict";
    /**
     * Base Model will be extended by all components. This class has utility methods and variables which are required at a framework level.<br>
     * This file specifies all those functions which are not dependent on [KnockoutJS]{@link http://knockoutjs.com}.
     * @class
     * @alias BaseModel
     * @memberof module:base-model
     */
    var baseModel = function BaseModel() {
      /**
       * Assign <code>this</code> to <code>self</code>.
       * @member {Object}
       */
      var self = this;
      var axeInstance = null;
      /**
       * This function trims the payload.
       * @function trimPayload
       * @memberof BaseModel
       * @instance
       * @param  {String} key   The string argument to trim.
       * @param  {String} value The return value.
       * @return {undefined|String}  If the argument contains <code>temp_</code>, return <code>undefined</code> else return the argument as is.
       */
      self.trimPayload = function(key, value) {
        if (key.substring(0, 5) !== "temp_") {
          return value;
        }
      };

      /**
       * Holds the random number for use by [incrementIdCount]{@linkcode BaseModel#incrementIdCount} and [currentIdCount]{@linkcode BaseModel#currentIdCount}
       * @member {Number}
       */
      var idCount = 0;

      /**
       * Creates and returns a random number on each invocation.<br>
       * Useful for dynamic <code>id</code> generation for HTML Elements.
       * @memberof BaseModel
       * @function incrementIdCount
       * @instance
       * @return {Number} The random number returned.
       */
      self.incrementIdCount = function() {
        idCount = Math.floor((Math.random() * 10000) + 1);
        return idCount;
      };

      /**
       * Returns the random number stored by [idCount]{@linkcode BaseModel~idCount}.
       * @memberof BaseModel
       * @function currentIdCount
       * @instance
       * @return {Number} The current value [idCount]{@linkcode BaseModel~idCount} holds.
       */
      self.currentIdCount = function() {
        return idCount;
      };

      /**
       * This function returns the type of cordova device, i.e. <code>iOS</code> or <code>Android</code>.
       * @memberof BaseModel
       * @function cordovaDevice
       * @instance
       * @return {String} The type of cordova device.
       */
      self.cordovaDevice = function() {
        if (window.cordova && window.device) {
          return window.device.platform.toUpperCase();
        }
      };
      self.currentPage = {
        module: "",
        component: ""
      };
      /**
       * Returns a string corresponding to current device size computed via screen width.
       * @function getDeviceSize
       * @instance
       * @memberof BaseModel
       * @return {String} Returns <code>large</code>, <code>medium</code> or <code>small</code>.
       */
      self.getDeviceSize = function() {
        var windowWidth = (window.screen.width < window.innerWidth) ?
          window.screen.width : window.innerWidth;
        if (windowWidth > 1279) {
          return "xl";
        } else if (windowWidth > 1023) {
          return "large";
        } else if (windowWidth > 767) {
          return "medium";
        }
        return "small";

      };

      /**
       * In order to show selected description (not the value) in review screen
       * we need to keep track of selected descriptions for each dropdown, this function
       * will return description based on the key passed.
       *
       * @function getDescriptionFromCode
       * @param {Array} enumArray Array containing all the dropdown values
       * @param {String} selectedCode selected code from dropdown
       * @param {String} codeString optional argument in case code string in array is something other than default ('code')
       * @param {String} descString optional argument in case desc string in array is something other than default ('description')
       * @memberof BaseModel
       * @instance
       * @returns {String} Description of selected value
       */
      self.getDescriptionFromCode = function(enumArray, selectedCode, codeString, descString) {
        var returnVal = "",
          codeStr = codeString || "code",
          descStr = descString || "description",
          i;
        if (enumArray) {
          for (i = 0; i < enumArray.length; i++) {
            if (enumArray[i][codeStr] === selectedCode) {
              returnVal = enumArray[i][descStr];
              break;
            }
          }
        }
        return returnVal;
      };

      /**
       * This function switches the page using <code>window.location.assign()</code> or <code>window.location.replace()</code>.
       *
       * @function switchPage
       * @param {Object} config Object containing the configuration information for switching pages.
       * @param {String} config.module This is the module of the page the user will switch to.
       * @param {String} config.context This is the context of the page the user will switch to.
       * @param {String} config.internal Set this flag to true to load <code>homeComponent</code> within the mobile application.
       * @param {Object} config.homeComponent This object contains information for switching to home components.<br>
       *                                         Be forewarned though, if specified, will ignore <code>module</code> and <code>context</code> specified before.
       * @param {String} config.homeComponent.component The name of the home component.
       * @param {String} config.homeComponent.query The query parameters required to be attached to the URL.
       * @param {String} config.homeComponent.module The module of the home component.
       * @param {Boolean} [isSecure=false] Optional boolean argument that specifies whether the page is secure or public.
       *                                   Defaults to <code>false</code>.
       * @param {Boolean} [historyRequired=true] Optional boolean argument that specifies whether the page is loaded via <code>assign</code> or <code>replace</code>.
       *                                         Defaults to <code>true</code>.
       * @param {Object} urlArgs Optional JS object to be passed to the new page. Alternative for <code>sessionStorage</code>.
       * @memberof BaseModel
       * @instance
       * @returns {Boolean} Returns false.
       * @example
       * switchPage({  module: 'login' }, true); // will switch to login page from pre-login screen
       */
      self.switchPage = function(config, isSecure, historyRequired, urlArgs) {
        isSecure = isSecure || false;
        historyRequired = historyRequired || true;
        var securePage = "/pages/home.html",
          publicPage = "/index.html",
          baseLocation = (isSecure ? securePage : publicPage);
        var parameters = config;
        if (config && config.homeComponent) {
          parameters = {
            homeComponent: config.homeComponent.component,
            homeModule: config.homeComponent.module
          };
          if (config.homeComponent.query) {
            Object.keys(config.homeComponent.query).forEach(function(key) {
              parameters[key] = config.homeComponent.query[key];
            });
          }
        }
        window.onbeforeunload = null;
        Platform.getInstance().then(function(platform) {
          if (config && config.internal) {
            baseLocation = "." + (isSecure ? securePage : publicPage);
          } else {
            var serverURL = platform("getServerURL", true);
            if (serverURL) {
              baseLocation = serverURL + (isSecure ? securePage : publicPage);
            }
          }
          var formattedURLArgs = encodeURIComponent(JSON.stringify(urlArgs) || "");
          if (formattedURLArgs) {
            parameters.OBDX_ARGS = formattedURLArgs;
          }
          window.location[(historyRequired ? "assign" : "replace")](self.QueryParams.add(baseLocation, parameters));
        });
        return false;
      };

      /**
       * @summary Function that tranforms the template of a component to add scoped component CSS.
       * @function transformTemplate
       * @memberof BaseModel
       * @instance
       * @param  {String} template The template of the component.
       * @param  {String} css The CSS of the component.
       * @param  {String} [className] The name of the component.
       * @returns {String} The transformed template string with css inside <code><style></style></code> is returned.
       */
      self.transformTemplate = function(template, css, className) {
        if (!className) {
          return;
        }
        if (!document.querySelector("style#obdx-component-style-" + className)) {
          var element = document.createElement("style");
          element.textContent = CSS.replaceCSS(css);
          element.id = "obdx-component-style-" + className;
          document.querySelector("head").appendChild(element);
        }
        return "<obdx-component class='" + className + "-container'>" + template + "</obdx-component>";
      };

      /**
       * @summary Function that returns the name of the component from the AMD module object.
       * @function getComponentName
       * @memberof BaseModel
       * @instance
       * @param  {Object} module The AMD module object.
       * @returns {String} The name of the component is returned.
       */
      self.getComponentName = function(module) {
        return module.id.split("/")[module.id.split("/").length - 2];
      };

      /**
       * @summary Utility function that returns a formatted string.<br>
       * @description The first argument is a string containing zero or more placeholder tokens.
       * Placeholder tokens are <code>{ }</code>.<br>
       * The next argument should be an <code>Object</code> that contains keys as the tokens used in first argument and values as the values to be substituted.<br><br>
       * This function is commonly used for URL paramterization in [parameterizeURL]{@linkcode BaseService~parameterizeURL}.
       * @function format
       * @memberof BaseModel
       * @instance
       * @param  {String} message    The string containing tokens to be formatted.
       * @param  {Object.<String, String>} parameters The object containing key-wise description for tokens used in <code>message</code>.
       * @param  {Boolean} [isEncoded=false]   The boolean specifying whether the key should be encoded using <code>encodeURIComponent</code> or not.
       *                                       Defaults to false. Use with caution.
       * @returns {String} The formatted string
       * @example
       * self.format('This string needs to be {token}', { token : 'formatted' });
       * // returns "This string needs to be formatted".
       */
      self.format = function(message, parameters, isEncoded) {
        if (!message) {
          throw new ReferenceError("Please specify a valid message");
        }
        if (parameters) {
          var jsonObject = typeof parameters === "string" ? JSON.parse(parameters) : parameters,
            allPropertyNames = Object.keys(jsonObject);

          for (var i = 0; i < allPropertyNames.length; i++) {
            var replacement = jsonObject[allPropertyNames[i]] === void 0 ? "" : jsonObject[allPropertyNames[i]];
            message = message.replace("{" + allPropertyNames[i] + "}", isEncoded ? encodeURIComponent(replacement) : replacement);
          }
        }
        return message;
      };
      self.isEmpty = function(value) {
        return typeof value === "undefined" || value === null || value.length === 0;
      };

      /**
       * Internal function used for obtaining value of nested object's key using string accessor.
       * @protected
       * @memberof BaseModel
       * @function getObjectProperty
       * @param  {Object} object    The object whose value needs to be computed.
       * @param  {String} stringKey The string value of nested property, e.g. <code>'a.b.c.d.e'</code>.
       * @return {*}           The value of the property being accessed.
       */
      function getObjectProperty(object, stringKey) {
        var latestValue = object;
        for (var i = 0, partialKey = stringKey.split("."); i < partialKey.length; i++) {
          latestValue = latestValue[partialKey[i]];
        }
        return latestValue;
      }

      /**
       * Utility function to sort array of objects based on multiple properties.
       * @function sortLib
       * @memberof BaseModel
       * @instance
       * @param  {Array.<Object>} data The array of objects that needs to be sorted.
       * @param  {String|Array} sortBy The property against which sorting is to be performed.<br> A single string value or array of strings.
       *  If an array is passed, the priority of sort is in decreases from left to right.<br>
       *  Say, if you pass <code>['a.b', 'a.c']</code> as the argument, the function will sort the array based on <code>'a.b'</code> first,
       *  then for same values of <code>'a.b'</code>, it will sort those values by <code>'a.c'</code> and so on.<br>
       *  By default, all orders are ascending.
       * @param  {String|Array} order The order which sorting is to be performed. A single string value or array of strings. Values are <code>'asc'</code> or <code>'desc'</code>.
       * If it is an array, it maps one to one to the arguments of [sortLib]{@linkcode BaseModel~sortLib}.
       * In the example <code>self.sortLib(test, ['a.b', 'a.c.d', 'a.e.f.g'], ['desc', 'asc', 'desc'])</code>, <code>'a.b'</code> is sorted in descending order,
       * <code>'a.c.d'</code> in ascending order and <code>'a.e.f.g'</code> in descending order.
       * Defaults to <code>'asc'</code>.
       * @return {Array.<Object>}  The sorted array is returned.
       * @example
       * self.sortLib([{a:{b:2}},{a:{b:6}},{a:{b:1}}], 'a.b');
       * // returns sorted array against the property 'a.b'.
       *
       * self.sortLib(test, ['a.b', 'a.c.d', 'a.e.f.g'], ['desc', 'asc', 'desc']);
       * // uses the unsorted array 'test' and returns sorted array based on the properties, with priority 'a.b', 'a.c.d', 'a.e.f.g',
       * // in descending, ascending and descending order respectively.
       */
      self.sortLib = function(data, sortBy, order) {
        if (!(data && sortBy)) {
          throw new Error("Specify the data source and atleast one property to sort it by");
        }
        if (!Array.isArray(data)) {
          throw new Error("Specify the data source as an array");
        }
        if (!Array.isArray(sortBy)) {
          sortBy = [sortBy];
        }
        if (!Array.isArray(order)) {
          order = [order];
        }
        /**
         * This function converts values of keys to a mathematical comparable format.
         * @param  {Object} data   The object inside array.
         * @param  {String} sortBy The property against which sorting is to be performed.
         * @return {Date|Number|String}        The value of the key in comparable format is returned.
         */
        function parse(data, sortBy) {
          var latestValue = getObjectProperty(data, sortBy);
          if (!latestValue && latestValue !== 0) {
            return Number.NEGATIVE_INFINITY;
          }
          if (typeof latestValue === "string" && latestValue.match(/^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?$/i)) {
            return new Date(latestValue);
          } else if (typeof latestValue === "string") {
            return latestValue.toLowerCase();
          } else if (typeof latestValue === "boolean") {
            return latestValue.toString();
          }
          return latestValue;

        }
        /**
         * Internal function that is called recursively to perform sorting.
         * @function performSort
         * @private
         * @memberof BaseModel#sortLib
         * @param  {String|Array} order The order which sorting is to be performed. A single string value or array of strings. Values are <code>'asc'</code> or <code>'desc'</code>.
         * If it is an array, it maps one to one to the arguments of [sortLib]{@linkcode BaseModel~sortLib}.
         * In the example <code>self.sortLib(test, ['a.b', 'a.c.d', 'a.e.f.g'], ['desc', 'asc', 'desc'])</code>, <code>'a.b'</code> is sorted in descending order,
         * <code>'a.c.d'</code> in ascending order and <code>'a.e.f.g'</code> in descending order.
         * Defaults to <code>'asc'</code>.
         * @param  {String|Array} sortBy The property against which sorting is to be performed.<br> A single string value or array of strings.
         *  If an array is passed, the priority of sort is in decreases from left to right.<br>
         *  Say, if you pass <code>['a.b', 'a.c']</code> as the argument, the function will sort the array based on <code>'a.b'</code> first,
         *  then for same values of <code>'a.b'</code>, it will sort those values by <code>'a.c'</code> and so on.<br>
         *  By default, all orders are ascending.
         * @return {Array}        Sorted array for partial values is returned.
         */
        function performSort(order, sortBy) {
          // eslint-disable-next-line array-callback-return
          return data.sort(function(a, b) {
            for (var i = 0; i < sortBy.length; i++) {
              var currentOrder = sortBy[i];
              var A = parse(a, currentOrder);
              var B = parse(b, currentOrder);
              if ((A < B) || (B === Number.NEGATIVE_INFINITY)) {
                return order[i] ? order[i] === "asc" ? -1 : 1 : -1;
              } else if ((A > B) || (A === Number.NEGATIVE_INFINITY)) {
                return order[i] ? order[i] === "asc" ? 1 : -1 : 1;
              }
            }
            return 0;
          });
        }
        return performSort(order, sortBy);
      };

      /**
       * Utility function to group array of objects based on multiple properties.
       * @function groupBy
       * @instance
       * @memberof BaseModel
       * @param  {Array} array     Array to be grouped.
       * @param  {String|Array} keys      The priority order which grouping is to be performed. A single string value or array of strings.
       * @param  {Function} transform     The transformation function to be applied to keys on which grouping is specified.<br>It is a function which accepts the object from input array and returns an array of specifying transformation for each key level.
       * For example, <code>groupBy(test, ['a', 'b.c' ...], function(item){ return [item.toString() + '~key~1', fn(item.property)...] })</code> where <code>fn</code> is any transformation function.<br>
       * Note that transformation is applied at the output result for transforming input to a consumable output. If used, transformation must be specified for each key level.
       * @return {Array}           The grouped array is returned.
       * @example
       * self.groupBy([{
         "a": 1,
         "b": {
           "c": "C"
         }
       }, {
         "a": 2,
         "b": {
           "c": "D"
         }
       }, {
         "a": 1,
         "b": {
           "c": "C"
         }
       }, {
         "a": 1,
         "b": {
           "c": "A"
         }
       }], 'a');

//returns
       [{
         "key": "1",
         "children": [{
           "key": "C",
           "children": [{
             "a": 1,
             "b": {
               "c": "C"
             }
           }, {
             "a": 1,
             "b": {
               "c": "C"
             }
           }]
         }, {
           "key": "A",
           "children": [{
             "a": 1,
             "b": {
               "c": "A"
             }
           }]
         }]
       }, {
         "key": "2",
         "children": [{
           "key": "D",
           "children": [{
             "a": 2,
             "b": {
               "c": "D"
             }
           }]
         }]
       }]
       */
      self.groupBy = function(array, keys, transform) {
        var groups, transformation;
        return Object.keys((groups = array.reduce(function(accumulator, currentValue) {
          var key = getObjectProperty(currentValue, keys[0]);
          // eslint-disable-next-line no-unused-expressions
          transform ? (transformation = transformation || [], transformation[key] = transform(currentValue)) : null;
          (accumulator[key] = accumulator[key] || []).push(currentValue);
          return accumulator;
        }, {}), keys = JSON.parse(JSON.stringify(keys)), keys.shift(), groups)).map(function(item) {
          return {
            label: transform ? transformation[item][keys.length ? (keys.length - 1) : (transformation[item].length - 1)] : item,
            children: keys[0] ? self.groupBy(groups[item], keys, transform) : groups[item]
          };
        });
      };

      /**
       * In order to show selected description (not the value) in review screen
       * we need to keep track of selected descriptions for each dropdown, this function
       * will return description based on the key passed.
       *
       * @function getDescriptionFromValue
       * @instance
       * @param {Array} enumArray Array containing all the dropdown values
       * @param {String} selectedValue selected code from dropdown
       * @param {String} valueString optional argument in case code string in array is something other than default ('code')
       * @param {String} descString optional argument in case desc string in array is something other than default ('description')
       * @memberof BaseModel
       * @returns {String} description of selected value
       */
      self.getDescriptionFromValue = function(enumArray, selectedValue, valueString, descString) {
        var returnVal = "",
          valueStr = valueString || "value",
          descStr = descString || "description",
          i;
        if (enumArray) {
          for (i = 0; i < enumArray.length; i++) {
            if (enumArray[i][valueStr] === selectedValue) {
              returnVal = enumArray[i][descStr];
              break;
            }
          }
        }
        return returnVal;
      };

      /**
       * Function to get dropdown value of an OJSelect
       * The binding variable of an OJSelect component automatically gets converted to an array by OJ
       * This function will return the value of first item of that array
       *
       * @function getDropDownValue
       * @instance
       * @param {object} dropDownArray  The value mapped to dropdown.
       * @memberof BaseModel
       * @deprecated
       * @returns {object} - The selected value of OJSelect
       */
      self.getDropDownValue = function(dropDownArray) {
        // eslint-disable-next-line no-console
        console.warn("Warning: Deprecated method");
        if (Object.prototype.toString.call(dropDownArray) === "[object Array]") {
          return dropDownArray[0];
        }
        return dropDownArray;

      };

      /**
       * Function to truncate the string passed with ellipsis.
       * @function getVisibleText
       * @instance
       * @memberof BaseModel
       * @param  {String} actualText The string to be truncated.
       * @param  {Number} precision  Number of characters after which string should be truncated. <br>
       *                             If string length is lesser than the <code>precision</code> specified, the original string will be returned.
       * @return {String}            The truncated string is returned.
       * @example
       * self.getVisibleText('This is a very long string that needs to be truncated', 25);
       * // returns "This is a very long str.."
       */
      self.getVisibleText = function(actualText, precision) {
        if (actualText) {
          if (actualText.length <= precision) {
            return actualText;
          }
          return actualText.substring(0, (precision - 2)) + "..";

        }
        return "";

      };

      /**
       * This function checks the response of a batch request and determines if it is an error or not.
       * @function checkBatchResponse
       * @instance
       * @memberof BaseModel
       * @param  {Object} response The response to be checked.
       * @return {Boolean}          <code>true</code> if all requests have succeeded, <code>false</code> otherwise.
       */
      self.checkBatchResponse = function(response) {
        var i, len = response.batchDetailResponseDTOList.length;
        for (i = 0; i < len; i++) {
          if (response.batchDetailResponseDTOList[i].status >= 400) {
            return false;
          }
        }
        return true;
      };

      var element = $("<textarea/>");

      /**
       * Utility function to parse special characters from received response.
       * @inner
       * @function characterEncoding
       * @memberof BaseModel
       * @param  {Object} obj The object received from response containing special characters.
       * @return {Object}     The parsed object is returned.
       */
      self.characterEncoding = function(obj) {
        if (typeof obj === "object") {
          var property;
          for (property in obj) {
            if (obj[property]) {
              if (typeof obj[property] === "object") {
                self.characterEncoding(obj[property]);
              } else if (typeof obj[property] === "string" && obj[property] !== "") {
                obj[property] = element.html(obj[property]).text();
              }
            }
          }
        }
        return obj;
      };

      /**
       * Clears browser's <code>localStorage</code> and <code>sessionStorage</code>, except <code>user-locale</code>, if found in <code>sessionStorage</code>.
       * @function clearStorage
       * @instance
       * @memberof BaseModel
       * @returns {void}
       */
      /* eslint-disable no-storage/no-browser-storage */
      self.clearStorage = function() {
        var locale = sessionStorage.getItem("user-locale");
        localStorage.clear();
        sessionStorage.clear();
        if (locale) {
          sessionStorage.setItem("user-locale", locale);
        }
      };
      /* eslint-enable no-storage/no-browser-storage */

      /**
       * Utility functions for handling query parameters.
       * @typedef {Object} - QueryParams
       * @memberof BaseModel
       * @alias QueryParams
       * @property {Function} add - Adds one or more query parameters
       * @property {Function} get - Returns one or all query parameters
       * @property {Function} remove - Removes one or more query parameters
       */
      self.QueryParams = {
        /**
         * Internal Method for evaluating multiple queries with same key.
         * @function __resolveQuery
         * @private
         * @param  {Object} map   The map of query params.
         * @param  {String} value The query param under consideration.
         * @return {String}       Array of query values with same parameter converted to query parameter format.
         */
        __resolveQuery: function(map, value) {
          if (!Array.isArray(map[value])) return map[value];
          return map[value].reduce(function(accumulator, currentValue, currentIndex, array) {
            return accumulator + (currentIndex === 0 ? "" : (value + "=")) + currentValue + (currentIndex === array.length - 1 ? "" : "&");
          }, "");
        },
        /**
         * Adds the query parameters to existing URL.
         * @function
         * @memberof! BaseModel#QueryParams
         * @alias QueryParams.add
         * @param {String} url The URL to which query parameters are to be added.
         * @param {Object} parameterObject The key value pair object which has keys are query parameter keys and values as query parameter values.
         * @return {String} The URL string with added query parameters.
         */
        add: function(url, parameterObject) {
          var link = document.createElement("a");
          link.href = url;
          var queryMap = link.search ? self.QueryParams.get(void 0, link.search) : {};
          $.extend(queryMap, parameterObject);
          var modifiedQuery = Object.keys(queryMap).reduce(function(accumulator, currentValue, currentIndex, array) {
            return accumulator + currentValue + "=" + self.QueryParams.__resolveQuery(queryMap, currentValue) + (currentIndex === array.length - 1 ? "" : "&");
          }, "");
          link.search = modifiedQuery;
          return url.split("?")[0] + link.search;
        },
        /**
         *  Gets the query parameters from the string URL and returns either a map of query parameter and their values
         *  or the value for a requested query parameter.
         * @function
         * @memberof! BaseModel#QueryParams
         * @alias QueryParams.get
         * @param  {String} param The query parameter for which value is required. If not specified, returns the whole key-value map.
         * @param  {String} str   The URL search string. Do make sure to pass location.search and not location.href for a particular window. Defaults to current window's URL search string.
         * @return {Object|String} If query parameter (param) is specified, returns the query string value for the particular parameter requested or else returns the object map for whole query string.
         */
        get: function(param, str) {
          str = str || window.location.search;
          var ret = Object.create(null);
          if (typeof str !== "string") {
            return ret;
          }
          str = str.trim().replace(/^(\?|#|&)/, "");
          if (!str) {
            return null;
          }
          str.split("&").forEach(function(param) {
            var parts = param.replace(/\+/g, " ").split("=");
            var key = parts.shift();
            var val = parts.length > 0 ? parts.join("=") : undefined;
            val = val === undefined ? null : decodeURIComponent(val);
            if (ret[decodeURIComponent(key)] === undefined) {
              ret[decodeURIComponent(key)] = val;
              return;
            }
            ret[decodeURIComponent(key)] = [].concat(ret[decodeURIComponent(key)], val);
          });

          var result = Object.keys(ret).sort().reduce(function(result, key) {
            var val = ret[key];
            result[key] = val;
            return result;
          }, Object.create(null));
          return param ? result[param] : result;
        },
        /**
         * Remove one or more query parameters from the URL string given.
         * @function
         * @memberof! BaseModel#QueryParams
         * @alias QueryParams.remove
         * @param  {String} url The URL from which query parameters are to be deleted.
         * @param  {Array} keysToDelete Array of keys to delete.
         * @return {String} The URL string with removed query parameters.
         */
        remove: function(url, keysToDelete) {
          var link = document.createElement("a");
          link.href = url;
          var queryMap = self.QueryParams.get(void 0, link.search);
          keysToDelete.forEach(function(deleteKey) {
            delete queryMap[deleteKey];
          });
          return self.QueryParams.add(link.pathname, queryMap);
        }
      };

      /**
       * Listener to focus the button-container on the screen when hotkey <code>Alt + B</code> is pressed.
       * @listens document#keydown
       * @event keydown
       * @param  {Object} event The event object returned by jQuery.
       * @returns {void}
       */
      $(document).keydown(function(event) {
        if (event.keyCode === 66 && event.altKey) {
          event.preventDefault();
          $("div .button-container .action-button-primary").focus();
        }
      });

      /**
       * Listener to click the secondary action button on the screen when hotkey <code>Alt + X</code> is pressed.
       * @listens document#keyup
       * @event keyup
       * @param  {Object} event The event object returned by jQuery.
       * @returns {void}
       */
      $(document).keyup(function(event) {
        if (event.keyCode === 88 && event.altKey && $(".action-button-secondary").length) {
          event.preventDefault();
          $(".action-button-secondary")[0].click();
        }
      });

      if (!("IntersectionObserver" in window)) {
        /**
         * @summary Listener to scroll event to handle lazy image load when <code>IntersectionObserver</code> is not supported by browser.
         * @description This event listener check whether image is in viewport and marks the image to load if it appears in viewport. This event handler is <code>passive</code> in nature.
         * @listens document#scroll
         * @event scroll
         * @returns {void}
         */
        document.addEventListener("scroll", function() {
          var top = $(window).scrollTop();
          var fold = $(window).height() + top;
          var images = Array.prototype.filter.call(document.querySelectorAll("img"), function(element) {
            var elementOffsetTop = $(element).offset().top;
            return element.getAttribute("isLazy") && (element.getAttribute("isLazy") !== "false") && (fold > elementOffsetTop) && (top < elementOffsetTop + $(element).height());
          });
          images.forEach(function(element) {
            element.setAttribute("src", element.getAttribute("lazySrc"));
            element.removeAttribute("lazySrc");
            element.setAttribute("isLazy", "false");
          });
        }, {
          passive: true
        });
      }

      if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
      }
      self.displayAccessibilityIssues = function(violations) {
        // eslint-disable-next-line no-console
        console.groupCollapsed("Accessibility Report");
        var displayWarning = false;
        violations.forEach(function(violation) {
          // eslint-disable-next-line no-console
          console.groupCollapsed(violation.description);
          // eslint-disable-next-line no-console
          console.table(violation.nodes.map(function(element) {
            if (element.impact === "critical" || element.impact === "serious") displayWarning = true;
            return {
              "Summary": element.failureSummary,
              "Element": element.html,
              "Impact": element.impact.toUpperCase()
              // Can be one of "MINOR", "MODERATE", "SERIOUS", or "CRTITCAL"
            };
          }));
          // eslint-disable-next-line no-console
          console.groupEnd();
        });
        // eslint-disable-next-line no-console
        console.groupEnd();
        return displayWarning;
      };
      if (Constants.enableAxe) {
        require(["@@AXE_URL"], function(axe) {
          axeInstance = axe;
        }, function() {
          axeInstance = null;
        });
      }
      /**
       * This function runs aXe Accessibility Tool on the page and prints the formatted logs in the console.
       * @instance
       * @function runAxe
       * @memberof BaseModel
       * @returns {void}
       */
      self.runAxe = function() {
        return new Promise(function(resolve, reject) {
          if (axeInstance && Constants.enableAxe) {
            resolve(axeInstance.run(document, {
              rules: {
                "aria-allowed-attr": {
                  enabled: false
                },
                "aria-required-children": {
                  enabled: false
                },
                "aria-valid-attr-value": {
                  enabled: false
                },
                "aria-roles": {
                  enabled: false
                },
                "radiogroup": {
                  enabled: false
                },
                "checkboxgroup": {
                  enabled: false
                }
              }
            }));
          }
          reject();
        });
      };

      /**
       * Used to perform Page View tracking.
       * @param  {object} callback .
       * @param  {object} parameter pass to the function.
       * @returns {void}
       */
      self.webAnalytics = function(trackingId, parameters, callback) {
        WebAnalytics.getInstance().then(function(webAnalytics) {
          webAnalytics(trackingId, parameters);
          callback();
        });
      };
    };
    return baseModel;
  });
