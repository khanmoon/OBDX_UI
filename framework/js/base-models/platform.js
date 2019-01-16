/**
 * This is the Platform for the OBDX Framework.
 * @module Platform
 */
define(["jquery", "promise"], function($, Promise) {
  "use strict";
  /**
   * @summary This is the constructor for the Platform.
   * @class
   * @alias Platform
   * @memberof module:platform
   * @description This constructor returns three methods:<br><br>
   * <code>info</code> : Used as <code>Logger.info</code>, where <code>Logger</code> is the instance of <code>BaseLogger</code>.<br><br>
   * <code>error</code> : Used as <code>Logger.error</code>, where <code>Logger</code> is the instance of <code>BaseLogger</code>.<br><br>
   * <code>warn</code> : Used as <code>Logger.warn</code>, where <code>Logger</code> is the instance of <code>BaseLogger</code>.<br><br>
   */
  var Platform = function(resolve) {
    var self = this,
      platform;
    var behaviours = {};
    self.callBehaviour = function() {
      if (behaviours[arguments[0]]) {
        var args = [].slice.call(arguments).splice(1);
        return behaviours[arguments[0]].apply(this, args);
      }
      return null;
    };
    if (window.navigator.userAgent.indexOf("obdx-mobile") !== -1) {
      platform = "mobile";
    } else {
      platform = "default";
    }
    require(["framework/js/base-models/platform/" + platform], function(operations) {
      $.extend(behaviours, operations);
      behaviours.init(self.callBehaviour, resolve);
    });
  };
  var promise = new Promise(function(resolve) {
    new Platform(resolve);
  });
  return {
    /**
     * Get the Platform Base instance. Checks [instance]{@linkcode module:platform~instance} for instance. If exists, returns it, else invokes [createInstance]{@linkcode module:platform~createInstance} to create an instance and returns it.
     * @function getInstance
     * @memberof module:platform
     * @static
     * @returns {Platform} The base service instance.
     */
    getInstance: function() {
      return promise;
    }
  };
});
