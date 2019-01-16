define([
  "ojs/ojcore",
  "knockout"
], function(oj, ko) {
  "use strict";
  return function(Params) {
    var self = this;
    ko.utils.extend(self, Params.rootModel);
    Params.dashboard.headerName(self.resource.blockCard.cardHeading);
    self.reviewTransactionName = {
      header: self.resource.blockCard.review,
      reviewHeader: ""
    };
    if (self.replaceConfirmationType() === "OPTION_YES") {
      self.reviewTransactionName.reviewHeader = self.resource.blockCard.reviewReplaceHeading;
    } else {
      self.reviewTransactionName.reviewHeader = self.resource.blockCard.reviewHeading;
    }
  };
});
