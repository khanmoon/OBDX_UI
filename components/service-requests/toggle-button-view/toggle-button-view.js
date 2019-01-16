define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "ojL10n!resources/nls/service-requests-form-builder",
  "ojs/ojnavigationlist",
  "ojs/ojaccordion",
  "ojs/ojlabel",
  "ojs/ojradioset",
  "ojs/ojbutton"
], function(oj, ko, $, ResourceBundle) {
  "use strict";
  return function(params) {
    var self = this;
    self.resource = ResourceBundle;
    ko.utils.extend(self, params.rootModel);
    self.errorMessage = ko.observable();
    self.errorMessage(params.rootModel.errorMessage);
    self.isDisabled = ko.observable(params.isDisabled);
    self.isRequired = params.rootModel.validation.isMandatory;
    if (params.formData) {
      self.testInput = params.formData.values;
    }
  };
});
