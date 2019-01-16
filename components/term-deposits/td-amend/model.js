define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var TDAmmendModel = function() {
    var self = this;
    self.transactionId = null;
    self.trnsactionVersionId = null;
    var Model = function(transactionId, trnsactionVersionId) {
      self.transactionId = transactionId;
      self.trnsactionVersionId = trnsactionVersionId;
      this.amendData = {
        "rollOverType": null,
        "module": null,
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
        }],
        "rollOverAmount": {
          "currency": null,
          "amount": null
        }
      };
    };
    var params, baseService = BaseService.getInstance(),
      fetchMaturityInstructionDeferred, fetchMaturityInstruction = function(deferred) {
        var options = {
          url: "enumerations/rollOverType",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.fetch(options);
      },
      amendTDDeferred, amendTD = function(amendData, accountId, deferred) {
        var options = {
          url: "accounts/deposit/" + accountId,
          data: amendData,
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          }
        };
        options.headers = {};
        if (self.transactionId) {
          options.headers.TRANSACTION_REFERENCE_NO = self.transactionId + "#" + self.trnsactionVersionId;
        }
        baseService.update(options);
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
      fetchMaturityInstruction: function() {
        fetchMaturityInstructionDeferred = $.Deferred();
        fetchMaturityInstruction(fetchMaturityInstructionDeferred);
        return fetchMaturityInstructionDeferred;
      },
      amendTD: function(amendData, accountId) {
        amendTDDeferred = $.Deferred();
        amendTD(amendData, accountId, amendTDDeferred);
        return amendTDDeferred;
      },
      getNewModel: function(transactionId, trnsactionVersionId) {
        return new Model(transactionId, trnsactionVersionId);
      },
      fetchAccountDetails: function(accountId) {
        fetchAccountDetailsDeferred = $.Deferred();
        fetchAccountDetails(accountId, fetchAccountDetailsDeferred);
        return fetchAccountDetailsDeferred;
      }
    };
  };
  return new TDAmmendModel();
});