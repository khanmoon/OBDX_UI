define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var domesticDDPayeeModel = function() {
    var Model = function() {
        this.addressDetails = {
          modeofDelivery: null,
          addressType: null,
          postalAddress: {
            line1: "",
            line2: "",
            line3: "",
            line4: "",
            line5: "",
            line6: "",
            line7: "",
            line8: "",
            line9: "",
            line10: "",
            line11: "",
            line12: "",
            city: "",
            state: "",
            country: "",
            zipCode: ""
          },
          city: null,
          country: null,
          branch: null
        };
      },
      baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      countryCode, city, branchCode, getStatesDeferred, getStates = function(deferred) {
        var options = {
            url: "enumerations/country/{countryCode}/state",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "countryCode": countryCode
          };
        baseService.fetch(options, params);
      },
      getCitiesDeferred, getCities = function(deferred) {
        var options = {
          url: "locations/country/all/city",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getBranchesDeferred, getBranches = function(deferred) {
        var options = {
            url: "locations/country/all/city/{city}/branchCode/",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "city": city
          };
        baseService.fetch(options, params);
      },
      getBranchAddressDeferred, getBranchAddress = function(deferred) {
        var options = {
            url: "locations/branches?branchCode={branchCode}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "branchCode": branchCode
          };
        baseService.fetch(options, params);
      },
      bancConfigurationDeffered, fetchBankConfiguration = function(deferred) {
        var options = {
          url: "bankConfiguration",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getRemitterAddressDeferred, getRemitterAddress = function(deferred) {
        var options = {
          url: "parties/me/addresses",
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
      /**
       * Method to initialize the described model
       */
      init: function(cty, bCode, ctryCode) {
        countryCode = ctryCode || undefined;
        city = cty || undefined;
        branchCode = bCode || undefined;
      },
      getNewModel: function() {
        return new Model();
      },
      getStates: function() {
        getStatesDeferred = $.Deferred();
        getStates(getStatesDeferred);
        return getStatesDeferred;
      },
      getBranchAddress: function() {
        getBranchAddressDeferred = $.Deferred();
        getBranchAddress(getBranchAddressDeferred);
        return getBranchAddressDeferred;
      },
      getBranches: function() {
        getBranchesDeferred = $.Deferred();
        getBranches(getBranchesDeferred);
        return getBranchesDeferred;
      },
      getCities: function() {
        getCitiesDeferred = $.Deferred();
        getCities(getCitiesDeferred);
        return getCitiesDeferred;
      },
      getRemitterAddress: function() {
        getRemitterAddressDeferred = $.Deferred();
        getRemitterAddress(getRemitterAddressDeferred);
        return getRemitterAddressDeferred;
      },
      fetchBankConfiguration: function() {
        bancConfigurationDeffered = $.Deferred();
        fetchBankConfiguration(bancConfigurationDeffered);
        return bancConfigurationDeffered;
      }
    };
  };
  return new domesticDDPayeeModel();
});