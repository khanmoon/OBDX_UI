define([
  "jquery",
  "baseService"
], function ($, BaseService) {
  "use strict";
  var ConfirmScreenModel = function () {
    var baseService = BaseService.getInstance();

    var downloadEreceiptDeferred, downloadEreceipt = function (transactionId, deferred) {
      var params = {
        transactionId: transactionId
      };
      var options = {
        url: "transactions/{transactionId}?media=application/pdf",
        success: function (data) {
          deferred.resolve(data);
        }
      };
      baseService.downloadFile(options, params);
    };
    return {
      downloadEreceipt: function (transactionId) {
        downloadEreceiptDeferred = $.Deferred();
        downloadEreceipt(transactionId, downloadEreceiptDeferred);
        return downloadEreceiptDeferred;
      },
      fetchTaskDetails: function (taskCode) {
        var options = {
          url: "resourceTasks/{taskCode}",
          showMessage : false
        };
        return baseService.fetch(options, {
          taskCode: taskCode
        });
      },
      fetchFeedbackTemplates: function (taskCode) {
        var options = {
          url: "feedback/template?roleIdentifier=Y&transactionId={taskCode}"
        };
        return baseService.fetch(options, {
          taskCode: taskCode
        });
      }
    };
  };
  return new ConfirmScreenModel();
});
