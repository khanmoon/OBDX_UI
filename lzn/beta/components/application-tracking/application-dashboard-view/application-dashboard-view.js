define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "baseLogger",
  "ojL10n!lzn/beta/resources/nls/application-dashboard-view",
  "ojs/ojaccordion",
  "ojs/ojcollapsible",
  "ojs/ojradioset"
], function(oj, ko, $, BaseLogger, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.pendingActionList = ko.observableArray([]);
    self.request = $.extend({}, self.baseRequest);
    self.viewList = ko.observableArray([{
        viewSectionName: self.resource.applications
      },
      {
        viewSectionName: self.resource.statusHistory
      }
    ]);
    rootParams.baseModel.registerComponent("application-details-view", "application-tracking");
    rootParams.baseModel.registerComponent("application-status-history", "application-tracking");
    if (self.productClassName() === "CREDIT_CARD") {
      rootParams.baseModel.registerComponent("application-documents", "application-tracking");
    }
    if (self.productClassName() === "LOANS") {
      rootParams.baseModel.registerComponent("application-fees-view", "application-tracking");
      rootParams.baseModel.registerComponent("application-documents", "application-tracking");
      rootParams.baseModel.registerComponent("application-offer", "application-tracking");
      rootParams.baseModel.registerComponent("account-summary", "application-tracking");
    }
  };
});
