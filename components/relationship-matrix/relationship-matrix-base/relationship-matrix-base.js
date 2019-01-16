define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseLogger",
  "ojL10n!resources/nls/relationship-matrix",
  "ojs/ojinputnumber",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource"
], function(oj, ko, $, BaseLogger, ResourceBundle) {
  "use strict";
  return function(Params) {
    var self = this;
    ko.utils.extend(self, Params.rootModel);
    self.resource = ResourceBundle;
    Params.dashboard.headerName(self.resource.relationshipMatrixMaintenance);
    Params.baseModel.registerComponent("relationship-matrix-mapping", "relationship-matrix");
  };
});
