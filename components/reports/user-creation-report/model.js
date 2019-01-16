define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var reportGenerationModel = function() {
    var Model = function() {
        this.reportParams = {
          startDate: null,
          endDate: null,
          userType: null
        };
      },
      baseService = BaseService.getInstance(),

      fetchEnumerationDeferred, fetchEnumeration = function(deferred) {
        var options = {
          url: "enterpriseRoles?isLocal=true",
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
      getNewModel: function(dataModel) {
        return new Model(dataModel);
      },
      fetchEnumeration: function() {
        fetchEnumerationDeferred = $.Deferred();
        fetchEnumeration(fetchEnumerationDeferred);
        return fetchEnumerationDeferred;
      }
    };
  };
  return new reportGenerationModel();
});