define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  var LocationSearchModel = function() {
    var fetchCountryDeferred, fetchCountry = function(deferred) {
      var options = {
        url: "enumerations/country",
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.fetch(options);
    };
    var fetchATMBranchDeferred, fetchATMBranch = function(searchParams, deferred) {
      var params = {
          "countryRegion": searchParams.countryRegion,
          "city": searchParams.city,
          "id": searchParams.id
        },
        options = {
          url: "locator?countryRegion=" + params.countryRegion + "&city=" + params.city,
          success: function(data) {
            deferred.resolve(data);
          }
        };
      baseService.fetch(options);
    };
    return {
      fetchCountry: function() {
        fetchCountryDeferred = $.Deferred();
        fetchCountry(fetchCountryDeferred);
        return fetchCountryDeferred;
      },
      fetchATMBranch: function(params) {
        fetchATMBranchDeferred = $.Deferred();
        fetchATMBranch(params, fetchATMBranchDeferred);
        return fetchATMBranchDeferred;
      }
    };
  };
  return new LocationSearchModel();
});