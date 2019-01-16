define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "baseLogger",
  "ojL10n!lzn/beta/resources/nls/primary-registration",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojinputnumber",
  "ojs/ojvalidationgroup"
], function(oj, ko, $, BasicPrimaryInfoObject, BaseLogger, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this,
      BasicPrimaryInfoModel = new BasicPrimaryInfoObject(),
      getNewKoModel = function(model) {
        var KoModel = BasicPrimaryInfoModel.getNewModel(model);
        KoModel.primaryInfo.firstName = ko.observable(KoModel.primaryInfo.firstName);
        KoModel.primaryInfo.lastName = ko.observable(KoModel.primaryInfo.lastName);
        KoModel.disableInputs = ko.observable(KoModel.disableInputs);
        KoModel.selectedValues = ko.observable(KoModel.selectedValues);
        return KoModel;
      };

    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.validationTracker = ko.observable();
    self.applicantObject = ko.observable(rootParams.applicantObject);
    self.basicPrimaryInfoLoaded = ko.observable(false);
    self.suffixLoaded = ko.observable(false);
    self.suffixOptions = ko.observableArray([]);
    self.salutations = ko.observable([]);
    self.otherSalutations = ko.observable([]);
    self.salutationsLoaded = ko.observable(false);
    self.otherSalutationLoaded = ko.observable(false);
    BasicPrimaryInfoModel.init(self.productDetails().submissionId.value, self.applicantObject().applicantId().value);
    BasicPrimaryInfoModel.fetchSuffixes().done(function(data) {
      self.suffixOptions(data.enumRepresentations[0].data);
      self.suffixLoaded(true);
    });
    var enumCallsFinishedDeferred = $.Deferred();
    self.enumCallsFinished = function() {
      $.when(BasicPrimaryInfoModel.fetchSuffixes()).done(function() {
        enumCallsFinishedDeferred.resolve(true);
      });
      return enumCallsFinishedDeferred;
    };
    self.enumCallsFinished().done(function() {
      if (self.applicantObject().applicantId() && self.applicantObject().applicantId().value.length > 0) {
        BasicPrimaryInfoModel.readApplicant().done(function(data) {
          var applicantIndex;
          var applicantsIndexArray = data.applicants.reduce(function(a, e, i) {
            if (rootParams.coApplicant) {
              if (e.applicantRelationshipType === "CO_APPLICANT") {
                a.push(i);
              }
            } else if (e.applicantRelationshipType === "APPLICANT") {
              a.push(i);
            }
            return a;
          }, []);
          if (!applicantsIndexArray.length) {
            self.basicPrimaryInfoLoaded(true);
            self.applicantObject().primaryInfo = getNewKoModel();
            return false;
          }
          if (rootParams.coApplicant) {
            applicantIndex = applicantsIndexArray[rootParams.applicantStages.coappNumber - 1];
          } else {
            applicantIndex = applicantsIndexArray[0];
          }
          self.applicantObject().primaryInfo = getNewKoModel(data.applicants[applicantIndex].personalInfo);
          self.applicantObject().channelUser(data.applicants[applicantIndex].channelUser);
          if (!data.applicants[applicantIndex].newApplicant) {
            self.applicantObject().applicantType("customer");
            self.applicantObject().primaryInfo.disableInputs(true);
          }
          self.basicPrimaryInfoLoaded(true);
        });
      } else {
        self.applicantObject().primaryInfo = getNewKoModel();
        self.basicPrimaryInfoLoaded(true);
      }
    });
    self.submitBasicPrimaryInfo = function() {
      var basicPrimaryInfoTracker = document.getElementById("basicPrimaryInfoTracker");
      if (basicPrimaryInfoTracker.valid === "valid") {
        if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
          return;
        }
        self.applicantObject().primaryInfo.selectedValues().suffix = rootParams.baseModel.getDescriptionFromCode(self.suffixOptions(), self.applicantObject().primaryInfo.primaryInfo.suffix);
        self.applicantObject().primaryInfo.selectedValues().salutation = rootParams.baseModel.getDescriptionFromCode(self.salutations(), self.applicantObject().primaryInfo.primaryInfo.salutation);
        self.applicantObject().primaryInfo.selectedValues().otherSalutation = rootParams.baseModel.getDescriptionFromCode(self.salutations(), self.applicantObject().primaryInfo.primaryInfo.otherSalutation);
        var sendData = {
          facilityId: self.productDetails().facilityId,
          productGroupSerialNumber: self.productGroupSerialNumber().toString(),
          personalInfo: self.applicantObject().primaryInfo.primaryInfo,
          applicantRelationshipType: self.applicantObject().applicantRelationshipType,
          applicantType: "IND"
        };
        sendData.applicantId = self.applicantObject().applicantId().value ? self.applicantObject().applicantId().value : null;
        BasicPrimaryInfoModel.updateApplicant(ko.toJSON(sendData)).done(function(data) {
          if (!self.applicantObject().applicantId().value) {
            self.applicantObject().applicantId().displayValue = data.applicantId.displayValue;
            self.applicantObject().applicantId().value = data.applicantId.value;
          }
          self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion);
        });
        self.setAccordionTitle();
      }else{
        basicPrimaryInfoTracker.showMessages();
        basicPrimaryInfoTracker.focusOn("@firstInvalidShown");
      }
    };
  };
});
