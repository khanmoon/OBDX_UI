define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",

  "baseLogger",
  "ojL10n!lzn/alpha/resources/nls/application-offer"
], function(oj, ko, $, OfferAcceptanceContainerModel, BaseLogger, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.headingText(self.resource.additionalInfo);
    self.showComponents = ko.observable(false);
    self.uplTrackingDetails = ko.observable({
      additionalInfo: {}
    });
    self.uplTrackingDetails().additionalInfo.sections = [];
    rootParams.baseModel.registerComponent("application-offer", "application-tracking");
  };
});
