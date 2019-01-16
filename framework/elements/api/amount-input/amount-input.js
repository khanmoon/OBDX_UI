define([
  "ojs/ojcore",
  "knockout",
  "./model",
  "jquery",
  "framework/js/constants/constants",
  "ojL10n!resources/nls/amount-input",
  "ojs/ojinputtext"
], function (oj, ko, AmountInputModel, $, Constants, locale) {
  /**
   * View Model for amout input component used to display entered amont in formated form .
   * @namespace AmountInput~viewModel
   * @property {Array} currencyList - Stores list of currencies fetched from server .
   * @property {Array} selectedCurrency - Stores the value of selected currency from Dropdown.
   * @property {Boolean} currencyListFecthed - To indicate wheteher the data is loaded or not.
   * @property {Object} rootParams - Object to store the data passed.
   */
  "use strict";
  return function (params) {
      var self = this;
      ko.utils.extend(self, params);
      if (!self.rootId) throw new Error("PASS ROOTID TO AMOUNT-INPUT");
      self.locale = locale;
      self.inline = Constants.userSegment === "ADMIN" || Constants.userSegment === "CORPADMIN" || params.inline;
      self.currencyList = ko.observableArray();
      self.placeholderText = self.placeholder ? self.placeholder : "";
      self.currencyListFecthed = ko.observable(false);
      self.readOnly = params.readOnly ? params.readOnly : false;
      var currencySubcription;
      /** Fetches currency list from server if currency list
       * needs to be displayed
       */

      self.setCurrency = function (response) {
        self.currencyList.removeAll();
        ko.utils.arrayPushAll(self.currencyList, response.currencies);
        self.currencyListFecthed(true);
        if (!ko.utils.unwrapObservable(self.currency) && self.currencyList().length > 0) {
          self.currency(self.currencyList()[0].code);
        }
      };

      if (self.currencyListRequired) {
        if (self.currencyURL) {
          AmountInputModel.getCurrencyList(self.currencyURL).done(function (data) {
            var response;
            if (self.currencyParser) {
              response = self.currencyParser(data);
            } else {
              response = data;
            }
            self.setCurrency(response);
          });
        } else {
          if (self.currencyParser) {
            self.setCurrency(self.currencyParser());
          }
          self.currencyListFecthed(true);
        }
      }
      self.validateAmount = {
        validate: function (value) {
          if (typeof ko.utils.unwrapObservable(self.currency) !== "string" || ko.utils.unwrapObservable(self.currency) === "") {
            throw new oj.ValidatorError("", locale.currencyValidation);
          }
          if (value !== null && (isNaN(value) || value <= 0)) {
            throw new oj.ValidatorError("", locale.amountValidation);
          }
          if (self.minimumAmount) {
            if (value < ko.utils.unwrapObservable(self.minimumAmount)) {
              throw new oj.ValidatorError("", locale.minAmountValidation);
            }
          }
          if (self.maximumAmount) {
            if (value > ko.utils.unwrapObservable(self.maximumAmount)) {
              throw new oj.ValidatorError("", locale.maxAmountValidation);
            }
          }
          if (value) {
            var numberfractional = value.toString().split(".");
            if ((numberfractional[0] && (numberfractional[0].length > 13)) || (numberfractional[1] && (numberfractional[1].length > 2))) {
              throw new oj.ValidatorError("", locale.amountValidation);
            }
          }
          return true;
        }
      };
      self.dispose = function () {
        if (currencySubcription) {
          currencySubcription.dispose();
        }
      };
      self.getTemplate = function(){
        if (Constants.module === "WALLET") {
          return "walletTemplate";
        } else if (Constants.module === "ORIGINATION") {
          return "originationTemplate";
        }
          return "templateDefault";

      };
    };
});
