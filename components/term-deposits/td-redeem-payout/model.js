define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var redeempayoutInstructionsModel = function() {
    var baseService = BaseService.getInstance(),
      fetchTransferOptionDeferred, fetchTransferOption = function(deferred) {
        var options = {
          url: "enumerations/payOutOption",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      /**
       *It fetches CASA account of the user
       */
      fetchCASAAccountDataDeferred, fetchCASAAccountData = function(deferred) {
        var options = {
          url: "accounts/demandDeposit",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchBankAddressDeferred, fetchBankAddress = function(deferred, bankCode) {
        var options = {
          url: "locations/branches?branchCode=" + bankCode,
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchNetworkTypeDeferred, fetchNetworkType = function(deferred) {
        var options = {
          url: "enumerations/networkType?REGION=INDIA",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchBankDetailsListDeferred, fetchBankDetailsList = function(deferred) {
        var options = {
          url: "locations/country/all/city/all/branchCode",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      fetchBranchDeferred, fetchBranch = function(clearingCodeType, clearingCode, deferred) {
        var options = {
          url: "financialInstitution/domesticClearingDetails/" + clearingCodeType + "/" + clearingCode,
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      fetchTransferOption: function() {
        fetchTransferOptionDeferred = $.Deferred();
        fetchTransferOption(fetchTransferOptionDeferred);
        return fetchTransferOptionDeferred;
      },
      fetchCASAAccountData: function() {
        fetchCASAAccountDataDeferred = $.Deferred();
        fetchCASAAccountData(fetchCASAAccountDataDeferred);
        return fetchCASAAccountDataDeferred;
      },
      fetchBankAddress: function(bankCode) {
        fetchBankAddressDeferred = $.Deferred();
        fetchBankAddress(fetchBankAddressDeferred, bankCode);
        return fetchBankAddressDeferred;
      },
      fetchNetworkType: function() {
        fetchNetworkTypeDeferred = $.Deferred();
        fetchNetworkType(fetchNetworkTypeDeferred);
        return fetchNetworkTypeDeferred;
      },
      fetchBankDetailsList: function() {
        fetchBankDetailsListDeferred = $.Deferred();
        fetchBankDetailsList(fetchBankDetailsListDeferred);
        return fetchBankDetailsListDeferred;
      },
      fetchBranch: function(clearingCodeType, clearingCode) {
        fetchBranchDeferred = $.Deferred();
        fetchBranch(clearingCodeType, clearingCode, fetchBranchDeferred);
        return fetchBranchDeferred;
      }
    };
  };
  return new redeempayoutInstructionsModel();
});