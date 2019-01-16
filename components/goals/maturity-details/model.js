define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  var maturityDetails = function maturityDetails() {

    var baseService = BaseService.getInstance(),
      modelInitialized = true,
      Model = function() {
        this.dummyObject = {
          selfAccountObject: {
            value: ""
          },
          accountNumber: "",
          accountType: "",
          networkType: "",
          name: "",
          bankCode: "",
          bankDetails: "",
          branch: ""
        };
      },

      getNetworkTypesDeferred, getNetworkTypes = function(region, deferred) {
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
      getBankDetailsDCCDeferred, getBankDetailsDCC = function(code, network, region, deferred) {
        var options = {
            url: "financialInstitution/domesticClearingDetails?financialInstitutionCodeSearchType=S&financialInstitutionCode=" + code + "&network=" + network,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "domesticClearingCodeType": "INDIA",
            "domesticClearingCode": code
          };
        baseService.fetch(options, params);
      },

      objectInitializedCheck = function() {
        if (!modelInitialized) {
          throw new Error();
        }
      };

    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      getNetworkTypes: function(region) {
        objectInitializedCheck();
        getNetworkTypesDeferred = $.Deferred();
        getNetworkTypes(region, getNetworkTypesDeferred);
        return getNetworkTypesDeferred;
      },
      getBankDetailsDCC: function(code, network, region) {
        objectInitializedCheck();
        getBankDetailsDCCDeferred = $.Deferred();
        getBankDetailsDCC(code, network, region, getBankDetailsDCCDeferred);
        return getBankDetailsDCCDeferred;
      }
    };
  };

  return new maturityDetails();
});