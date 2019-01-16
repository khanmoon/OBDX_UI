define([
  "ojs/ojcore",
  "knockout",
  "ojL10n!resources/nls/service-requests-configuration",
  "ojs/ojnavigationlist",
  "ojs/ojaccordion",
  "ojs/ojcheckboxset",
  "ojs/ojlabel",
  "ojs/ojinputtext",
  "ojs/ojknockout-validation",
  "ojs/ojradioset"
], function (oj, ko, ResourceBundle) {
  "use strict";
  return function (rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = ResourceBundle;
    rootParams.dashboard.headerName(self.resource.serviceRequest.raiseNewHeader);
  };
});