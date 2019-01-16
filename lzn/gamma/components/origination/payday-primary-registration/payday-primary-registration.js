define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "ojL10n!lzn/gamma/resources/nls/primary-registration",
  "ojs/ojcheckboxset",
  "ojs/ojinputtext",
  "ojs/ojswitch",
  "ojs/ojknockout-validation",
  "ojs/ojdialog",
  "ojs/ojswitch",
  "ojs/ojbutton",
  "ojs/ojvalidationgroup"
], function(oj, ko, $, PrimaryInfoModelObject, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this,
      PrimaryInfoModel = new PrimaryInfoModelObject(),
      getNewKoModel = function(model) {
        var KoModel = PrimaryInfoModel.getNewModel(model);
        KoModel.primaryInfo.firstName = ko.observable(KoModel.primaryInfo.firstName, "");
        KoModel.primaryInfo.lastName = ko.observable(KoModel.primaryInfo.lastName, "");
        KoModel.primaryInfo.birthDate = ko.observable(KoModel.primaryInfo.birthDate, "");
        KoModel.selectedValues = ko.observable(KoModel.selectedValues);
        KoModel.disableInputs = ko.observable(KoModel.disableInputs, "");
        KoModel.howDidYouHearAboutUs = ko.observable(KoModel.howDidYouHearAboutUs);
        KoModel.isCompleting = ko.observable(KoModel.isCompleting, "");
        return KoModel;
      };
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.applicantObject = ko.observable(rootParams.applicantObject);
    rootParams.baseModel.registerElement("modal-window");
    PrimaryInfoModel.init(self.productDetails().submissionId.value, self.applicantObject().applicantId().value);
    self.salutations = ko.observable([]);
    self.tempApplicantId = ko.observable();
    self.groupValid = ko.observable();
    self.validationTracker = ko.observable();
    self.primaryDataLoaded = ko.observable(false);
    self.salutationsLoaded = ko.observable(false);
    self.hearAbout = ko.observable([]);
    self.hearAboutLoaded = ko.observable(false);
    self.baseUrl = ko.observable();
    self.pwshown = ko.observable(false);
    self.coApplicant = rootParams.coApplicant;
    self.suffixLoaded = ko.observable(false);
    self.suffixOptions = ko.observableArray([]);
    var primaryInfoCopy;
    PrimaryInfoModel.fetchSuffixes().done(function(data) {
      self.suffixOptions(data.enumRepresentations[0].data);
      self.suffixLoaded(true);
    });
    self.validateFirstName = {
      type: "length",
      options: {
        min: 1,
        max: 80
      }
    };
    self.validateLastName = {
      type: "length",
      options: {
        min: 1,
        max: 80
      }
    };
    self.validateMiddleName = {
      type: "length",
      options: {
        min: 0,
        max: 80
      }
    };
    PrimaryInfoModel.fetchHowDidYouHearAboutUs().then(function(data) {
      self.hearAbout(data.enumRepresentations[0].data);
      self.hearAboutLoaded(true);
    });
    var enumCallsFinishedDeferred = $.Deferred();
    self.enumCallsFinished = function() {
      $.when(PrimaryInfoModel.fetchSuffixes(), PrimaryInfoModel.fetchHowDidYouHearAboutUs()).done(function() {
        enumCallsFinishedDeferred.resolve(true);
      });
      return enumCallsFinishedDeferred;
    };
    self.enumCallsFinished().done(function() {
      if (!self.applicantObject().primaryInfo) {
        self.applicantObject().primaryInfo = getNewKoModel();
        if (!self.productDetails().isRegistered && self.socialMediaResponse()) {
          self.applicantObject().primaryInfo.primaryInfo.firstName(self.socialMediaResponse().firstName);
          self.applicantObject().primaryInfo.primaryInfo.lastName(self.socialMediaResponse().lastName);
        }
        self.applicantObject().primaryInfo.applicantType = "primary";
        self.applicantObject().primaryInfo.disableInputs(false);
        if (!(self.applicantObject().applicantId() && self.applicantObject().applicantId().value.length > 0)) {
          self.primaryDataLoaded(true);
        }
      }
      if (self.applicantObject().applicantId() && self.applicantObject().applicantId().value.length > 0) {
        PrimaryInfoModel.fetchApplicantList(self.productDetails().submissionId.value).done(function(data) {
          if (!self.applicantObject().newApplicant) {
            var showComplete = false;
            if (self.checkDataAvailability(data.applicants[0].personalInfo, rootParams.applicantStages.id)) {
              showComplete = true;
            }
            self.showIcon(showComplete, rootParams.applicantStages);
          }
          self.productDetails().applicantList(data.applicants);
          if (self.productDetails().applicantList() && self.productDetails().applicantList().length > 0) {
            var applicantIndex;
            var applicantsIndexArray = self.productDetails().applicantList().reduce(function(a, e, i) {
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
              self.primaryDataLoaded(true);
              return false;
            }
            if (rootParams.coApplicant) {
              applicantIndex = applicantsIndexArray[rootParams.applicantStages.coappNumber - 1];
            } else {
              applicantIndex = applicantsIndexArray[0];
            }
            self.applicantObject().applicantId(self.productDetails().applicantList()[applicantIndex].applicantId);
            if (!self.applicantObject().primaryInfo.primaryInfo.firstName()) {
              self.applicantObject().primaryInfo.primaryInfo.firstName = ko.observable(self.productDetails().applicantList()[applicantIndex].personalInfo.firstName);
            }
            if (!self.applicantObject().primaryInfo.primaryInfo.lastName()) {
              self.applicantObject().primaryInfo.primaryInfo.lastName = ko.observable(self.productDetails().applicantList()[applicantIndex].personalInfo.lastName);
            }
            if (self.productDetails().applicantList()[applicantIndex].personalInfo.middleName) {
              self.applicantObject().primaryInfo.primaryInfo.middleName = self.productDetails().applicantList()[applicantIndex].personalInfo.middleName;
            } else {
              self.applicantObject().primaryInfo.primaryInfo.middleName = null;
            }
            if (self.productDetails().applicantList()[applicantIndex].personalInfo.suffix) {
              self.applicantObject().primaryInfo.primaryInfo.suffix = self.productDetails().applicantList()[applicantIndex].personalInfo.suffix ? self.productDetails().applicantList()[applicantIndex].personalInfo.suffix : "";
            }
            self.applicantObject().primaryInfo.primaryInfo.birthDate = ko.observable(self.productDetails().applicantList()[applicantIndex].personalInfo.birthDate ? self.productDetails().applicantList()[applicantIndex].personalInfo.birthDate.substring(0, 10) : "");
            self.applicantObject().primaryInfo.primaryInfo.salutation = self.productDetails().applicantList()[applicantIndex].personalInfo.salutation;
            self.applicantObject().channelUser(self.productDetails().applicantList()[applicantIndex].channelUser);
            if (!self.productDetails().applicantList()[applicantIndex].newApplicant) {
              self.applicantObject().applicantType("customer");
              self.applicantObject().primaryInfo.disableInputs(true);
            } else {
              self.applicantObject().primaryInfo.disableInputs(false);
            }
          }
          primaryInfoCopy = ko.toJSON(self.applicantObject().primaryInfo);
          self.setAccordionTitle();
          PrimaryInfoModel.getOtherDetailsHearAbout().done(function(data) {
            if (data.applicantOtherDetails) {
              self.applicantObject().primaryInfo.howDidYouHearAboutUs().crmReferenceCode = data.applicantOtherDetails.crmReferenceCode;
            }
            self.primaryDataLoaded(true);
          });
        });
      }
    });
    self.submitApplicant = function() {
      var tracker = document.getElementById("payday-primary-registration-tracker");
      if (tracker.valid === "valid") {
        self.applicantObject().primaryInfo.selectedValues().crmReferenceCode = rootParams.baseModel.getDescriptionFromCode(self.hearAbout(), self.applicantObject().primaryInfo.howDidYouHearAboutUs().crmReferenceCode);
        if (self.checkformDataChange(primaryInfoCopy, ko.toJSON(self.applicantObject().primaryInfo), rootParams.applicantStages)) {
          return true;
        }
        var sendData = {
          personalInfo: self.applicantObject().primaryInfo.primaryInfo,
          applicantRelationshipType: self.applicantObject().applicantRelationshipType,
          applicantId: self.applicantObject().applicantId().value,
          applicantType: "IND",
          newApplicant: self.applicantObject().newApplicant
        };
        var sendData1 = {
          crmReferenceCode: self.applicantObject().primaryInfo.howDidYouHearAboutUs().crmReferenceCode
        };
        if (self.applicantObject().applicantId() && self.applicantObject().applicantId().value.length > 0) {
          sendData.applicantId = self.applicantObject().applicantId().value;
          PrimaryInfoModel.setApplicantId(self.applicantObject().applicantId().value);
          var updateHearAbout = false;
          PrimaryInfoModel.getOtherDetailsHearAbout().done(function(data) {
            if (!$.isEmptyObject(data.applicantOtherDetails)) {
              updateHearAbout = true;
            }
            PrimaryInfoModel.saveHowDidYouHearAboutUs(ko.toJSON(sendData1), updateHearAbout);
          });
          PrimaryInfoModel.updateApplicant(ko.toJSON(sendData)).done(function() {
            self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion);
          });
        } else {
          PrimaryInfoModel.saveApplicant(ko.toJSON(sendData)).done(function(data) {
            self.applicantObject().applicantId().value = data.applicantId.value;
            primaryInfoCopy = ko.toJSON(self.applicantObject().primaryInfo);
            self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion);
          });
        }

      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }

    };
  };
});
