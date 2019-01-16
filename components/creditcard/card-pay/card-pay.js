define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/card-pay",
    "ojs/ojknockout",
    "ojs/ojknockout-validation",
    "ojs/ojvalidation",
    "ojs/ojradioset"
], function (oj, ko, $, CardPayModel, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        self.cardObject = self.params;
        rootParams.dashboard.headerName(self.resource.pay.cardHeading);
        self.accBalance = ko.observable();
        self.payAmtType = ko.observable(self.resource.pay.outstanding);
        self.initiateCancel = ko.observable(false);
        self.verifyCancel = ko.observable(false);
        self.otpCancel = ko.observable(false);
        self.confirmCancel = ko.observable(false);
        self.validationTracker = ko.observable();
        self.sourceAccountLoaded = ko.observable(false);
        self.accounts = ko.observable();
        self.additionalDetails = ko.observable();
        self.selectedAccount = ko.observable();
        self.selectedAccountData = ko.observable();
        self.specificedAmount = ko.observable();
        self.refernceNumber = ko.observable("");
        self.paymentId = ko.observable("");
        self.invalidOtpEntered = ko.observable(false);
        self.authKey = ko.observable("");
        rootParams.baseModel.registerElement("amount-input");
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.baseModel.registerComponent("review-card-pay", "creditcard");
        rootParams.baseModel.registerComponent("reset-pin", "creditcard");
        rootParams.baseModel.registerComponent("auto-pay", "creditcard");
        rootParams.baseModel.registerComponent("add-on-card", "creditcard");
        rootParams.baseModel.registerComponent("card-statement", "creditcard");
        rootParams.baseModel.registerComponent("block-card", "creditcard");
        rootParams.baseModel.registerComponent("request-pin", "creditcard");
        self.additionalCardDetails = ko.observable();
        self.creditCardId = ko.observable();
        self.moduleURL = ko.observable();
        self.creditCardIdDisplay = ko.observable();
        self.creditCardId.subscribe(function () {
            self.initiateCancel(false);
            if (rootParams.baseModel.small()) {
                self.cardObject = self.additionalCardDetails() ? self.additionalCardDetails() : self.cardObject;
            }
            ko.tasks.runEarly();
            self.creditCardIdDisplay(self.cardObject.creditCard.displayValue);
            self.initiateCancel(true);
        });
        if (self.params.id) {
            self.creditCardId(self.params.id.value);
            self.creditCardIdDisplay(self.params.id.displayValue);
        }
        if (self.params.jsonData) {
            self.moduleURL(self.params.jsonData.moduleURL);
        }

        var confData = null;
        self.payVerify = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            if (typeof self.additionalDetails() === "undefined") {
                return;
            }
            var payAmt = null;
            var payCurr = null;
            if (self.payAmtType() === "Minimum") {
                payAmt = self.cardObject.due.minimumAmount.amount;
                payCurr = self.cardObject.cardCurrency;
            } else if (self.payAmtType() === "Outstanding") {
                payAmt = self.cardObject.due.billedAmount.amount;
                payCurr = self.cardObject.cardCurrency;
            } else {
                payAmt = parseFloat(self.specificedAmount());
                payCurr = self.cardObject.cardCurrency;
            }
            confData = {
                amount: {
                    "currency": payCurr,
                    "amount": payAmt
                },
                userReferenceNo: null,
                remarks: null,
                purpose: null,
                debitAccountId: self.additionalDetails().account.id,
                creditCardId: self.cardObject.creditCard
            };
            self.initiateCancel(false);
            self.verifyCancel(true);
            var context = {};
            context.creditCardIdDisplay = self.creditCardIdDisplay();
            context.headerName = rootParams.dashboard.headerName();
            context.verifyCancel = self.verifyCancel();
            context.initiateCancel = self.initiateCancel();
            context.confData = confData;
            rootParams.dashboard.loadComponent("review-card-pay", context, self);
        };
        self.showFloatingPanel = function () {
            $("#panelCreditCard3").trigger("openFloatingPanel");
        };
        self.payConfirm = function () {
            CardPayModel.paybill(ko.toJSON(confData)).done(function (data, status, jqXHR) {
                self.refernceNumber(data.externalReferenceId);
                self.verifyCancel(false);
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    transactionName: self.resource.pay.payConfirm,
                    hostReferenceNumber: self.refernceNumber(),
                    confirmScreenExtensions: {
                      isSet: true,
                      template: "confirm-screen/cc-template",
                      confData: confData,
                      flagCardPay: true,
                      taskCode: "CC_F_CPC"
                    }
                }, self);
                self.otpCancel(false);
            });
        };
        self.confirmPaymentWithAuth = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            CardPayModel.confirmPaymentWithAuth(self.paymentId(), self.authKey()).done(function (data) {
                self.refernceNumber(data.externalReferenceId);
                if (data.tokenValid) {
                    self.otpCancel(false);
                    self.confirmCancel(true);
                } else {
                    self.invalidOtpEntered(true);
                }
            });
        };
        self.creditCardParser = function (data) {
            data.accounts = data.creditcards;
            data.accounts.map(function (creditCard) {
                creditCard.id = creditCard.creditCard;
                creditCard.partyId = data.associatedParty;
                creditCard.accountNickname = creditCard.cardNickname;
                creditCard.associatedParty = data.associatedParty;
                return creditCard;
            });
            return data;
        };
    };
});
