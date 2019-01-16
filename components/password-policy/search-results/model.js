define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var PasswordPolicySearchResultsModel = function() {
    var Deferred, get = function(deferred) {
      var options = {
        url : "enter-url-here/",
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.fetch(options);
    };
    return {
      get: function() {
        Deferred = $.Deferred();
        get(Deferred);
        return Deferred;
      }
    };
  };
  return new PasswordPolicySearchResultsModel();
});