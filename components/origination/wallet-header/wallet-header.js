define([
  "ojs/ojcore",
  "knockout",
  "ojs/ojknockout",
  "knockout-helper",
  "ojs/ojbutton",
  "ojs/ojmenu"
], function(oj, ko) {
  "use strict";

  return function(params) {
    var self = this;
    ko.utils.extend(self, params.rootModel);
    if (!(self.resource.pageTitle.login === "pageTitle.login")) {
      self.label(self.resource.pageTitle.login);
    }
    self.isBackAllowed(params.backAllowed);
  };
});
