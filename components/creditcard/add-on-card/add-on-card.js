define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",
    "ojL10n!resources/nls/add-on-card",
    "ojs/ojknockout",
    "ojs/ojselectcombobox",
    "ojs/ojknockout-validation",
    "ojs/ojvalidation"
], function (oj, ko, $, AddOndModel, BaseLogger, ResourceBundle) {
    "use strict";
    return function (Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.isDataLoaded = ko.observable(false);
        Params.baseModel.registerElement("amount-input");
        self.reasonsArray = self.reasonsArray || ko.observableArray();
        self.name = ko.observable();
        self.selectedRelationship = self.selectedRelationship || ko.observableArray([]);
        self.initiateAddOn = ko.observable(true);
        self.verifyAddOn = ko.observable(false);
        self.validationTracker = ko.observable();
        self.currentValueCredit = ko.observable();
        self.isNameLoaded = ko.observable(false);
        self.creditLimitCurrency = ko.observable();
        self.updatecreditLimit = ko.observable();
        self.availableCreditLimit = ko.observable();
        self.currentValueCashLimit = ko.observable();
        self.cashLimitCurrency = ko.observable();
        self.updatecashLimit = ko.observable();
        self.availableCashLimit = ko.observable();
        ko.utils.extend(self, Params.rootModel);
        self.cardObject = self.params;
        self.resource = ResourceBundle;
        Params.dashboard.headerName(self.resource.addonCard.cardHeading);
        Params.baseModel.registerElement("confirm-screen");
        Params.baseModel.registerComponent("review-add-on-card", "creditcard");
        Params.baseModel.registerComponent("reset-pin", "creditcard");
        Params.baseModel.registerComponent("auto-pay", "creditcard");
        Params.baseModel.registerComponent("add-on-card", "creditcard");
        Params.baseModel.registerComponent("card-pay", "creditcard");
        Params.baseModel.registerComponent("card-statement", "creditcard");
        Params.baseModel.registerComponent("block-card", "creditcard");
        Params.baseModel.registerComponent("request-pin", "creditcard");
        Params.baseModel.registerElement("address");
        self.common = self.resource.common;
        self.supplementaryCardHolderRelationship = ko.observable();
        self.additionalCardDetails = ko.observable();
        self.creditCardId = ko.observable();
        self.moduleURL = ko.observable();
        self.partyId = ko.observable();
        self.primaryCardId = ko.observable();
        self.limitLoaded = ko.observable(false);
        self.creditCardIdDisplay = ko.observable();
        self.mode = ko.observable("VIEW");
        self.srNo = ko.observable();
        var valueToSend;
        var context = {};
        self.addressDetails = self.addressDetails || {
            modeofDelivery: ko.observable(null),
            addressType: ko.observable(null),
            addressTypeDescription: ko.observable(null),
            postalAddress: ko.observable({}),
            city: ko.observable(null),
            country: ko.observable(null),
            branch: ko.observable(null)
        };
        self.reviewTransactionName = {
          header: self.resource.addonCard.review,
          reviewHeader: self.resource.addonCard.reviewHeading
        };
        self.creditCardId.subscribe(function () {
            self.isDataLoaded(false);
            if (Params.baseModel.small()) {
                self.cardObject = self.additionalCardDetails() ? self.additionalCardDetails() : self.cardObject;
                if (self.mode() === "VIEW") {
                    self.primaryCardId(self.cardObject.primaryCardId.value);
                    self.partyId(self.cardObject.associatedParty.value);
                }
            } else {
                if (self.params.associatedParty)
                    self.partyId(self.params.associatedParty.value);
                self.primaryCardId(self.params.primaryCardId.value);
            }
            ko.tasks.runEarly();
            self.creditCardIdDisplay(self.cardObject.creditCard.displayValue);
            self.fetchCardLimit();
            self.isDataLoaded(true);
        });
        if (self.params.id) {
            self.creditCardId(self.params.id.value);
            self.creditCardIdDisplay(self.params.id.displayValue);
        }
        if (self.params.jsonData) {
            self.moduleURL(self.params.jsonData.moduleURL);
        }

        if (self.mode() === "VIEW") {
            self.fetchCardLimit = function () {
                AddOndModel.fetchLimit(self.primaryCardId()).done(function (data) {
                    for (var i = 0; i < data.limitDTO.length; i++) {
                        if (data.limitDTO[i].type === "CA") {
                            self.currentValueCashLimit(data.limitDTO[i].total.amount);
                            self.availableCashLimit(data.limitDTO[i].available.amount);
                        } else if (data.limitDTO[i].type === "CR") {
                            self.currentValueCredit(data.limitDTO[i].total.amount);
                            self.availableCreditLimit(data.limitDTO[i].available.amount);
                        }
                    }
                    self.isDataLoaded(true);
                });
                if (self.mode() === "VIEW") {
                    self.cashLimitCurrency(self.cardObject.cardCurrency);
                    self.creditLimitCurrency(self.cardObject.cardCurrency);
                }
            };
        }
        if (!self.verifyAddOn() && self.selectedRelationship().length === 0) {
            self.isNameLoaded(false);
            AddOndModel.getRelationshipList().done(function (data) {
                for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                    self.reasonsArray.push({
                        code: data.enumRepresentations[0].data[i].code,
                        description: self.resource.addonCard[data.enumRepresentations[0].data[i].code]
                    });
                }
                ko.tasks.runEarly();
                self.isNameLoaded(true);
            });
        }
        self.addOnVerify = function () {
            if (!Params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            valueToSend = {
                "supplementaryCardHolderRelationship": self.selectedRelationship()[0],
                "partyId": self.partyId(),
                "primaryCardNo": self.primaryCardId(),
                "creditLimit": self.updatecreditLimit(),
                "cashLimit": self.updatecashLimit(),
                "suplemtryCdHolderDetails": {
                    "addressType": self.addressDetails.addressType(),
                    "embossingName": self.name(),
                    "email": "",
                    "name": "",
                    "mothersMaidenName": "Name"
                },
                "deliveryDetails": {
                    "modeOfDelivery": self.addressDetails.modeofDelivery() === "ACC" ? "COR" : self.addressDetails.modeofDelivery(),
                    "branches": {
                        "namBranch": self.addressDetails.postalAddress.branch,
                        "city": self.addressDetails.postalAddress.city,
                        "bankCode": self.addressDetails.postalAddress.branch
                    },
                    "addressDetails": {
                        "line1": self.addressDetails.postalAddress.line1,
                        "line2": self.addressDetails.postalAddress.line2,
                        "line3": self.addressDetails.postalAddress.line3,
                        "line4": self.addressDetails.postalAddress.line4,
                        "line5": self.addressDetails.postalAddress.line5,
                        "line6": self.addressDetails.postalAddress.line6,
                        "line7": self.addressDetails.postalAddress.line7,
                        "line8": self.addressDetails.postalAddress.line8,
                        "line9": self.addressDetails.postalAddress.line9,
                        "line10": self.addressDetails.postalAddress.line10,
                        "line11": self.addressDetails.postalAddress.line11,
                        "line12": self.addressDetails.postalAddress.line12,
                        "city": self.addressDetails.postalAddress.city,
                        "state": self.addressDetails.postalAddress.state,
                        "country": self.addressDetails.postalAddress.country,
                        "postalCode": self.addressDetails.postalAddress.zipCode
                    }
                }
            };
            self.initiateAddOn(false);
            self.isNameLoaded(false);
            self.verifyAddOn(true);
            self.isDataLoaded(true);
            self.isNameLoaded(true);
            self.mode("REVIEW");
            context.valueToSend = valueToSend;
            context.supplementaryCardHolderRelationship = self.selectedRelationship()[0];
            context.name = self.name();
            context.headerName = Params.dashboard.headerName();
            context.creditCardId = self.creditCardId();
            context.primaryCardId = self.primaryCardId();
            context.updatecreditLimit = self.updatecreditLimit();
            context.updatecashLimit = self.updatecashLimit();
            context.cashLimitCurrency = self.cashLimitCurrency();
            context.creditLimitCurrency = self.creditLimitCurrency();
            context.initiateAddOn = self.initiateAddOn();
            context.verifyAddOn = self.verifyAddOn();
            context.creditCardIdDisplay = self.creditCardIdDisplay();
            context.mode = self.mode();
            context.isDataLoaded = self.isDataLoaded();
            context.isNameLoaded = self.isNameLoaded();
            context.addressDetails = self.addressDetails;
            Params.dashboard.loadComponent("review-add-on-card", context, self);
        };
        self.addOnConfirm = function () {
            AddOndModel.addCard(ko.toJSON(valueToSend), self.creditCardId()).done(function (data, status, jqXhr) {
                self.initiateAddOn(false);
                self.verifyAddOn(false);
                self.srNo(data.serviceID);
                Params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    sr: true,
                    transactionName: self.resource.addonCard.addOnConfirm,
                    serviceNo: data.serviceID,
                    srNo: self.srNo(),
                    confirmScreenExtensions: {
                      isSet: true,
                      template: "confirm-screen/cc-template",
                      taskCode: "CC_N_SCR",
                      flagAddOnCard: true
                    }
                }, self);
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
        self.showFloatingPanel = function () {
            $("#panelCreditCard8").trigger("openFloatingPanel");
        };
    };
});
