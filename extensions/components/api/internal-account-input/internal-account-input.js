define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!extensions/resources/nls/internal-account-input",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox"
], function(oj, ko, $, Model, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    self.account = rootParams.account;
    var staticAccount = rootParams.account();
    self.mode = rootParams.mode;
    self.confirmStyleAccount = !!rootParams.confirmStyleAccount;
    self.hiddenAccountNumber = ko.observable();
    self.showInline = rootParams.showInline;
    self.branchList = ko.observableArray();
    self.branchId = ko.observable();
    self.accountNo = ko.observable();
    self.branchLoaded = ko.observable(false);
    self.branchName = ko.observable();
    if (staticAccount) {
      self.branchId(staticAccount.substr(0, 3));
      self.accountNo(staticAccount.substr(3));
    }
    self.label = rootParams.label;
    self.required = rootParams.required;
    self.resourceBundle = resourceBundle;
    self.readOnly = rootParams.readOnly;
    self.id = "INTERNAL_ACCOUNT" + rootParams.baseModel.incrementIdCount();
    Model.getBranch().then(function(data) {
      ko.utils.arrayPushAll(self.branchList, data.branchAddressDTO);
      self.branchLoaded(true);
      if (self.readOnly) {
        for (var i = 0; i < data.branchAddressDTO.length; i++) {
          if (data.branchAddressDTO[i].id === self.branchId()) {
            self.branchName(data.branchAddressDTO[i].branchName);
            break;
          }
        }
      }
    });
    self.dummyAccount = ko.computed(function() {
      if(self.branchId() && self.accountNo()){
        return self.branchId() + self.accountNo();
      }
    }, self);
    self.dummyAccount.subscribe(function(value) {
      self.account(value);
    });
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
      self.accountNo("");

      if (value && self.accountNo()) {
        if (value !== self.accountNo()) {
          self.accountNo("");
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
    self.dispose = function() {
      self.dummyAccount.dispose();
    };
  };
});
