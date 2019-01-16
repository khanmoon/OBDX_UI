define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "baseLogger",
  "ojL10n!resources/nls/reset-pin",
  "ojs/ojknockout",
  "ojs/ojselectcombobox",
  "ojs/ojknockout-validation",
  "ojs/ojvalidation",
  "ojs/ojaccordion",
  "ojs/ojcollapsible",
  "ojs/ojdatetimepicker",
  "ojs/ojtimezonedata",
  "ojs/ojvalidationgroup"
], function(oj, ko, $, ResetPinModel, BaseLogger, ResourceBundle) {
  "use strict";
  return function(Params) {
    var self = this;
    ko.utils.extend(self, Params.rootModel);
    self.resource = ResourceBundle;
    self.verifyCard = ko.observable(false);
    self.validationTracker = ko.observable();
    self.validationTrackerPin = ko.observable();
    self.additionalCardDetails = ko.observable();
    self.creditCardId = ko.observable();
    self.isDataLoaded = ko.observable(false);
    self.cardLoaded = ko.observable(false);
    self.creditCardIdDisplay = ko.observable();
    self.moduleURL = ko.observable();
    self.debitCardDetailsObject = ko.observable(self.params);
    Params.baseModel.registerElement("confirm-screen");
    Params.baseModel.registerComponent("auto-pay", "creditcard");
    Params.baseModel.registerComponent("add-on-card", "creditcard");
    Params.baseModel.registerComponent("card-pay", "creditcard");
    Params.baseModel.registerComponent("card-statement", "creditcard");
    Params.baseModel.registerComponent("block-card", "creditcard");
    Params.baseModel.registerComponent("request-pin", "creditcard");
    var validationUrl = "";
    var resetPinUrl = "";
    var creditCardId = "";
    var debitCardId = "";
    var accountId = "";

    self.displayOptions = {
      "validatorHint": "none"
    };
    if (self.params.jsonData) {
      self.moduleURL(self.params.jsonData.moduleURL);
    }
    if (self.currentType || self.selectedType) {
      if (self.currentType === "CCA" || self.selectedType() === "CCA") {
        Params.dashboard.headerName(self.resource.resetPin.creditCardHeading);
        creditCardId = "";
        creditCardId = self.params.creditCard.value;
        self.creditCardIdDisplay(self.params.creditCard.displayValue);
        self.isDataLoaded(false);
        ko.tasks.runEarly();
        self.isDataLoaded(true);
        validationUrl = "accounts/cards/credit/" + creditCardId + "/validation";
        resetPinUrl = "accounts/cards/credit/" + creditCardId + "/pin/reset";
      } else if (self.currentType === "CSA" || self.selectedType() === "CSA") {
        self.isDataLoaded(false);
        ko.tasks.runEarly();
        self.isDataLoaded(true);
        Params.dashboard.headerName(self.resource.resetPin.debitCardHeading);
        debitCardId = self.params.cardNo.value;
        accountId = self.params.accountId.value;
        validationUrl = "accounts/demandDeposit/" + accountId + "/debitCards/" + debitCardId + "/validation";
        resetPinUrl = "accounts/demandDeposit/" + accountId + "/debitCards/" + debitCardId + "/pin/reset";
      }
    } else if (self.params.applicationType === "creditcard") {
      Params.dashboard.headerName(self.resource.resetPin.creditCardHeading);
      creditCardId = "";
      creditCardId = self.params.creditCard.value;
      self.creditCardIdDisplay(self.params.creditCard.displayValue);
      self.isDataLoaded(false);
      ko.tasks.runEarly();
      self.isDataLoaded(true);
      validationUrl = "accounts/cards/credit/" + creditCardId + "/validation";
      resetPinUrl = "accounts/cards/credit/" + creditCardId + "/pin/reset";
    } else if (self.params.applicationType === "debit-card" || (self.params.jsonData && self.params.jsonData.applicationType === "debit-card")) {
      self.isDataLoaded(false);
      ko.tasks.runEarly();
      self.isDataLoaded(true);
      Params.dashboard.headerName(self.resource.resetPin.debitCardHeading);
      debitCardId = self.params.cardNo.value;
      accountId = self.params.accountId.value;
      validationUrl = "accounts/demandDeposit/" + accountId + "/debitCards/" + debitCardId + "/validation";
      resetPinUrl = "accounts/demandDeposit/" + accountId + "/debitCards/" + debitCardId + "/pin/reset";
    } else if (self.params.type === "CCA") {
      Params.dashboard.headerName(self.resource.resetPin.creditCardHeading);
      self.cardLoaded(false);
      self.isDataLoaded(false);
      ko.tasks.runEarly();
      self.cardLoaded(true);
      self.creditCardId.subscribe(function() {
        self.creditCardIdDisplay(self.additionalCardDetails().creditCard.displayValue);
        self.isDataLoaded(true);
      });
    } else {
      Params.dashboard.headerName(self.resource.resetPin.debitCardHeading);
      self.isDataLoaded(false);
      ko.tasks.runEarly();
      self.isDataLoaded(true);
      Params.dashboard.headerName(self.resource.resetPin.debitCardHeading);
      if (self.params.cardNo) {
        debitCardId = self.params.cardNo.value;
      }
      if (self.params.accountId) {
        accountId = self.params.accountId.value;
      }
      validationUrl = "accounts/demandDeposit/" + accountId + "/debitCards/" + debitCardId + "/validation";
      resetPinUrl = "accounts/demandDeposit/" + accountId + "/debitCards/" + debitCardId + "/pin/reset";
    }
    self.expiryMonth = ko.observable();
    self.expiryYear = ko.observable();
    self.cvvNumber = ko.observable();
    self.pinValue = ko.observable();
    self.reEnterPinValue = ko.observable();
    self.getNewValidationModel = function() {
      var KoModel = ResetPinModel.getNewValidationModel();
      return KoModel;
    };
    self.getNewPinResetModel = function() {
      var KoModel = ResetPinModel.getNewPinResetModel();
      return KoModel;
    };
    self.validationPayload = ko.observable(self.getNewValidationModel());
    self.pinResetPayload = ko.observable(self.getNewPinResetModel());
    self.validateCard = function() {
      var cardDetailsTracker = document.getElementById("cardDetailsTracker");
      if (cardDetailsTracker && cardDetailsTracker.valid !== "valid") {
        cardDetailsTracker.showMessages();
        cardDetailsTracker.focusOn("@firstInvalidShown");
        return false;
      }
      self.validationPayload().expiryMonth = self.expiryMonth();
      self.validationPayload().expiryYear = self.expiryYear();
      self.validationPayload().cvv = self.cvvNumber();
      if (self.creditCardId()) {
        validationUrl = "accounts/cards/credit/" + self.creditCardId() + "/validation";
      }
      ResetPinModel.validateCardDetails(ko.toJSON(self.validationPayload()), validationUrl).done(function() {
        self.verifyCard(true);
        $("#collapsibleDiv").ojCollapsible("option", "expanded", false);
        $("#collapsibleDiv").ojCollapsible("option", "disabled", true);
        $("#collapsibleDiv2").ojCollapsible("option", "disabled", false);
        $("#collapsibleDiv2").ojCollapsible("option", "expanded", true);
      });
    };
    self.resetPin = function() {
      var resetPinTracker = document.getElementById("resetPinTracker");
      if (resetPinTracker && resetPinTracker.valid !== "valid") {
        resetPinTracker.showMessages();
        resetPinTracker.focusOn("@firstInvalidShown");
        return false;
      }
      if (self.pinValue() !== self.reEnterPinValue()) {
        Params.baseModel.showMessages(null, [self.resource.resetPin.mismatch], "ERROR");

      } else {
        self.pinResetPayload().pin = self.reEnterPinValue();
        if (self.creditCardId()) {
          resetPinUrl = "accounts/cards/credit/" + self.creditCardId() + "/pin/reset";
        }
        ResetPinModel.resetPin(ko.toJSON(self.pinResetPayload()), resetPinUrl).done(function(data, status, jqXhr) {
          var taskId;
          if (self.params.applicationType === "debit-card" || (self.params.jsonData && self.params.jsonData.applicationType === "debit-card")) {
            taskId = "CH_N_RP";
          } else if (self.params.applicationType === "creditcard") {
            taskId = "CC_N_RP";
          }
          Params.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            hostReferenceNumber: data.externalReferenceId,
            transactionName: self.resource.resetPin.resetPinSuccessMsg,
            confirmScreenExtensions: {
              isSet: true,
              template: "confirm-screen/cc-template",
              taskCode: taskId
            }
          }, self);
        });
      }
    };
    self.cancelConfirmation = function() {
      Params.dashboard.openDashBoard();
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
    self.showFloatingPanel = function() {
      if (self.creditCardIdDisplay()) {
        $("#panelCreditCard7").trigger("openFloatingPanel");
      } else {
        $("#panelDebitCard6").trigger("openFloatingPanel");
      }
    };
  };
});
