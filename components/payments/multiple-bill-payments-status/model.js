define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var MultipleBillPaymentsStatusModel = function() {
    var baseService = BaseService.getInstance(),
      downloadEreceiptDeferred, downloadEreceipt = function(transactionId, deferred) {
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
      downloadEreceipt: function(transactionId) {
        downloadEreceiptDeferred = $.Deferred();
        downloadEreceipt(transactionId, downloadEreceiptDeferred);
        return downloadEreceiptDeferred;
      }
    };
  };
  return new MultipleBillPaymentsStatusModel();
});