define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var EntityTaxResidencyInfoModel = function() {
    var baseService = BaseService.getInstance();
    var fetchTaxResidenceCountriesDeferred, fetchTaxResidenceCountries = function(deferred) {
      var options = {
        url: "enumerations/country",
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.fetch(options);
    },
    fetchTaxIdentificationTypesDeferred, fetchTaxIdentificationTypes = function(countryCode, deferred) {
      var params = {
        countryCode: countryCode
      },
      options = {
        url: "enumerations/{countryCode}/taxIdentificationType",
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.fetch(options, params);
    };
    return {
      fetchTaxResidenceCountries: function() {
        fetchTaxResidenceCountriesDeferred = $.Deferred();
        fetchTaxResidenceCountries(fetchTaxResidenceCountriesDeferred);
        return fetchTaxResidenceCountriesDeferred;
      },
      fetchTaxIdentificationTypes: function(countryCode) {
        fetchTaxIdentificationTypesDeferred = $.Deferred();
        fetchTaxIdentificationTypes(countryCode, fetchTaxIdentificationTypesDeferred);
        return fetchTaxIdentificationTypesDeferred;
      }
    };
  };
  return new EntityTaxResidencyInfoModel();
});
