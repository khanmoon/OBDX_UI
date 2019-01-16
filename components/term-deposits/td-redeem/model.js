define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var redeemModel = function() {
    var params, baseService = BaseService.getInstance();
    var Model = {
      "redemptionId": null,
      "partyId": null,
      "module": null,
      "accountId": {
        "displayValue": null,
        "value": null
      },
      "date": null,
      "maturityAmount": {
        "currency": null,
        "amount": null
      },
      "netCreditAmt": {
        "currency": null,
        "amount": null
      },
      "charges": {
        "currency": null,
        "amount": null
      },
      "redemptionAmount": {
        "currency": null,
        "amount": null
      },
      "revisedPrincipalAmount": {
        "currency": null,
        "amount": null
      },
      "revisedMaturityAmount": {
        "currency": null,
        "amount": null
      },
      "revisedInterestRate": 0,
      "typeRedemption": "F",
      "payoutInstructions": [{
        "accountId": {
          "displayValue": null,
          "value": null
        },
        "account": null,
        "branchId": null,
        "id": null,
        "percentage": 100,
        "type": null,
        "beneficiaryName": null,
        "bankName": null,
        "address": {
          line1: null,
          line2: null,
          city: null,
          country: null
        },
        "clearingCode": null,
        "networkType": null,
        "payoutComponentType": null
      }]
    };
    /**
     *Fetches Account transfer options
     */
    var getPayOutOptionsDeferred, getPayOutOptions = function(deferred) {
        var options = {
          url: "enumerations/payOutOption",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      /**
       *Fetches Network Type
       */
      getNetworkTypeDeferred, getNetworkType = function(deferred) {
        var options = {
          url: "enumerations/networkType?REGION=INDIA",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      /**
       *It is called when user clicks redeem.POST operation is performed on click.
       */
      redeemDeferred, redeem = function(data, accountId, simulation, deferred) {
        var options = {
          url: "accounts/deposit/" + accountId + "/redemptions?simulation=" + simulation,
          data: data,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.add(options);
      },
      /**
       *It is called on load of redeemTd and fetches Total redeemable amount,Penalty/charges,etc
       */
      redeemDetailsDeferred, redeemDetails = function(accountId, data, deferred) {
        var options = {
          url: "accounts/deposit/" + accountId + "/penalities",
          data: data,
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.add(options);
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
      fetchPartyDetailsDeferred, fetchPartyDetails = function(deferred) {
        var options = {
          url: "me",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      };
    var fetchAccountDetailsDeferred, fetchAccountDetails = function(accountId, deferred) {
      params = {
        accountId: accountId
      };
      var options = {
        url: "accounts/deposit/{accountId}",
        success: function(data, status, jqXhr) {
          deferred.resolve(data, status, jqXhr);
        }
      };
      baseService.fetch(options, params);
    };
    return {
      getPayOutOptions: function() {
        getPayOutOptionsDeferred = $.Deferred();
        getPayOutOptions(getPayOutOptionsDeferred);
        return getPayOutOptionsDeferred;
      },
      getNetworkType: function() {
        getNetworkTypeDeferred = $.Deferred();
        getNetworkType(getNetworkTypeDeferred);
        return getNetworkTypeDeferred;
      },
      redeem: function(redeemReviewData, accountId, simulation) {
        redeemDeferred = $.Deferred();
        redeem(redeemReviewData, accountId, simulation, redeemDeferred);
        return redeemDeferred;
      },
      redeemDetails: function(accountId, data) {
        redeemDetailsDeferred = $.Deferred();
        redeemDetails(accountId, data, redeemDetailsDeferred);
        return redeemDetailsDeferred;
      },
      fetchCASAAccountData: function() {
        fetchCASAAccountDataDeferred = $.Deferred();
        fetchCASAAccountData(fetchCASAAccountDataDeferred);
        return fetchCASAAccountDataDeferred;
      },
      fetchPartyDetails: function() {
        fetchPartyDetailsDeferred = $.Deferred();
        fetchPartyDetails(fetchPartyDetailsDeferred);
        return fetchPartyDetailsDeferred;
      },
      getNewModel: function() {
        return Model;
      },
      fetchAccountDetails: function(accountId) {
        fetchAccountDetailsDeferred = $.Deferred();
        fetchAccountDetails(accountId, fetchAccountDetailsDeferred);
        return fetchAccountDetailsDeferred;
      }
    };
  };
  return new redeemModel();
});