define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var reportGenerationModel = function() {
    var Model = function() {
        this.reportParams = {
          emailId: null,
          mobileNo: null,
          startDate: null,
          endDate: null,
          kycStatus: null
        };
      },
      baseService = BaseService.getInstance(),

      fetchEnumerationDeferred, fetchEnumeration = function(deferred) {
        var options = {
          url: "enumerations/walletKYCStatusTypes",
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