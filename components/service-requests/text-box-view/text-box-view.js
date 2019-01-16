define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "ojL10n!resources/nls/service-requests-form-builder",
  "ojs/ojnavigationlist",
  "ojs/ojaccordion",
  "ojs/ojcheckboxset",
  "ojs/ojlabel",
  "ojs/ojinputtext",
  "ojs/ojknockout-validation",
  "ojs/ojradioset"
], function(oj, ko, $, ResourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = ResourceBundle;
    self.labelName = ko.observable();
    self.minValue = ko.observable();
    self.maxValue = ko.observable();
    self.validation = ko.observable();
    self.errorMessage = ko.observable();
    self.testInput = ko.observableArray();
    self.hintText = ko.observable();
    self.isRequired = rootParams.rootModel.validation.isMandatory;
    self.label = rootParams.rootModel.label;
    self.validation(rootParams.rootModel.validation.textBoxValidationType);
    self.errorMessage(rootParams.rootModel.errorMessage);
    self.minValue(parseInt(rootParams.rootModel.validation.minLength));
    self.maxValue(parseInt(rootParams.rootModel.validation.maxLength));
    self.hintText(rootParams.rootModel.hintText);
    self.textId = ko.observable(rootParams.rootModel.name);
    if (rootParams.formData) {
      self.testInput = rootParams.formData.values;
      self.testInput = rootParams.formData.displayValues;
    }
    self.isDisabled = ko.observable(rootParams.isDisabled);
  };
});
