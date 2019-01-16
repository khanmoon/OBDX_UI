define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var ReviewMailerCreateModel = function() {
    var baseService = BaseService.getInstance(),

      createMailersDeferred, createMailers = function(payload, deferred) {
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
        baseService.add(options);
      };

    return {
      createMailers: function(payload) {
        createMailersDeferred = $.Deferred();
        createMailers(payload, createMailersDeferred);
        return createMailersDeferred;
      }
    };
  };
  return new ReviewMailerCreateModel();
});