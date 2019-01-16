define([
  "jquery",
  "baseService",
  "framework/js/constants/constants-creditcard"
], function($, BaseService) {
  "use strict";
  var serviceRequestModel = function() {
    var baseService = BaseService.getInstance();
    var fetchServiceRequestDeferred, fetchServiceRequest = function(deferred) {
      var options = {
        url: "servicerequest?status=PE&entity=CR",
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
      fetchServiceRequest: function() {
        fetchServiceRequestDeferred = $.Deferred();
        fetchServiceRequest(fetchServiceRequestDeferred);
        return fetchServiceRequestDeferred;
      }
    };
  };
  return new serviceRequestModel();
});