define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/auto-pay",
    "ojs/ojknockout",
    "ojs/ojknockout-validation",
    "ojs/ojvalidation",
    "ojs/ojradioset"
], function (oj, ko, $, AutoPayModel, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        rootParams.dashboard.headerName(self.resource.autopay.cardHeading);
        self.cardObject = self.params;
        self.payAmtType = ko.observable("");
        self.registerCancel = ko.observable(false);
        self.initiateCancel = ko.observable(false);
        self.verifyCancel = ko.observable(false);
        self.confirmCancel = ko.observable(false);
        self.validationTracker = ko.observable();
        self.accounts = ko.observable();
        self.additionalDetails = ko.observable();
        self.selectedAccount = ko.observable();
        self.referenceNumber = ko.observable("");
        self.currentRepayMode = ko.observable("");
        self.currentActionType = ko.observable("");
        self.additionalCardDetails = ko.observable();
        self.creditCardId = ko.observable();
        self.moduleURL = ko.observable();
        self.creditCardIdDisplay = ko.observable();
        self.refLinksLoaded = ko.observable(false);
        self.srNo = ko.observable();
        self.creditCardArray = ko.observableArray([]);
        self.addonCardFlag = ko.observable(false);
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.baseModel.registerComponent("review-auto-pay", "creditcard");
        rootParams.baseModel.registerComponent("reset-pin", "creditcard");
        rootParams.baseModel.registerComponent("add-on-card", "creditcard");
        rootParams.baseModel.registerComponent("card-pay", "creditcard");
        rootParams.baseModel.registerComponent("card-statement", "creditcard");
        rootParams.baseModel.registerComponent("block-card", "creditcard");
        rootParams.baseModel.registerComponent("request-pin", "creditcard");
        var confData;
        self.creditCardId.subscribe(function () {
            if (rootParams.baseModel.small()) {
                self.cardObject = self.additionalCardDetails() ? self.additionalCardDetails() : self.params;
            }
            ko.tasks.runEarly();
            if (self.creditCardId() && self.cardObject.cardType === "ADDON") {
                self.addonCardFlag(true);
            } else {
                self.addonCardFlag(false);
                self.initAutoPay();
            }
            self.creditCardIdDisplay(self.cardObject.creditCard.displayValue);
        });
        if (self.params.id) {
            self.creditCardId(self.params.id.value);
            self.creditCardIdDisplay(self.params.id.displayValue);
        }
        if (self.params.jsonData) {
            self.moduleURL(self.params.jsonData.moduleURL);
        }

        self.autoPayRegister = function () {
            self.registerCancel(false);
            self.initiateCancel(true);
        };
        self.autoPayCancelRegister = function () {
            history.back();
        };
        self.autoPayVerify = function (actionType) {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            self.currentActionType(actionType);
            if (typeof self.additionalDetails() === "function") {
                return;
            }
            var repayMode = null;
            if (self.currentActionType() === "reg") {
                repayMode = "A";
            } else {
                repayMode = self.currentRepayMode();
            }
            confData = {
                repayMode: repayMode,
                repaymentAmountType: self.payAmtType(),
                accountId: self.additionalDetails().account.id,
                partyId: self.partyId
            };
            var context = {};
            self.verifyCancel(true);
            context.headerName = rootParams.dashboard.headerName();
            context.confData = confData;
            context.actionType = actionType;
            context.verifyCancel = self.verifyCancel();
            context.creditCardIdDisplay = self.creditCardIdDisplay();
            rootParams.dashboard.loadComponent("review-auto-pay", context, self);
        };
        self.autoPayConfirm = function () {
            if (self.currentActionType() === "reg") {
                AutoPayModel.createAutopay(ko.toJSON(confData), self.creditCardId()).done(function (data, status, jqXhr) {
                    if (typeof data.serviceID !== "undefined") {
                        self.srNo(data.serviceID);
                        rootParams.dashboard.loadComponent("confirm-screen", {
                            jqXHR: jqXhr,
                            sr: true,
                            transactionName: self.resource.autopay.createAuto,
                            serviceNo: data.serviceID,
                            srNo:self.srNo(),
                            confirmScreenExtensions: {
                              isSet: true,
                              template: "confirm-screen/cc-template",
                              flagAutoPay: true,
                              confData: confData,
                              taskCode: "CC_N_ARRG"
                            }
                        }, self);
                    } else {
                        rootParams.dashboard.loadComponent("confirm-screen", {
                            jqXHR: jqXhr,
                            transactionName: self.resource.autopay.createAuto,
                            confirmScreenExtensions: {
                              isSet: true,
                              template: "confirm-screen/cc-template",
                              flagAutoPay: true,
                              confData: confData,
                              taskCode: "CC_N_ARRG"
                            }
                        }, self);
                    }
                    self.verifyCancel(false);
                    self.initiateCancel(false);
                    self.confirmCancel(true);
                });
            } else if (self.currentActionType() === "upd") {
                AutoPayModel.updateAutopay(ko.toJSON(confData), self.creditCardId()).done(function (data, status, jqXhr) {
                    if (typeof data.serviceID !== "undefined") {
                        self.srNo(data.serviceID);
                        rootParams.dashboard.loadComponent("confirm-screen", {
                            jqXHR: jqXhr,
                            sr: true,
                            transactionName: self.resource.autopay.updateAuto,
                            serviceNo: data.serviceID,
                            srNo:self.srNo(),
                            confirmScreenExtensions: {
                              isSet: true,
                              template: "confirm-screen/cc-template",
                              flagAutoPay: true,
                              confData: confData,
                              taskCode: "CC_N_ARU"
                            }
                        }, self);
                    } else {
                        rootParams.dashboard.loadComponent("confirm-screen", {
                            jqXHR: jqXhr,
                            transactionName: self.resource.autopay.updateAuto,
                            confirmScreenExtensions: {
                              isSet: true,
                              template: "confirm-screen/cc-template",
                              flagAutoPay: true,
                              confData: confData,
                              taskCode: "CC_N_ARU"
                            }
                        }, self);
                    }
                    self.verifyCancel(false);
                    self.initiateCancel(false);
                    self.confirmCancel(true);
                });
            } else if (self.currentActionType() === "dereg") {
                AutoPayModel.deleteAutopay(ko.toJSON(confData), self.creditCardId()).done(function (data, status, jqXhr) {
                    if (typeof data.serviceID !== "undefined") {
                        self.srNo(data.serviceID);
                        rootParams.dashboard.loadComponent("confirm-screen", {
                            jqXHR: jqXhr,
                            sr: true,
                            transactionName: self.resource.autopay.delete,
                            serviceNo: data.serviceID,
                            srNo:self.srNo(),

                            confirmScreenExtensions: {
                              isSet: true,
                              template: "confirm-screen/cc-template",
                              flagAutoPay: true,
                              confData: confData,
                              taskCode: "CC_N_ARDRG"
                            }
                        }, self);
                    } else {
                        rootParams.dashboard.loadComponent("confirm-screen", {
                            jqXHR: jqXhr,
                            transactionName: self.resource.autopay.delete,

                            confirmScreenExtensions: {
                              isSet: true,
                              template: "confirm-screen/cc-template",
                              flagAutoPay: true,
                              confData: confData,
                              taskCode: "CC_N_ARDRG"
                            }
                        }, self);
                    }
                    self.verifyCancel(false);
                    self.initiateCancel(false);
                    self.confirmCancel(true);
                });
            }
        };
        self.initAutoPay = function () {
            AutoPayModel.fetchAutopay(self.creditCardId()).done(function (data) {
                if (typeof data.repayMode !== "undefined") {
                    self.currentRepayMode("A");
                } else {
                    self.currentRepayMode("M");
                }
                if (self.currentRepayMode() === "M") {
                    self.payAmtType("TAD");
                    self.registerCancel(true);
                } else if (self.currentRepayMode() === "A") {
                    self.payAmtType(data.repaymentAmountType);
                    self.initiateCancel(true);
                }
            });
        };
        self.creditCardParser = function (data) {
            for (var i = 0; i < data.creditcards.length; i++) {
                if (data.creditcards[i].cardStatus === "ACT") {
                    self.creditCardArray.push(data.creditcards[i]);
                    data.accounts = self.creditCardArray();
                }
            }
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
        self.showFloatingPanel = function () {
            $("#panelCreditCard6").trigger("openFloatingPanel");
        };
    };
});
