define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var LocationReadModel = function() {
    var fetchBranchDetailsDeferred, fetchBranchDetails = function(id, deferred) {
      var options = {
        url: "locator/branches/" + id,
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.fetch(options);
    };
    var fetchATMDetailsDeferred, fetchATMDetails = function(id, deferred) {
      var options = {
        url: "locator/atms/" + id,
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.fetch(options);
    };
    var fetchSupportedServicesDeferred, fetchSupportedServices = function(type, deferred) {
      var options = {
        url: "locator/services?type=" + type,
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.fetch(options);
    };
    var deleteLocationDeferred, deleteLocation = function(type, id, deferred) {
      var options = {
        url: "locator/" + type + "/" + id,
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        }
      };
      baseService.remove(options);
    };
    return {
      fetchBranchDetails: function(id) {
        fetchBranchDetailsDeferred = $.Deferred();
        fetchBranchDetails(id, fetchBranchDetailsDeferred);
        return fetchBranchDetailsDeferred;
      },
      fetchATMDetails: function(id) {
        fetchATMDetailsDeferred = $.Deferred();
        fetchATMDetails(id, fetchATMDetailsDeferred);
        return fetchATMDetailsDeferred;
      },
      fetchSupportedServices: function(type) {
        fetchSupportedServicesDeferred = $.Deferred();
        fetchSupportedServices(type, fetchSupportedServicesDeferred);
        return fetchSupportedServicesDeferred;
      },
      deleteLocation: function(type, id) {
        deleteLocationDeferred = $.Deferred();
        deleteLocation(type, id, deleteLocationDeferred);
        return deleteLocationDeferred;
      }

    };
  };
  return new LocationReadModel();
});