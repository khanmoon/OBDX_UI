define(["jquery", "promise" , "framework/js/constants/constants"], function($, Promise,Constants) {
  "use strict";

  function WebAnalytics(resolve) {
    var self = this;
    var behaviours = {};
    self.callBehaviour = function() {
      if (behaviours[arguments[0]]) {
        var args = [].slice.call(arguments).splice(1);
        return behaviours[arguments[0]].apply(this, args);
      }
      return null;
    };
    if (Constants.webAnalytics) {
      require(["web-analytics/" + Constants.webAnalytics], function(operations) {
        $.extend(behaviours, operations);
        resolve(self.callBehaviour);
      }, function() {
        //Analytic Engine not found.
        resolve(self.callBehaviour);
      });
    } else {
      resolve(self.callBehaviour);
    }
  }
  var promise = new Promise(function(resolve) {
    new WebAnalytics(resolve);
  });
  return {
    getInstance: function() {
      return promise;
    }
  };
});
