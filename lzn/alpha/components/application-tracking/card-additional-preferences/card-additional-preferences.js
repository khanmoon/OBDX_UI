define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "baseLogger",
  "ojL10n!lzn/alpha/resources/nls/card-additional-preferences",
  "paperAccordion"
], function(oj, ko, $, AdditionalInfoModel, BaseLogger, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this,
      index = 0;
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.primaryCardHolder = ko.observable("");
    self.uplTrackingDetails = ko.observable({
      additionalInfo: {}
    });
    self.addOnHolders = ko.observableArray("");
    for (var i = 0; i < self.appDetails().coApplicants.length; i++) {
      if (self.appDetails().coApplicants[i].applicantRelationshipType === "APPLICANT") {
        self.primaryCardHolder(self.appDetails().coApplicants[i]);
      } else if (self.appDetails().coApplicants[i].applicantRelationshipType === "ADDON_CARDHOLDER") {
        self.appDetails().coApplicants[i].showAddOnPreferences = ko.observable(false);
        self.addOnHolders().push(self.appDetails().coApplicants[i]);
      }
    }
    self.headingText(self.resource.additionalInfo);
    self.showComponents = ko.observable(false);
    AdditionalInfoModel.init(self.applicationInfo().currentSubmissionId(), "1", self.appDetails().applicationId.value);
    AdditionalInfoModel.fetchSelectedOfferDetails(self.appDetails().creditCardSummaryResponse.offerId).done(function(offerData) {
      self.offerDetails = offerData;
      AdditionalInfoModel.fetchComponents().done(function(data) {
        self.uplTrackingDetails().additionalInfo.sections = [];
        for (index = 0; index < data.sections.length; index++) {
          switch (data.sections[index].component) {
            case "card-preferences":
              self.uplTrackingDetails().additionalInfo.sections.push(data.sections[index]);
              break;
            case "card-delivery-preferences":
              self.uplTrackingDetails().additionalInfo.sections.push(data.sections[index]);
              break;
            case "card-membership":
              self.uplTrackingDetails().additionalInfo.sections.push(data.sections[index]);
              break;
          }
        }
        for (index = 0; index < self.uplTrackingDetails().additionalInfo.sections.length; index++) {
          self.uplTrackingDetails().additionalInfo.sections[index].isComplete = ko.observable(self.uplTrackingDetails().additionalInfo.sections[index].isComplete);
          rootParams.baseModel.registerComponent(self.uplTrackingDetails().additionalInfo.sections[index].component, "application-tracking");
        }
        self.showComponents(true);
        ko.tasks.runEarly();
        self.initializeAccordion();
      });
    });
    self.initializeAccordion = function() {
      self.additionalInfoAccordion($("#addtionalInfoAccordion").paperAccordion({
        disableOthers: true,
        zoom: false
      }));
      for (var i = 0; i < self.uplTrackingDetails().additionalInfo.sections.length; i++) {
        if (self.uplTrackingDetails().additionalInfo.sections[i].isComplete()) {
          self.additionalInfoAccordion().enable(i + 2);
        }
      }
    };
  };
});
