define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/internal-payee",
    "ojL10n!resources/nls/bank-account-payee",
    "framework/js/constants/constants",
    "ojs/ojknockout"
], function(oj, ko, $, reviewInternalPayeeModel, ResourceBundle, commonPayee, Constants) {
    "use strict";
    return function(Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.userSegment = Constants.userSegment;
        self.name = ko.observable();
        self.accountNumber = ko.observable();
        self.accountName = ko.observable();
        self.dataLoaded = ko.observable(false);
        self.validationTracker = Params.validator;
        self.payments = commonPayee.payments;
        self.limitCurrency = ko.observable();
        self.payments.payee.internal = ResourceBundle.payments.payee.internal;
        void(self.params.reviewMode && Params.dashboard.headerName(self.params.header));
        self.payeeDetails = ko.observable();
        self.branchName = ko.observable();
        self.confirmScreenDetails = Params.rootModel.confirmScreenDetails;

        Params.baseModel.registerElement([
            "internal-account-input"
        ]);

        self.getConfirmScreenMsg = function(jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec")
                return self.payments.common.confirmScreen.approvalMessages.FAILED.successmsg;
            else if (jqXHR.responseJSON.transactionAction)
                return self.payments.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].successmsg;
        };
        self.getConfirmScreenStatus = function(jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec")
                return self.payments.common.confirmScreen.approvalMessages.FAILED.statusmsg;
            else if (jqXHR.responseJSON.transactionAction)
                return self.payments.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].statusmsg;
        };
        reviewInternalPayeeModel.getDetails(self.params.data ? self.params.data.groupId() : self.params.groupId(), self.params.data ? self.params.data.payeeId() : self.params.payeeId()).done(function(data) {
            self.payeeDetails(data.internalPayee);
            if (self.payeeData) {
                self.payeeData.accountName = self.payeeDetails().accountName;
                self.payeeData.name = self.payeeDetails().name;
                self.payeeData.nickName = self.payeeDetails().nickName;
                self.payeeData.id = self.payeeDetails().id;
                self.payeeData.payeeType = "INTERNAL";
                self.setLimitClicked = ko.observable(false);
                self.setMonthlyLimitClicked = ko.observable(false);
                self.payeeData.limitDetails = {
                    DAILY: {
                        isEffectiveFromTomorrow: false,
                        maxAmount: {
                            amount: ko.observable(),
                            currency: self.limitCurrency()
                        }
                    },
                    MONTHLY: {
                        isEffectiveFromTomorrow: false,
                        maxAmount: {
                            amount: ko.observable(),
                            currency: self.limitCurrency()
                        }
                    }
                };
            }
            var confirmScreenDetailsArray = [
                [{
                        label: self.payments.payee.accounttype,
                        value: self.payments.payee.accinternal
                    },
                    {
                        label: self.payments.payee.accountnumber,
                        value: self.payeeDetails().accountNumber
                    }
                ],
                [{
                    label: self.payments.payee.accountname,
                    value: self.payeeDetails().accountName
                }]
            ];
            if (typeof self.confirmScreenDetails === "function")
                self.confirmScreenDetails(confirmScreenDetailsArray);
            else if (self.confirmScreenExtensions) {
                $.extend(self.confirmScreenExtensions, {
                    isSet: true,
                    confirmScreenDetails: confirmScreenDetailsArray,
                    confirmScreenMsgEval: self.getConfirmScreenMsg,
                    confirmScreenStatusEval: self.getConfirmScreenStatus,
                    template: "confirm-screen/payments-template"
                });
            }
            self.dataLoaded(true);
        });
    };
});