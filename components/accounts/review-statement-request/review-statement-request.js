define([
  "knockout",
  "jquery",
  "ojL10n!resources/nls/review-statement-request"
], function(ko, $, locale) {
  "use strict";
  return function(params) {
    var self = this;
    ko.utils.extend(self, params.rootModel);
    self.nls = locale;
    params.dashboard.headerName(self.nls.header);
    self.reviewTransactionName = [];
    self.reviewTransactionName.header = self.nls.review;
    self.reviewTransactionName.reviewHeader = self.nls.reviewHeader;
    (function(extensionObject) {
      extensionObject.isSet = true;
      extensionObject.data = self.params.data;
      extensionObject.template = "confirm-screen/statement-request";
      extensionObject.resourceBundle = locale;
      extensionObject.successMessage = "";
      extensionObject.statusMessages = "";
      extensionObject.taskCode = self.params.taskCode || self.taskCode;
      extensionObject.confirmScreenMsgEval = function(jqXHR, txnName, status, referenceNo, hostReferenceNo) {
        return params.baseModel.format(locale.confirmationMsg[status], {
          txnName: txnName,
          referenceNo: referenceNo,
          hostReferenceNo: hostReferenceNo
        });
      };
    })(self.params.confirmScreenExtensions);
  };
});
