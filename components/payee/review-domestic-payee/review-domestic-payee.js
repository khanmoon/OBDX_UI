define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",

    "ojL10n!resources/nls/domestic-payee",
    "ojL10n!resources/nls/bank-account-payee",
    "framework/js/constants/constants",
    "ojs/ojknockout",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojbutton"
], function (oj, ko, $, domesticPayeeModel, BaseLogger, ResourceBundle, commonPayee, Constants) {
    "use strict";
    return function (Params) {
        var self = this, confirmScreenDetailsArray;
        ko.utils.extend(self, Params.rootModel);
        self.userSegment = Constants.userSegment;
        self.payments = commonPayee.payments;
        self.payments.payee.domestic = ResourceBundle.payments.payee.domestic;
        self.payeeDetails = ko.observable();
        self.domesticPayeeType = ko.observable();
        self.dataLoaded = ko.observable(false);
        self.limitCurrency = ko.observable();
        void(self.params.reviewMode && Params.dashboard.headerName(self.params.header));
        self.confirmScreenDetails = Params.rootModel.confirmScreenDetails;
        self.getConfirmScreenMsg = function (jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec"){
                var errors = jqXHR.responseJSON.transactionAction.transactionDTO.errors;
                return errors && errors[0] && errors[0].errorMessage?errors[0].errorMessage:self.payments.common.confirmScreen.approvalMessages.FAILED.successmsg;
            }else if (jqXHR.responseJSON.transactionAction)
                return self.payments.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].successmsg;
        };
        self.getConfirmScreenStatus = function (jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec")
                return self.payments.common.confirmScreen.approvalMessages.FAILED.statusmsg;
            else if (jqXHR.responseJSON.transactionAction)
                return self.payments.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].statusmsg;
        };
        domesticPayeeModel.getPayeeDetails(self.params.data ? self.params.data.groupId() : self.params.groupId(), self.params.data ? self.params.data.payeeId() : self.params.payeeId()).done(function (data) {
            self.domesticPayeeType(data.domesticPayee.domesticPayeeType);
            self.payeeDetails(data.domesticPayee);
            if (self.payeeData) {
                self.payeeData.payeeType = "DOMESTIC";
                if (self.payeeDetails().domesticPayeeType === "INDIA") {
                    self.payeeData.nickName = self.payeeDetails().indiaDomesticPayee.nickName;
                    self.payeeData.name = self.payeeDetails().indiaDomesticPayee.name;
                    self.payeeData.id = self.payeeDetails().indiaDomesticPayee.id;
                    self.payeeData.accountName = self.payeeDetails().indiaDomesticPayee.accountName;
                    self.payeeData.bankDetails = self.payeeDetails().indiaDomesticPayee.bankDetails;
                } else if (self.payeeDetails().domesticPayeeType === "SEPA") {
                    self.payeeData.nickName = self.payeeDetails().sepaDomesticPayee.nickName;
                    self.payeeData.name = self.payeeDetails().sepaDomesticPayee.name;
                    self.payeeData.id = self.payeeDetails().sepaDomesticPayee.id;
                    self.payeeData.sepaType = self.payeeDetails().sepaDomesticPayee.sepaType;
                    self.payeeData.accountName = self.payeeDetails().sepaDomesticPayee.accountName;
                    self.payeeData.bankDetails = self.payeeDetails().sepaDomesticPayee.bankDetails;
                } else if (self.payeeDetails().domesticPayeeType === "UK") {
                    self.payeeData.nickName = self.payeeDetails().ukDomesticPayee.nickName;
                    self.payeeData.name = self.payeeDetails().ukDomesticPayee.name;
                    self.payeeData.id = self.payeeDetails().ukDomesticPayee.id;
                    self.payeeData.sepaType = self.payeeDetails().ukDomesticPayee.sepaType;
                    self.payeeData.accountName = self.payeeDetails().ukDomesticPayee.accountName;
                    self.payeeData.bankDetails = self.payeeDetails().ukDomesticPayee.bankDetails;
                }
                self.setLimitClicked = ko.observable(false);
                self.confirmPage = ko.observable(true);
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
            if (self.payeeDetails().domesticPayeeType === "INDIA") {
                confirmScreenDetailsArray = [
                    [
                        {
                            label: self.payments.payee.accounttype,
                            value: self.payments.payee.accdomestic
                        },
                        {
                            label: self.payments.payee.accountnumber,
                            value: self.payeeDetails().indiaDomesticPayee.accountNumber
                        }
                    ],
                    [
                        {
                            label: self.payments.payee.accountname,
                            value: self.payeeDetails().indiaDomesticPayee.accountName
                        },
                        {
                            label: self.payments.payee.labels.bnkdetails,
                            value: [
                                     self.payeeDetails().indiaDomesticPayee.bankDetails.code,
                                     self.payeeDetails().indiaDomesticPayee.bankDetails.name,
                                     self.payeeDetails().indiaDomesticPayee.bankDetails.address,
                                     self.payeeDetails().indiaDomesticPayee.bankDetails.city,
                                     self.payeeDetails().indiaDomesticPayee.bankDetails.country
                            ]
                        }
                    ]
                ];
            } else if (self.payeeDetails().domesticPayeeType === "SEPA") {
                confirmScreenDetailsArray = [
                    [
                        {
                            label: self.payments.payee.accounttype,
                            value: self.payments.payee.accdomestic
                        },
                        {
                            label: self.payments.payee.accountnumber,
                            value: self.payeeDetails().sepaDomesticPayee.iban
                        }
                    ],
                    [
                        {
                            label: self.payments.payee.accountname,
                            value: self.payeeDetails().sepaDomesticPayee.accountName
                        },
                        {
                            label: self.payments.payee.labels.bnkdetails,
                            value: [
                                self.payeeDetails().sepaDomesticPayee.bankDetails.code,
                                self.payeeDetails().sepaDomesticPayee.bankDetails.name,
                                self.payeeDetails().sepaDomesticPayee.bankDetails.city,
                                self.payeeDetails().sepaDomesticPayee.bankDetails.country
                            ]
                        }
                    ]
                ];
            } else if (self.payeeDetails().domesticPayeeType === "UK") {
                confirmScreenDetailsArray = [
                    [
                        {
                            label: self.payments.payee.accounttype,
                            value: self.payments.payee.accdomestic
                        },
                        {
                            label: self.payments.payee.accountnumber,
                            value: self.payeeDetails().ukDomesticPayee.accountNumber
                        }
                    ],
                    [
                        {
                            label: self.payments.payee.accountname,
                            value: self.payeeDetails().ukDomesticPayee.accountName
                        },
                        {
                            label: self.payments.payee.labels.bnkdetails,
                            value: [
                                self.payeeDetails().ukDomesticPayee.bankDetails.code,
                                self.payeeDetails().ukDomesticPayee.bankDetails.name,
                                self.payeeDetails().ukDomesticPayee.bankDetails.city,
                                self.payeeDetails().ukDomesticPayee.bankDetails.country
                            ]
                        }
                    ]
                ];
            }
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