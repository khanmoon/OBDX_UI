define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "ojL10n!resources/nls/review-td-topup"
], function (oj, ko, $, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.dashboard.headerName(ResourceBundle.transactions.topUp.topUp);
        self.resource = ResourceBundle;
        self.reviewTransactionName = [];
        self.reviewTransactionName.header = self.resource.common.review;
        self.reviewTransactionName.reviewHeader = self.resource.common.reviewHeader;
        var populateConfirmScreenExtensions = function(extension){
          extension.isSet = true;
          extension.data = self.params.data;
          extension.template = "confirm-screen/td-topup";
          extension.resourceBundle = ResourceBundle;
          extension.successMessage = "";
          extension.statusMessages = "";
          extension.taskCode = "TD_F_TTD";
          extension.confirmScreenMsgEval = function(jqXHR, txnName, status, referenceNo, hostReferenceNo) {
            return rootParams.format(ResourceBundle.confirmationMsg[status], {
              txnName: txnName,
              referenceNo: referenceNo,
              hostReferenceNo: hostReferenceNo
            });
          };
        };
        populateConfirmScreenExtensions(self.params.confirmScreenExtensions);
    };
});
