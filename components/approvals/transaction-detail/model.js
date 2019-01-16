define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var TransactionDetailModel = function() {
    var Model = function() {
      return {
      workflowDetails : {
        "name": null,
        "description": null,
        "workFlowId": null,
        "steps": [{
          "sequenceNo": "1",
          "paneldto": {
            "panelId": null
          }
        }, {
          "sequenceNo": "2",
          "paneldto": {
            "panelId": null
          }
        }]
      },
approvals : {
        partyId: null,
        userType: null,
        partyName: null
      }
    };};
    var baseService = BaseService.getInstance();
    var readTransactionDeferred, readTransaction = function(transactionId, deferred) {
      var options = {
        url: "transactions/" + transactionId + "?expand=HISTORY",
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.fetch(options);
    };
    var transactionApproveDeferred, approve = function(remarks, searchURL, transactionApproveDeferred) {
      var options = {
        url: searchURL,
        data: remarks,
        contentType: "text/plain",
        success: function(data, status, jqXHR) {
          transactionApproveDeferred.resolve(data, status, jqXHR);
        }
      };
      baseService.add(options);
    };
    var transactionRejectDeferred, reject = function(remarks, searchURL, transactionRejectDeferred) {
      var options = {
        url: searchURL,
        data: remarks,
        contentType: "text/plain",
        success: function(data, status, jqXHR) {
          transactionRejectDeferred.resolve(data, status, jqXHR);
        }
      };
      baseService.add(options);
    };
    var transactionmodificationRequestDeferred;
    var modificationRequest = function(remarks, searchURL, transactionmodificationRequestDeferred) {
      var options = {
        url: searchURL,
        data: remarks,
        contentType: "text/plain",
        success: function(data, status, jqXHR) {
          transactionmodificationRequestDeferred.resolve(data, status, jqXHR);
        }
      };
      baseService.add(options);
    };
    var downloadEreceiptDeferred, downloadEreceipt = function(transactionId, deferred) {
      var params = {
        transactionId: transactionId
      };
      var options = {
        url: "transactions/{transactionId}?media=application/pdf",
        success: function(data) {
          deferred.resolve(data);
        }
      };
      baseService.downloadFile(options, params);
    };
    return {
      readTransaction: function(transactionId) {
        readTransactionDeferred = $.Deferred();
        readTransaction(transactionId, readTransactionDeferred);
        return readTransactionDeferred;
      },
      downloadEreceipt: function(transactionId) {
        downloadEreceiptDeferred = $.Deferred();
        downloadEreceipt(transactionId, downloadEreceiptDeferred);
        return downloadEreceiptDeferred;
      },
      getNewModel: function() {
        return new Model();
      },
      approve: function(remarks, searchURL) {
        transactionApproveDeferred = $.Deferred();
        approve(remarks, searchURL, transactionApproveDeferred);
        return transactionApproveDeferred;
      },
      reject: function(remarks, searchURL) {
        transactionRejectDeferred = $.Deferred();
        reject(remarks, searchURL, transactionRejectDeferred);
        return transactionRejectDeferred;
      },
      modificationRequest: function(remarks, searchURL) {
        transactionmodificationRequestDeferred = $.Deferred();
        modificationRequest(remarks, searchURL, transactionmodificationRequestDeferred);
        return transactionmodificationRequestDeferred;
      }
    };
  };
  return new TransactionDetailModel();
});
