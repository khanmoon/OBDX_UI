define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",

    "ojL10n!resources/nls/international-payee",
    "ojL10n!resources/nls/bank-account-payee",
    "framework/js/constants/constants",
    "ojs/ojknockout",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojbutton"
], function (oj, ko, $, internationalPayeeModel, BaseLogger, ResourceBundle, commonPayee, Constants) {
    "use strict";
    return function (Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.userSegment = Constants.userSegment;
        self.payments = commonPayee.payments;
        self.payments.payee.international = ResourceBundle.payments.payee.international;
        void(self.params.reviewMode && Params.dashboard.headerName(self.params.header));
        self.payeeDetails = ko.observable();
        self.dataLoaded = ko.observable(false);
        self.network = ko.observable();
        self.limitCurrency = ko.observable();
        self.getConfirmScreenMsg = function (jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec")
                return self.payments.common.confirmScreen.approvalMessages.FAILED.successmsg;
            else if (jqXHR.responseJSON.transactionAction)
                return self.payments.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].successmsg;
        };
        self.getConfirmScreenStatus = function (jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec")
                return self.payments.common.confirmScreen.approvalMessages.FAILED.statusmsg;
            else if (jqXHR.responseJSON.transactionAction)
                return self.payments.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].statusmsg;
        };
        internationalPayeeModel.getPayeeDetails(self.params.data ? self.params.data.groupId() : self.params.groupId(), self.params.data ? self.params.data.payeeId() : self.params.payeeId()).done(function (data) {
            self.payeeDetails(data.internationalPayee);
            self.network(self.payeeDetails().network);
            self.payeeDetails().network = self.network;
            if (self.payeeData) {
                self.payeeData.nickName = self.payeeDetails().nickName;
                self.payeeData.name = self.payeeDetails().name;
                self.payeeData.id = self.payeeDetails().id;
                self.payeeData.payeeType = "INTERNATIONAL";
                self.payeeData.network = self.payeeDetails().network;
                self.payeeData.bankDetails = self.payeeDetails().bankDetails;
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
                [
                    {
                        label: self.payments.payee.accounttype,
                        value: self.payments.payee.accinternational
                    },
                    {
                        label: self.payments.payee.accountname,
                        value: self.payeeDetails().accountName
                    }
                ],
                [
                    {
                        label: self.payments.payee.accountnumber,
                        value: self.payeeDetails().accountNumber
                    },
                    {
                        label: self.payments.payee.labels.bnkdetails,
                        value: [
                                self.payeeDetails().bankDetails.code,
                                self.payeeDetails().bankDetails.name,
                                self.payeeDetails().bankDetails.address,
                                self.payeeDetails().bankDetails.city,
                                self.payeeDetails().bankDetails.country
                        ]
                    }
                ]
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