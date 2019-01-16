define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/service-requests-form-builder",
  "ojs/ojnavigationlist",
  "ojs/ojaccordion",
  "ojs/ojcheckboxset",
  "ojs/ojlabel",
  "ojs/ojradioset",
  "ojs/ojselectcombobox"
], function (oj, ko, $, AccountNumberDebitCardModel, ResourceBundle) {
  "use strict";
  return function (params) {
    var self = this;
    self.resource = ResourceBundle;
    self.labelName = ko.observable();
    self.isDisabled = ko.observable(params.isDisabled);
    self.formData = ko.observable(false);
    self.cardData = ko.observable(true);
    self.testInput = ko.observableArray();
    self.displayValue = ko.observableArray();
    self.accountNumberList = ko.observableArray([]);
    self.debitCardNumberList = ko.observableArray([]);
    self.isRequired = params.rootModel.validation.isMandatory;
    ko.utils.extend(self, params.rootModel);
    self.errorMessage = ko.observable();
    self.errorMessage(params.rootModel.errorMessage);
    if (self.isDisabled() === true) {
      self.formData(true);
    }
    self.fetchDebitCards = function (account) {
      self.cardData(false);
      AccountNumberDebitCardModel.getDebitCardNumberData(account).done(function (data) {
        self.debitCardNumberList().splice(0, self.debitCardNumberList().length);

        var len = data.debitCardDetails.length,
          i;
        for (i = 0; i < self.accountNumberList().length; i++) {
          if (self.accountNumberList()[i].description === self.testInput()[0]) {
            self.displayValue()[0] = self.accountNumberList()[i].code;
            break;
          }
        }
        for (i = 0; i < len; i++) {
          self.debitCardNumberList().push({
            code: data.debitCardDetails[i].cardNo.displayValue,
            description: data.debitCardDetails[i].cardNo.value
          });
        }
        ko.tasks.runEarly();
        self.cardData(true);
      });
    };
    if (params.formData) {
      self.testInput = params.formData.values;
      self.displayValue = params.formData.displayValues;
      if (self.testInput()[1]) {
        self.fetchDebitCards(self.testInput()[0]);
      }
    }
    self.accountNumberChangeHandler = function (event) {
      var account = event.detail.value;
      self.fetchDebitCards(account);
    };
    self.debitChange = function () {
      var j;
      for (j = 0; j < self.debitCardNumberList().length; j++) {
        if (self.debitCardNumberList()[j].description === self.testInput()[1]) {
          self.displayValue()[1] = self.debitCardNumberList()[j].code;
          break;
        }
      }
    };
    if (self.isDisabled() === false) {
      AccountNumberDebitCardModel.getAccountNumberData().done(function (data) {
        self.accountNumberList().splice(0, self.accountNumberList().length);
        var len = data.accounts.length,
          i;
        for (i = 0; i < len; i++) {
          self.accountNumberList().push({
            code: data.accounts[i].id.displayValue,
            description: data.accounts[i].id.value
          });
        }
        self.formData(true);
      });

    }
  };
});
