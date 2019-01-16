define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "ojL10n!resources/nls/review-cheque-stop-unblock"
], function (oj, ko, $, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.dashboard.headerName(ResourceBundle.header);
        self.resource = ResourceBundle;
        self.reviewTransactionName = [];
        self.reviewTransactionName.header = self.resource.common.review;
        self.reviewTransactionName.reviewHeader = self.resource.common.reviewHeader;
        (function (extensionObject) {
            extensionObject.isSet = true;
            extensionObject.data = self.params.data;
            extensionObject.template = "confirm-screen/cheque-stop-unblock";
            extensionObject.resourceBundle = ResourceBundle;
            extensionObject.successMessage = "";
            extensionObject.statusMessages = "";
            extensionObject.taskCode = "CH_N_CIN";
            extensionObject.confirmScreenMsgEval = function (jqXHR, txnName, status, referenceNo, hostReferenceNo) {
                return rootParams.baseModel.format(ResourceBundle.confirmationMsg[status], {
                    txnName: txnName,
                    referenceNo: referenceNo,
                    hostReferenceNo: hostReferenceNo
                });
            };
        })(self.params.confirmScreenExtensions);
    };
});
