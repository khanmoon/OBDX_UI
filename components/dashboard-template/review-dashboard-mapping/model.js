define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var CreateMappingModel = function () {
    return {
      createMapping: function (payload) {
        var deferred = $.Deferred();
        var options = {
          url: "dashboards/mappings",
          data: payload,
          success: function (data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function (data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.add(options);
        return deferred;
      }
    };

  };
  return new CreateMappingModel();
});