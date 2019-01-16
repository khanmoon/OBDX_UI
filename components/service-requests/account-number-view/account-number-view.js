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
], function(oj, ko, $, AccountNumberModel, ResourceBundle) {
  "use strict";
  return function(params) {
    var self = this;
    self.resource = ResourceBundle;
    self.labelName = ko.observable();
    self.isDisabled = ko.observable(params.isDisabled);
    self.formData = ko.observable(false);
    self.testInput = ko.observableArray();
    self.displayValue = ko.observableArray();
    self.isRequired = params.rootModel.validation.isMandatory;
    self.accountNumberList = ko.observableArray();
    ko.utils.extend(self, params.rootModel);
    self.errorMessage = ko.observable();
    self.errorMessage(params.rootModel.errorMessage);
    if (self.isDisabled() === true) {
      self.formData(true);
    }
    if (params.formData) {
      self.testInput = params.formData.values;

    }
    self.valueChange = function() {
      var j;
        self.displayValue = params.formData.displayValues;
      for (j = 0; j < self.accountNumberList().length; j++) {
        if (self.accountNumberList()[j].description === self.testInput()[0]) {
          self.displayValue()[0] = self.accountNumberList()[j].code;
        }
      }

    };
    if (self.isDisabled() === false) {
      AccountNumberModel.getAccountNumberData().done(function(data) {
        $("#accountNumber").empty();
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
