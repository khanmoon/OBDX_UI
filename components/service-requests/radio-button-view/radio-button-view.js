define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "ojL10n!resources/nls/service-requests-form-builder",
  "ojs/ojnavigationlist",
  "ojs/ojaccordion",
  "ojs/ojlabel",
  "ojs/ojradioset"
], function(oj, ko, $, ResourceBundle) {
  "use strict";
  return function(params) {
    var self = this;
    self.resource = ResourceBundle;
    ko.utils.extend(self, params.rootModel);
    self.errorMessage = ko.observable();
    self.errorMessage(params.rootModel.errorMessage);
    self.isDisabled = ko.observable(params.isDisabled);
    self.testInput = ko.observableArray();
    self.isRequired = params.rootModel.validation.isMandatory;
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
    if (params.formData) {
      self.testInput = params.formData.values;
      params.formData.displayValues = params.formData.values;
    }
  };
});
