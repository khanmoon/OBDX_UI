define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var internationalPayeeModel = function() {
    var baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      region, getNetworkTypesDeferred, getNetworkTypes = function(deferred) {
        var options = {
            url: "enumerations/networkType?REGION={region}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "region": region
          };
        baseService.fetch(options, params);
      },
      getCountriesDeferred, getCountries = function(deferred) {
        var options = {
          url: "enumerations/country",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getBankDetailsBICDeferred, getBankDetailsBIC = function(code, deferred) {
        var options = {
            url: "financialInstitution/bicCodeDetails/{BICCode}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "BICCode": code
          };
        baseService.fetch(options, params);
      },
      getBankDetailsNCCDeferred, getBankDetailsNCC = function(code, region, deferred) {
        var options = {
            url: "financialInstitution/nationalClearingDetails/{nationalClearingCodeType}/{nationalClearingCode}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "nationalClearingCode": code,
            "nationalClearingCodeType": region
          };
        baseService.fetch(options, params);
      };
    return {
      /**
       * Method to initialize the described model
       */
      init: function(reg) {
        region = reg || undefined;
      },
      getNetworkTypes: function() {
        getNetworkTypesDeferred = $.Deferred();
        getNetworkTypes(getNetworkTypesDeferred);
        return getNetworkTypesDeferred;
      },
      getCountries: function() {
        getCountriesDeferred = $.Deferred();
        getCountries(getCountriesDeferred);
        return getCountriesDeferred;
      },
      getBankDetailsBIC: function(code) {
        getBankDetailsBICDeferred = $.Deferred();
        getBankDetailsBIC(code, getBankDetailsBICDeferred);
        return getBankDetailsBICDeferred;
      },
      getBankDetailsNCC: function(code, region) {
        getBankDetailsNCCDeferred = $.Deferred();
        getBankDetailsNCC(code, region, getBankDetailsNCCDeferred);
        return getBankDetailsNCCDeferred;
      }
    };
  };
  return new internationalPayeeModel();
});