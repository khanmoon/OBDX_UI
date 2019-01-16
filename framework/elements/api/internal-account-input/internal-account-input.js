define(["ojs/ojcore", "jquery", "knockout", "ojL10n!resources/nls/internal-account-input", "ojs/ojinputtext"], function (oj, $, ko, resourceBundle) {
  "use strict";

  return function (rootParams) {
    var self = this;

    self.account = rootParams.account;
    self.confirmStyleAccount = !!rootParams.confirmStyleAccount;
    self.hiddenAccountNumber = ko.observable();
    self.label = rootParams.label;
    self.required = rootParams.required;
    self.readOnly = rootParams.readOnly;
    self.resourceBundle = resourceBundle;
    self.id = "INTERNAL_ACCOUNT" + rootParams.baseModel.incrementIdCount();

    oj.Validation.converterFactory("maskedAccountNumber", (function () {
      return {
        createConverter: function () {
          return {
            format: function (value) {
              return value.replace(/[a-zA-Z0-9]/g, "*");
            }
          };
        }
      };
    }()));

    self.maskedAccountNumberConverter = oj.Validation.converterFactory("maskedAccountNumber").createConverter();

    self.fieldsRendered = function () {
      $("#" + self.id + "_hidden_account_number,#" + self.id + "_confirm_account_number").bind("cut copy paste contextmenu", function (event) {
        event.preventDefault();
      });
    };

    function accountNumberValidator(value) {
      self.account("");

      if (value && self.account()) {
        if (value !== self.account()) {
          self.account("");
          throw new oj.ValidatorError("ERROR", self.resourceBundle.errorMessage);
        }

        document.getElementById(self.id + "_confirm_account_number").validate();
      }
    }

    function confirmAccountNumberValidator(value) {
      if (self.hiddenAccountNumber() && value) {
        if (self.hiddenAccountNumber() !== value) {
          self.hiddenAccountNumber("");
          throw new oj.ValidatorError("ERROR", self.resourceBundle.errorMessage);
        } else {
          document.getElementById(self.id + "_hidden_account_number").validate();
        }
      }
    }

    self.accountNumberValidator = [rootParams.baseModel.getValidator("ACCOUNT"), {
      validate: accountNumberValidator
    }];

    self.confirmAccountNumberValidator = [{
      validate: confirmAccountNumberValidator
    }];
  };
});