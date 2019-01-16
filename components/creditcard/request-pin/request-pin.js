define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "baseLogger",

  "ojL10n!resources/nls/request-pin",
  "ojs/ojknockout",
  "ojs/ojselectcombobox",
  "ojs/ojknockout-validation",
  "ojs/ojvalidation"
], function(oj, ko, $, RequestPinModel, BaseLogger, ResourceBundle) {
  "use strict";
  return function(Params) {
    var self = this;
    ko.utils.extend(self, Params.rootModel);
    self.resource = ResourceBundle;
    self.common = self.resource.common;
    self.isDataLoaded = ko.observable(false);
    self.name = ko.observable();
    self.person = ko.observable();
    self.initiateAddOn = ko.observable(true);
    self.verifyAddOn = ko.observable(false);
    self.confirmAddOn = ko.observable(false);
    self.confirmData = ko.observable();
    self.referenceNumber = ko.observable();
    self.validationTracker = ko.observable();
    self.srNo = ko.observable();
    self.addressDetails = {
      modeofDelivery: ko.observable(null),
      addressType: ko.observable(null),
      addressTypeDescription: ko.observable(null),
      postalAddress: ko.observable({}),
      city: ko.observable(null),
      country: ko.observable(null),
      branch: ko.observable(null)
    };
    Params.dashboard.headerName(self.resource.requestPin.cardHeading);
    self.additionalCardDetails = ko.observable();
    self.creditCardId = ko.observable();
    self.moduleURL = ko.observable();
    self.creditCardIdDisplay = ko.observable();
    self.cardObject = self.params;
    Params.baseModel.registerElement("confirm-screen");
    Params.baseModel.registerElement("address");
    Params.baseModel.registerComponent("review-request-pin", "creditcard");
    Params.baseModel.registerComponent("reset-pin", "creditcard");
    Params.baseModel.registerComponent("auto-pay", "creditcard");
    Params.baseModel.registerComponent("add-on-card", "creditcard");
    Params.baseModel.registerComponent("card-pay", "creditcard");
    Params.baseModel.registerComponent("card-statement", "creditcard");
    Params.baseModel.registerComponent("block-card", "creditcard");
    var valueToSend;
    self.creditCardId.subscribe(function() {
      self.isDataLoaded(false);
      if (Params.baseModel.small()) {
        self.cardObject = self.additionalCardDetails() ? self.additionalCardDetails() : self.cardObject;
      }
      self.creditCardIdDisplay(self.cardObject.creditCard.displayValue);
      ko.tasks.runEarly();
      self.isDataLoaded(true);
    });
    if (self.params.id) {
      self.creditCardId(self.params.id.value);
      self.creditCardIdDisplay(self.params.id.displayValue);
    }
    if (self.params.jsonData) {
      self.moduleURL(self.params.jsonData.moduleURL);
    }
    self.reviewTransactionName = {
      header: self.resource.requestPin.review,
      reviewHeader: self.resource.requestPin.reviewHeader
    };
    self.showFloatingPanel = function () {
        $("#panelCreditCard4").trigger("openFloatingPanel");
    };
    self.addOnVerify = function() {
      if (!Params.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }
      if (self.addressDetails.modeofDelivery() === "ACC") {
        valueToSend = {
          "address": {
            "codCountry": self.addressDetails.postalAddress.country
          },
          "deliveryDetails": {
            "modeOfDelivery": "COR",
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
              "state": self.addressDetails.postalAddress.state,
              "city": self.addressDetails.postalAddress.city,
              "country": self.addressDetails.postalAddress.country,
              "postalCode": self.addressDetails.postalAddress.zipCode
            }
          },
          "addressType": self.addressDetails.addressType(),
          "modeOfDelivery": "COR"
        };
      } else {
        valueToSend = {
          "address": {},
          "deliveryDetails": {
            "modeOfDelivery": self.addressDetails.modeofDelivery(),
            "branches": {
              "namBranch": self.addressDetails.postalAddress.branch,
              "city": self.addressDetails.postalAddress.city,
              "bankCode": self.addressDetails.postalAddress.branch
            }
          },
          "addressType": self.addressDetails.addressType(),
          "modeOfDelivery": self.addressDetails.modeofDelivery(),
          "branch": {
            "namBranch": self.addressDetails.postalAddress.branch,
            "city": self.addressDetails.postalAddress.city,
            "bankCode": self.addressDetails.postalAddress.branch
          }
        };
      }
      self.confirmData(valueToSend);
      self.initiateAddOn(false);
      self.isDataLoaded(true);
      self.verifyAddOn(true);
      self.confirmAddOn(false);
      var context = {};
      context.headerName = Params.dashboard.headerName();
      context.creditCardId = self.creditCardId();
      context.initiateAddOn = self.initiateAddOn();
      context.verifyAddOn = self.verifyAddOn();
      context.confirmAddOn = self.confirmAddOn();
      context.isDataLoaded = self.isDataLoaded();
      context.creditCardIdDisplay = self.creditCardIdDisplay();
      context.addressDetails = self.addressDetails;
      Params.dashboard.loadComponent("review-request-pin", context, self);
    };
    self.requestPinConfirm = function() {
      RequestPinModel.updatePIN(ko.toJSON(self.confirmData()), self.creditCardId()).done(function(data, status, jqXHR) {
        self.srNo(data.serviceID);
        self.referenceNumber(data.serviceID);
        self.initiateAddOn(false);
        self.verifyAddOn(false);
        Params.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXHR,
          sr: true,
          transactionName: self.resource.requestPin.transactionName,
          serviceNo: data.serviceID,
          srNo: self.srNo(),
          confirmScreenExtensions: {
            isSet: true,
            template: "confirm-screen/cc-template",
            taskCode: "CC_N_CRDS",
            flagPinRequest: true,
            creditCardIdDisplay: self.creditCardIdDisplay(),
            addressDetails: self.addressDetails
          }
        }, self);
      });
    };
    self.creditCardParser = function(data) {
      data.accounts = data.creditcards;
      data.accounts.map(function(creditCard) {
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
