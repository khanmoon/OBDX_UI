define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var TDdetailsModel = function() {
    var baseService = BaseService.getInstance(),
      fetchTdDetailsDeferred, fetchTdDetails = function(accountId, deferred) {
        var options = {
          url: "accounts/deposit/" + accountId,
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchpayoutInstructionsDeferred, fetchpayoutInstructions = function(accountId, deferred) {
        var options = {
          url: "accounts/deposit/" + accountId + "/payOutInstructions",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchBankDetailsDeferred, fetchBankDetails = function(url, deferred) {
        var options = {
          url: url,
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchClosedTDdetailsDeferred, fetchClosedTDdetails = function(accountId, deferred) {
        var options = {
          url: "accounts/deposit/" + accountId + "/redemptions",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      fetchTdDetails: function(accountId) {
        fetchTdDetailsDeferred = $.Deferred();
        fetchTdDetails(accountId, fetchTdDetailsDeferred);
        return fetchTdDetailsDeferred;
      },
      fetchpayoutInstructions: function(accountId) {
        fetchpayoutInstructionsDeferred = $.Deferred();
        fetchpayoutInstructions(accountId, fetchpayoutInstructionsDeferred);
        return fetchpayoutInstructionsDeferred;
      },
      fetchBankDetails: function(url) {
        fetchBankDetailsDeferred = $.Deferred();
        fetchBankDetails(url, fetchBankDetailsDeferred);
        return fetchBankDetailsDeferred;
      },
      fetchClosedTDdetails: function(accountId) {
        fetchClosedTDdetailsDeferred = $.Deferred();
        fetchClosedTDdetails(accountId, fetchClosedTDdetailsDeferred);
        return fetchClosedTDdetailsDeferred;
      }
    };
  };
  return new TDdetailsModel();
});