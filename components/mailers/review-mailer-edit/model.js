define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var ReviewMailerEditModel = function() {
    var baseService = BaseService.getInstance(),

      updateMailerDeferred, updateMailer = function(payload, deferred) {
        var options = {
          url: "mailers",
          data: payload,
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            deferred.reject(data, status, jqXHR);
          }
        };
        baseService.update(options);
      };

    return {
      updateMailer: function(payload) {
        updateMailerDeferred = $.Deferred();
        updateMailer(payload, updateMailerDeferred);
        return updateMailerDeferred;
      }
    };
  };
  return new ReviewMailerEditModel();
});