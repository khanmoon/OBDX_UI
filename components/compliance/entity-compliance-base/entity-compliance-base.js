define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseLogger",
  "ojL10n!resources/nls/compliance-entity",
  "ojs/ojinputnumber",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox"
], function(oj, ko, $, BaseLogger, ResourceBundle) {
  "use strict";
  return function(Params) {
    var self = this;
    ko.utils.extend(self, Params.rootModel);
    self.resource = ResourceBundle;
    self.dataLoaded = ko.observable();
    self.complianceComponentName = ko.observable();
    self.formType = "ENTITY";
    Params.baseModel.registerComponent("entity-fatca-compliance", "compliance");
    self.complianceComponentName("entity-fatca-compliance");
    self.dataLoaded(true);
  };
});
