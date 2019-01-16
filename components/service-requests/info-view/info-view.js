define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "ojL10n!resources/nls/service-requests-form-builder",
  "ojs/ojnavigationlist",
  "ojs/ojaccordion"
], function(oj, ko, $, ResourceBundle) {
  "use strict";
  return function(params) {

    var self = this;
    self.resource = ResourceBundle;
    ko.utils.extend(self, params.rootModel);
    self.label = ko.observable(params.rootModel().header);
    self.description = ko.observable(params.rootModel().description);
  };
});
