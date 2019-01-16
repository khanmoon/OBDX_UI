define([
  "ojs/ojcore",
  "knockout"

], function(oj, ko) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    rootParams.dashboard.headerName(self.resource.autopay.cardHeading);
    self.loadScreen = ko.observable(false);

    self.reviewTransactionName = {
      header: self.resource.autopay.reviewHeader,
      reviewHeader: self.resource.autopay.reviewHeading
    };
    if (self.currentActionType() === "dereg") {
      self.reviewTransactionName.reviewHeader = self.resource.autopay.reviewHeading2;
    }
    self.loadScreen(true);
  };
});
