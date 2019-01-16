define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var CreateBeneMaintenanceModel = function() {
    var baseService = BaseService.getInstance(),
      Model = function() {
        this.BeneficiaryDetails = {
          "id": null,
          "name": null,
          "nickName": null,
          "address": {
            "line1": null,
            "line2": null,
            "line3": null,
            "city": null,
            "state": null,
            "country": null,
            "zipCode": null
          },
          "swiftId": null,
          "visibility": "PRIVATE",
          "transactionTypeMap": []
        };
      };

    var getBankDetailsBICDeferred, getBankDetailsBIC = function(code, deferred) {
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
      fetchBeniCountryDeferred, fetchBeniCountry = function(deferred) {
        var options = {
          url: "enumerations/country",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      getNewModel: function() {
        return new Model();
      },
      getBankDetailsBIC: function(code) {
        getBankDetailsBICDeferred = $.Deferred();
        getBankDetailsBIC(code, getBankDetailsBICDeferred);
        return getBankDetailsBICDeferred;
      },
      fetchBeniCountry: function() {
        fetchBeniCountryDeferred = $.Deferred();
        fetchBeniCountry(fetchBeniCountryDeferred);
        return fetchBeniCountryDeferred;
      }
    };
  };
  return new CreateBeneMaintenanceModel();
});