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
], function(oj, ko, $, MultiSelectModel, ResourceBundle) {
  "use strict";
  return function(params) {
    var self = this;
    self.resource = ResourceBundle;
    self.labelName = ko.observable();
    self.isDisabled = ko.observable(params.isDisabled);
    self.isRequired = params.rootModel.validation.isMandatory;
    self.formData = ko.observable(false);
    self.testInput = ko.observableArray();
    ko.utils.extend(self, params.rootModel);
    self.errorMessage = ko.observable();
    self.errorMessage(params.rootModel.errorMessage);
    var j;
    for (j = 0; j < self.values.length - 1; j++) {
      for (var k = (j + 1); k < self.values.length; k++) {
        if (self.values[j].sequenceNumber > self.values[k].sequenceNumber) {
          var temp = self.values[j];
          self.values[j] = self.values[k];
          self.values[k] = temp;
        }
      }
    }
    if (self.isDisabled() === true) {
      self.formData(true);
    }
    if (params.formData) {
      self.testInput = params.formData.values;
      params.formData.displayValues = params.formData.values;
    }
    if (self.isDisabled() === false) {
      self.formData(true);
    }
  };
});
