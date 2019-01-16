define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "paperAccordion",
  "ojs/ojbutton"
], function(oj, ko, $, PersonalDetailsService) {
  "use strict";
  return function(rootParams) {
    var self = this,
      i = 0;
    ko.utils.extend(self, rootParams.rootModel);
    self.productHeadingName(self.productDetails().application().currentApplicationStage.name);
    self.showComponents = ko.observable(false);
    self.productDetails().application().currentApplicationStage.applicantAccordion = ko.observable({});
    self.optionsByFinTemplate = ko.observable(false);
    for (i = 0; i < self.productDetails().application().currentApplicationStage.applicantStages.length; i++) {
      self.productDetails().application().currentApplicationStage.applicantStages[i].accordionTitle = ko.observable();
      if (self.applicantDetails().length > 1) {
        if (self.productDetails().application().currentApplicationStage.applicantStages[i].coappNumber) {
          self.productDetails().application().currentApplicationStage.applicantStages[i].accordionTitle(rootParams.baseModel.format(self.accordionNames.accordionNames[self.productDetails().application().currentApplicationStage.applicantStages[i - 1].name], {
            applicant: self.accordionNames.accordionNames.coApplicant
          }));
        } else {
          self.productDetails().application().currentApplicationStage.applicantStages[i].accordionTitle(rootParams.baseModel.format(self.accordionNames.accordionNames[self.productDetails().application().currentApplicationStage.applicantStages[i].name], {
            applicant: self.accordionNames.accordionNames.applicant
          }));
        }
      } else {
        self.productDetails().application().currentApplicationStage.applicantStages[i].accordionTitle(rootParams.baseModel.format(self.accordionNames.accordionNames[self.productDetails().application().currentApplicationStage.applicantStages[i].name], {
          applicant: ""
        }));
      }
    }
    for (i = 0; i < self.productDetails().application().currentApplicationStage.stages.length; i++) {
      rootParams.baseModel.registerComponent(self.productDetails().application().currentApplicationStage.stages[i].id, "origination");
    }
    self.initializeAccordion = function() {
      self.productDetails().application().currentApplicationStage.applicantAccordion($("#personalDetailsAccordion").paperAccordion({
        disableOthers: true,
        zoom: false
      }));
      for (i = 0; i < self.productDetails().application().currentApplicationStage.applicantStages.length; i++) {
        if (self.productDetails().application().currentApplicationStage.applicantStages[i].isComplete()) {
          self.productDetails().application().currentApplicationStage.applicantAccordion().enable(i + 2);
        }
      }
      if (self.productDetails().sectionBeingEdited()) {
        for (i = 0; i < self.productDetails().application().currentApplicationStage.applicantStages.length; i++) {
          if (self.productDetails().application().currentApplicationStage.applicantStages[i].id === self.productDetails().sectionBeingEdited()) {
            self.productDetails().application().currentApplicationStage.applicantStages[i].isComplete(true);
            if (i === self.productDetails().application().currentApplicationStage.applicantStages.length - 1) {
              self.productDetails().application().currentApplicationStage.applicantAccordion().close(i + 1);
            } else {
              self.productDetails().application().currentApplicationStage.applicantAccordion().open(i + 1);
            }
            break;
          }
        }
      }
    };
    if (!self.productDetails().disclosures) {
      self.productDetails().disclosures = {};
    }
    self.fetchDocumentHandler = function(data) {
      self.productDetails().disclosures.documentsList = data.documentsList;
      for (var i = 0; i < data.documentsList.length; i++) {
        if (data.documentsList[i].disclosureCode === "ACCOUNTAGREEMENT" || data.documentsList[i].disclosureCode === "ACCCOUNTAGREEMENT") {
          self.productDetails().disclosures.accountDocRefId = data.documentsList[i].referenceId;
          self.productDetails().disclosures.taxValue = data.documentsList[i].disclosureCode;
        } else if (data.documentsList[i].disclosureCode === "ESIGNACTDISCLOSURE") {
          self.productDetails().disclosures.eSignDocRefId = data.documentsList[i].referenceId;
          self.productDetails().disclosures.eSignValue = data.documentsList[i].disclosureCode;
        } else if (data.documentsList[i].disclosureCode === "CONSUMERPRIVACYNOTICE") {
          self.productDetails().disclosures.privacyDocRefId = data.documentsList[i].referenceId;
          self.productDetails().disclosures.privacyValue = data.documentsList[i].disclosureCode;
        }
      }
      self.productDetails().disclosures.enableDisclosure = true;
    };
    self.displayDisclosureSubscription = self.displayDisclosure.subscribe(function() {
      PersonalDetailsService.fetchDocumentList(self.productDetails().submissionId.value, self.applicantDetails()[0].applicantId().value, self.fetchDocumentHandler);
    });
    self.login = function() {
      var baseUrl = location.pathname.split("/")[1];
      window.location.pathname = baseUrl + "/pages/my-applications.html";
    };
    self.showComponents(true);
    self.dispose = function() {
      self.displayDisclosureSubscription.dispose();
    };
    self.showToolTip = function(id, holder) {
      var p = $("#" + holder),
        toolTipHeight;
      var position = p.position();
      var headerHeight = 54;
      toolTipHeight = $("#" + id).outerHeight();
      var viewableOffset = $("#" + holder).offset().top - $(window).scrollTop();
      var positionTop = viewableOffset - headerHeight > toolTipHeight ? position.top - toolTipHeight : position.top + 20;
      if (self.large()) {
        $("#" + id).css("position", "absolute");
        $("#" + id).css("top", positionTop);
        $("#" + id).css("left", position.left);
        $("#" + id).css("display", "block");
      }
    };
  };
});
