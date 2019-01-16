define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "ojL10n!resources/nls/review-loan-repayment"
], function (oj, ko, $, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        rootParams.dashboard.headerName(ResourceBundle.header);
        self.modelData = self.params.data;
        self.reviewTransactionName = [];
        self.reviewTransactionName.header = self.resource.common.review;
        self.reviewTransactionName.reviewHeader = self.resource.common.reviewHeader;
        (function (extensionObject) {
            extensionObject.isSet = true;
            extensionObject.data = self.params.data;
            extensionObject.template = "confirm-screen/loan-repayment";
            extensionObject.resourceBundle = ResourceBundle;
            extensionObject.successMessage = "";
            extensionObject.statusMessages = "";
            extensionObject.taskCode = "LN_F_LRP";
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
