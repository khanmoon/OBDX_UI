define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",

  "baseLogger",
  "ojL10n!lzn/beta/resources/nls/mortgage-additional-details"
], function(oj, ko, $, AdditionalInfoModel, BaseLogger, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this,
      index = 0;
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.headingText(self.resource.additionalInfo);
    self.showComponents = ko.observable(false);
    self.uplTrackingDetails = ko.observable({
      additionalInfo: {}
    });
    self.uplTrackingDetails().additionalInfo.sections = [];
    self.offerLoaded = ko.observable(false);
    self.tempErrCode = ko.observable();
    self.tempMessage = ko.observable();
    self.productDetails = ko.observable({
      submissionId: {
        value: self.applicationInfo().currentSubmissionId()
      },
      requirements: {
        requestedTenure: {
          years: ko.observable(self.appDetails().loanSummaryResponse.requestedTenure.years),
          months: ko.observable(self.appDetails().loanSummaryResponse.requestedTenure.months)
        }
      },
      offers: {
        offerId: ""
      }
    });
    self.productGroupSerialNumber = ko.observable("1");
    self.accountSummaryData = ko.observable();
    self.applicantDetails = ko.observable([{
      applicantId: ko.observable({
        displayValue: "",
        value: self.currentUser().partyId.value
      }),
      applicantRelationshipType: null
    }]);
    AdditionalInfoModel.fetchSelectedOffer(self.applicationInfo().currentSubmissionId(), self.productGroupSerialNumber()).done(function(data) {
      if (!$.isEmptyObject(data.offerDetails)) {
        self.productDetails().offers.offerId = data.offerDetails[0].offerId;
      }
      self.offerLoaded(true);
    });
    self.confirmAccountConfiguration = function() {
      $("#confirmAccountConfiguration").trigger("closeModal");
      AdditionalInfoModel.confirmAccountConfiguration(self.applicationInfo().currentSubmissionId(), self.currentUser().partyId.value).done(function() {
        self.clickBackButton();
      }).fail(function(data) {
        self.tempMessage(data.responseJSON.message.validationError[0].errorMessage);
        $("#customPopupforDuplicate").trigger("openModal");
        if (data.responseJSON.message.validationError[0].errorCode === "DIGX_OR_LOAN_0010") {
          self.tempErrCode(data.responseJSON.message.validationError[0].errorCode);
        }
      });
    };
    AdditionalInfoModel.fetchComponents().done(function(data) {
      self.uplTrackingDetails().additionalInfo.sections = data.sections;
      for (index = 0; index < self.uplTrackingDetails().additionalInfo.sections.length; index++) {
        self.uplTrackingDetails().additionalInfo.sections[index].isComplete = ko.observable(self.uplTrackingDetails().additionalInfo.sections[index].isComplete);
      }
      for (index = 0; index < self.uplTrackingDetails().additionalInfo.sections.length; index++) {
        rootParams.baseModel.registerComponent(self.uplTrackingDetails().additionalInfo.sections[index].component, "origination");
      }
      self.showComponents(true);
      ko.tasks.runEarly();
      self.initializeAccordion();
    });
    self.initializeAccordion = function() {
      self.additionalInfoAccordion($("#mortgageAdditionalInfoAccordion").paperAccordion({
        disableOthers: true,
        zoom: false
      }));
      for (var i = 0; i < self.uplTrackingDetails().additionalInfo.sections.length; i++) {
        if (self.uplTrackingDetails().additionalInfo.sections[i].isComplete()) {
          self.additionalInfoAccordion().enable(i + 2);
        }
      }
    };
    self.showNextComponent = function(ind) {
      self.additionalInfoAccordion().close(ind);
      if (ind < self.uplTrackingDetails().additionalInfo.sections.length) {
        self.additionalInfoAccordion().open(ind + 1);
        self.additionalInfoAccordion().enable(ind + 1);
      }
    };
    self.redirectHome = function() {
      $("#customPopupforDuplicate").trigger("closeModal");
      if (self.tempErrCode() === "DIGX_OR_LOAN_0010") {
        self.clickBackButton();
      }
    };
  };
});
