define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",
    "ojL10n!resources/nls/review-bill-payments",
    "framework/js/constants/constants",
    "ojs/ojknockout",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojdatetimepicker",
    "ojs/ojbutton"
], function (oj, ko, $, billPaymentModel, BaseLogger, ResourceBundle, Constants) {
    "use strict";
    return function (Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.userSegment = Constants.userSegment;
        self.resource = ResourceBundle;
        self.confirmScreenDetails = Params.rootModel.confirmScreenDetails;
        void(self.params.reviewMode && Params.dashboard.headerName(self.params.header));
        self.biller = self.biller || {};
        self.dataLoaded = ko.observable(false);
        self.selectedBillerName = ko.observable();
        billPaymentModel.getBillPaymentDetails(Params.data ? Params.data.paymentId : ko.utils.unwrapObservable(self.params.data ? self.params.data.paymentId : self.params.paymentId)).done(function (data) {
            self.biller = data.transferDetails;
            self.biller.amount.amount = ko.observable(self.biller.amount.amount);
            self.getBillerDetails();
        });
        self.getConfirmScreenMsg = function (jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec")
                return self.resource.common.confirmScreen.approvalMessages.FAILED.successmsg;
            else if (jqXHR.responseJSON.transactionAction)
                return self.resource.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].successmsg;
        };
        self.getConfirmScreenStatus = function (jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec")
                return self.resource.common.confirmScreen.approvalMessages.FAILED.statusmsg;
            else if (jqXHR.responseJSON.transactionAction)
                return self.resource.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].statusmsg;
        };
        self.getBillerDetails = function () {
            billPaymentModel.getBillerDetails(self.biller.billerId).done(function (data) {
                self.selectedBillerName(data.billerCategoryRel.billerDescription);
                self.dataLoaded(true);
                var confirmScreenDetailsArray = [
                    [
                        {
                            label: self.resource.billPayment.billerName,
                            value: self.selectedBillerName()
                        },
                        {
                            label: self.resource.billPayment.relationshipNumber,
                            value: self.biller.relationshipNumber
                        }
                    ],
                    [
                        {
                            label: self.resource.billPayment.amount,
                            value: Params.baseModel.formatCurrency(self.biller.amount.amount(), self.biller.amount.currency)
                        },
                        {
                            label: self.resource.billPayment.transferFrom,
                            value: self.biller.debitAccountId.displayValue
                        }
                    ]
                ];
                if (typeof self.confirmScreenDetails === "function")
                    self.confirmScreenDetails(confirmScreenDetailsArray);
                else if (self.confirmScreenExtensions) {
                    $.extend(self.confirmScreenExtensions, {
                        isSet: true,
                        taskCode: "PC_F_BLPMT",
                        eReceiptRequired: true,
                        confirmScreenDetails: confirmScreenDetailsArray,
                        confirmScreenMsgEval: self.getConfirmScreenMsg,
                        confirmScreenStatusEval: self.getConfirmScreenStatus,
                        template: "confirm-screen/payments-template"
                    });
                }
            });
        };
    };
});