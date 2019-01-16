define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var AmountInputModel = function() {
    var baseService = BaseService.getInstance(),
      getCurrencyDeferred, getCurrencyList = function(url, deferred) {
        var options = {
          url: url,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      getCurrencyList: function(url) {
        getCurrencyDeferred = $.Deferred();
        getCurrencyList(url, getCurrencyDeferred);
        return getCurrencyDeferred;
      }
    };
  };
  return new AmountInputModel();
});