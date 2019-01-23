define([
  "knockout",
  "jquery",
  "./model",

  "ojL10n!resources/nls/td-amend",
  "ojs/ojknockout-validation",
  "ojs/ojvalidationgroup",
  "ojs/ojvalidation",
  "ojs/ojselectcombobox"
], function(ko, $, TDAmendModel, locale) {
  "use strict";
  return function(rootParams) {
    var self = this;
    self.dataModel = ko.observable({
      transferOptionsList: null,
      networkTypeList: null,
      branchList: null,
      branchAddress: null,
      screenBack: false,
      accountNumber: ko.observable(),
      buttonSection: ko.observable(false)
    });
    var confirmScreenExtensions = {};
    self.module = ko.observable();
    self.maturityInstructionList = ko.observable();
    self.additionalDetails = ko.observable();
    self.maturityInstructionLoaded = ko.observable(false);
    self.validationTracker = ko.observable();
    self.groupValid = ko.observable();
    ko.utils.extend(self, rootParams.rootModel);
    self.rollOverType = ko.observable(self.params.rolloverType);
    self.accountNumberSelected = ko.observable(self.params && self.params.id ? self.params.id.value : null);
    self.locale = locale;
    rootParams.dashboard.headerName(self.locale.amendTD.editMaturityDetails);
    rootParams.baseModel.registerComponent("account-nickname", "accounts");
    rootParams.baseModel.registerComponent("td-payout", "term-deposits");
    rootParams.baseModel.registerComponent("review-td-amend", "term-deposits");
    rootParams.baseModel.registerElement("confirm-screen");
    rootParams.baseModel.registerElement("amount-input");
    rootParams.baseModel.registerElement("account-input");
    var getNewKoModel = function() {
      return ko.mapping.fromJS(TDAmendModel.getNewModel());
    };
    self.rootModelInstance = self.rootModelInstance || getNewKoModel();
    if (self.previousState && self.previousState.data) {
      self.rootModelInstance.amendData = self.previousState.data;
      self.rollOverType(self.rootModelInstance.amendData.rollOverType());
    }
    self.dataModel().buttonSection(!!self.rollOverType());
    if(!(self.previousState && !self.previousState.rolloverType) && self.params.rolloverType){
      self.rootModelInstance.amendData.rollOverType(self.params.rolloverType);
    }
    if (!(self.previousState && !self.previousState.payoutInstructions) && self.params.payoutInstructions && self.params.payoutInstructions[0]) {
      if (self.params.payoutInstructions[0].accountId) {
        self.rootModelInstance.amendData.payoutInstructions()[0].accountId.displayValue(self.params.payoutInstructions[0].accountId.displayValue);
        self.rootModelInstance.amendData.payoutInstructions()[0].accountId.value(self.params.payoutInstructions[0].accountId.value);
      } else {
        self.rootModelInstance.amendData.payoutInstructions()[0].account(self.params.payoutInstructions[0].account);
      }
      if (self.params.payoutInstructions[0].branchAddress === null) {
        self.rootModelInstance.amendData.payoutInstructions()[0].address.city("");
        self.rootModelInstance.amendData.payoutInstructions()[0].address.country("");
        self.rootModelInstance.amendData.payoutInstructions()[0].address.line1("");
        self.rootModelInstance.amendData.payoutInstructions()[0].address.line2("");
      } else {
        self.rootModelInstance.amendData.payoutInstructions()[0].address.city(self.params.payoutInstructions[0].branchAddress.city);
        self.rootModelInstance.amendData.payoutInstructions()[0].address.country(self.params.payoutInstructions[0].branchAddress.country);
        self.rootModelInstance.amendData.payoutInstructions()[0].address.line1(self.params.payoutInstructions[0].branchAddress.line1);
        self.rootModelInstance.amendData.payoutInstructions()[0].address.line2(self.params.payoutInstructions[0].branchAddress.line2);
      }
      if (self.params.payoutInstructions[0].branchId === null) {
        self.rootModelInstance.amendData.payoutInstructions()[0].branchId("");
      } else {
        self.rootModelInstance.amendData.payoutInstructions()[0].branchId(self.params.payoutInstructions[0].branchId);
      }
      self.rootModelInstance.amendData.payoutInstructions()[0].beneficiaryName(self.params.payoutInstructions[0].beneficiaryName);
      self.rootModelInstance.amendData.payoutInstructions()[0].bankName(self.params.payoutInstructions[0].branchName);
      self.rootModelInstance.amendData.payoutInstructions()[0].type(self.params.payoutInstructions[0].type);
      self.rootModelInstance.amendData.payoutInstructions()[0].percentage(self.params.payoutInstructions[0].percentage);
      self.rootModelInstance.amendData.payoutInstructions()[0].payoutComponentType(self.params.payoutInstructions[0].payoutComponentType);
    }
    self.mainFunction = function() {
      TDAmendModel.fetchMaturityInstruction().done(function(data) {
        self.maturityInstructionList(data.enumRepresentations[0].data);
        self.maturityInstructionLoaded(true);
      });
    };
    self.checkAccountDropDown = ko.computed(function() {
      if (self.accountNumberSelected()) {
        TDAmendModel.fetchAccountDetails(self.accountNumberSelected()).done(function(data) {
          self.module(data.termDepositDetails.module);
          self.rootModelInstance.amendData.module(self.module());
          self.mainFunction();
        });
      }
    }, self);
    if (self.accountNumberSelected()) {
      self.mainFunction();
    }
    self.maturityInstructionChange = function(event) {
      if (event.detail.value) {
        self.dataModel().buttonSection(true);
        if (self.rollOverType()) {
          self.rootModelInstance.amendData.rollOverType(self.rollOverType()[0]);
        }
        if (self.rootModelInstance.amendData.rollOverType() === "S") {
          self.rootModelInstance.amendData.rollOverAmount.currency(self.additionalDetails() ? self.additionalDetails().account.principalAmount.currency : self.params.currencyCode);
        }
      }
    };
    self.saveData = function() {
      var tracker = document.getElementById("tdTracker");
      if (tracker.valid === "valid") {
        self.tdAmendData = self.rootModelInstance.amendData;
        if (self.additionalDetails().account) {
          self.tdAmendData.id = {
            value: self.additionalDetails().account.id.value,
            displayValue: ko.observable(self.additionalDetails().account.id.displayValue)
          };
        } else {
          self.tdAmendData.id = {
            value: ko.observable(self.accountNumberSelected().value),
            displayValue: ko.observable(self.accountNumberSelected().displayValue)
          };
        }
        rootParams.dashboard.loadComponent("review-td-amend", {
          mode: "review",
          data: self.rootModelInstance.amendData,
          confirmScreenExtensions: confirmScreenExtensions
        }, self);
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };
    self.confirmAmendTD = function() {
      var ignoreProp = [];
      switch (self.rootModelInstance.amendData.rollOverType()) {
        case "A":
          self.rootModelInstance.amendData.payoutInstructions()[0].payoutComponentType("P");
          ignoreProp.push("rollOverAmount");
          break;
        case "P":
          self.rootModelInstance.amendData.payoutInstructions()[0].payoutComponentType("I");
          ignoreProp.push("rollOverAmount");
          break;
        case "S":
          self.rootModelInstance.amendData.payoutInstructions()[0].payoutComponentType("P");
          break;
        case "I":
          ignoreProp.push("payoutInstructions");
          ignoreProp.push("rollOverAmount");
          break;
        default:
          break;
      }
      TDAmendModel.amendTD(ko.mapping.toJSON(self.rootModelInstance.amendData, {
        "ignore": ignoreProp
      }), self.accountNumberSelected()).done(function(data, status, jqXHR) {
        rootParams.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXHR,
          transactionName: self.locale.amendTD.editMaturityDetails,
          eReceiptRequired: true,
          template: "confirm-screen/td-template",
          confirmScreenExtensions: confirmScreenExtensions
        }, self);
      });
    };
    self.dispose = function() {
      self.checkAccountDropDown.dispose();
    };
  };
});
