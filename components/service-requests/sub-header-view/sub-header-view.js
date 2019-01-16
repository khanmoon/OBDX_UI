define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "ojL10n!resources/nls/service-requests-form-builder",
  "ojs/ojnavigationlist",
  "ojs/ojaccordion"
], function(oj, ko, $, ResourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    self.resource = ResourceBundle;
    self.compParams = rootParams.rootModel;
    self.label = ko.observable(self.compParams.values[0].description);
  };
});
