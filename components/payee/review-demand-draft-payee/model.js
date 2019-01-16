define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var DDPayeeModel = function() {
    var Model = function() {
        this.addressDetails = {
          modeofDelivery: null,
          addressType: null,
          addressTypeDescription: null,
          postalAddress: {}
        };
      },
      baseService = BaseService.getInstance(),
      getPayeeDetailsDeferred, getPayeeDetails = function(payeeGroupId, payeeId, deferred) {
        var options = {
          url: "payments/payeeGroup/" + payeeGroupId + "/payees/demandDraft/" + payeeId,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      readPayeeDeferred, readPayee = function(gId, pId, type, deferred) {

        var options = {
            url: "payments/payeeGroup/{groupId}/payees/{payeeType}/{payeeId}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            groupId: gId,
            payeeId: pId,
            payeeType: type
          };
        baseService.fetch(options, params);
      },
      getBranchDetailsDeferred, getBranchDetails = function(branchCode, deferred) {
        var options = {
          url: "locations/branches?branchCode=" + branchCode,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getPartyAddressDeferred, getPartyAddress = function(addressType, deferred) {
        var options = {
          url: "me/party",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
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
      };
    return {
      getNewModel: function() {
        return new Model();
      },
      getPayeeDetails: function(payeeGroupId, payeeId) {
        getPayeeDetailsDeferred = $.Deferred();
        getPayeeDetails(payeeGroupId, payeeId, getPayeeDetailsDeferred);
        return getPayeeDetailsDeferred;
      },
      getBranchDetails: function(branchCode) {
        getBranchDetailsDeferred = $.Deferred();
        getBranchDetails(branchCode, getBranchDetailsDeferred);
        return getBranchDetailsDeferred;
      },
      getPartyAddress: function(addressType) {
        getPartyAddressDeferred = $.Deferred();
        getPartyAddress(addressType, getPartyAddressDeferred);
        return getPartyAddressDeferred;
      },
      readPayee: function(gId, pId, type) {
        readPayeeDeferred = $.Deferred();
        readPayee(gId, pId, type, readPayeeDeferred);
        return readPayeeDeferred;
      },
      getCountries: function() {
        getCountriesDeferred = $.Deferred();
        getCountries(getCountriesDeferred);
        return getCountriesDeferred;
      }
    };
  };
  return new DDPayeeModel();
});
