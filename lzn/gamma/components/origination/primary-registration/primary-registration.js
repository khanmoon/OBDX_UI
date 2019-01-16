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
      i = 0,
      url, getNewKoModel = function(model) {
        var KoModel = PrimaryInfoModel.getNewModel(model);
        KoModel.primaryInfo.firstName = ko.observable(KoModel.primaryInfo.firstName, "");
        KoModel.primaryInfo.lastName = ko.observable(KoModel.primaryInfo.lastName, "");
        KoModel.primaryInfo.birthDate = ko.observable(KoModel.primaryInfo.birthDate, "");
        KoModel.disableInputs = ko.observable(KoModel.disableInputs, "");
        KoModel.isCompleting = ko.observable(KoModel.isCompleting, "");
        KoModel.primaryInfo.citizenship = KoModel.primaryInfo.citizenship.trim();
        KoModel.primaryInfo.citizenshipStatus = ko.observable(KoModel.primaryInfo.citizenshipStatus, null);
        KoModel.selectedValues = ko.observable(KoModel.selectedValues, "");
        KoModel.armedForcesMember = ko.observable(KoModel.armedForcesMember, "");
        KoModel.SCRADate = ko.observable(KoModel.SCRADate, "");
        KoModel.SCRARefNo = ko.observable(KoModel.SCRARefNo, "");
        return KoModel;
      },
      getOtherSalutationsSuccessHandler = function(data) {
        self.otherSalutations(data.enumRepresentations[0].data);
        self.otherSalutationLoaded(true);
      };
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.applicantObject = ko.observable(rootParams.applicantObject);
    rootParams.baseModel.registerElement("modal-window");
    PrimaryInfoModel.init(self.productDetails().submissionId.value, self.applicantObject().applicantId().value);
    self.salutations = ko.observable([]);
    self.otherSalutations = ko.observable([]);
    self.countries = ko.observableArray([]);
    self.countriesLoaded = ko.observable(false);
    self.securityQuestions = ko.observableArray([]);
    self.maritalStatus = ko.observable([]);
    self.tempApplicantId = ko.observable();
    self.validationTracker = ko.observable();
    self.primaryDataLoaded = ko.observable(false);
    self.otherSalutationLoaded = ko.observable(false);
    self.salutationsLoaded = ko.observable(false);
    self.baseUrl = ko.observable();
    self.pwshown = ko.observable(false);
    self.armedForcesMemberDefault = ko.observable("OPTION_NO");
    self.citizenshipStatusDefault = ko.observable("ResidentAlien");
    self.coApplicant = rootParams.coApplicant;
    self.showResidenceStatus = ko.observable(false);
    self.showCountryOfResidence = ko.observable(false);
    self.tncText = self.resource.tncLine1 + "\n" + self.resource.tncLine2 + "\n" + self.resource.tncLine3;
    self.suffixLoaded = ko.observable(false);
    self.citizenshipStatusLoaded = ko.observable(false);
    self.suffixOptions = ko.observableArray([]);
    self.citizenshipStatusOptions = ko.observableArray([]);
    var primaryInfoCopy;
    self.validateFirstName = {
      type: "length",
      options: {
        min: 1,
        max: 30
      }
    };
    self.validateLastName = {
      type: "length",
      options: {
        min: 1,
        max: 30
      }
    };
    self.validateMiddleName = {
      type: "length",
      options: {
        min: 0,
        max: 30
      }
    };


    self.validateSCRARefNo = {
      type: "length",
      options: {
        min: 0,
        max: 30
      }
    };
    self.salutionChanged = function(event) {
      if (event.detail.value) {
        if (event.detail.value === "145") {
          var deferred = $.Deferred();
          PrimaryInfoModel.getOtherSalutations(self.getOtherSalutationsSuccessHandler, deferred);
          return deferred.promise();
        }
          self.otherSalutationLoaded(false);

      }
    };
    url = "submissions/{submissionId}";
    switch (self.productDetails().productClassName) {
      case "CREDIT_CARD":
        url = url + "/creditCardApplications";
        break;
      case "CASA":
        url = url + "/demandDepositApplications";
        break;
      case "TERM_DEPOSITS":
        url = url + "/depositApplications";
        break;
      default:
        url = url + "/loanApplications";
        break;
    }
    PrimaryInfoModel.fetchSuffixes().done(function(data) {
      self.suffixOptions(data.enumRepresentations[0].data);
      self.suffixLoaded(true);
    });
    PrimaryInfoModel.fetchcitizenshipStatus().done(function(data) {
      for (i = 0; i < data.enumRepresentations[0].data.length; i++) {
        self.citizenshipStatusOptions().push({
          code: data.enumRepresentations[0].data[i].code,
          description: data.enumRepresentations[0].data[i].description
        });
      }
      self.citizenshipStatusLoaded(true);
    });
    PrimaryInfoModel.fetchCountries().done(function(data) {
      for (i = 0; i < data.enumRepresentations[0].data.length; i++) {
        self.countries().push({
          code: data.enumRepresentations[0].data[i].code,
          description: data.enumRepresentations[0].data[i].description
        });
      }
      self.countriesLoaded(true);
    });
    var enumCallsFinishedDeferred = $.Deferred();
    self.enumCallsFinished = function() {
      $.when(PrimaryInfoModel.fetchcitizenshipStatus(), PrimaryInfoModel.fetchSuffixes(), PrimaryInfoModel.fetchCountries()).done(function() {
        enumCallsFinishedDeferred.resolve(true);
      });
      return enumCallsFinishedDeferred;
    };
    self.enumCallsFinished().done(function() {
      if (!self.applicantObject().primaryInfo) {
        self.applicantObject().primaryInfo = getNewKoModel();
        self.applicantObject().primaryInfo.primaryInfo.citizenship = self.resource.citizenship.toUpperCase();
        if (!self.productDetails().isRegistered && self.socialMediaResponse()) {
          self.applicantObject().primaryInfo.primaryInfo.firstName(self.socialMediaResponse().firstName);
          self.applicantObject().primaryInfo.primaryInfo.lastName(self.socialMediaResponse().lastName);
          if (self.socialMediaResponse().location) {
            self.applicantObject().primaryInfo.primaryInfo.citizenship = self.socialMediaResponse().location.country.code.toUpperCase();
          }
        }
        self.applicantObject().primaryInfo.applicantType = "primary";
        self.applicantObject().primaryInfo.disableInputs(false);
        if (!(self.applicantObject().applicantId() && self.applicantObject().applicantId().value.length > 0)) {
          self.primaryDataLoaded(true);
        }
      }
      if (self.applicantObject().applicantId() && self.applicantObject().applicantId().value.length > 0) {
        PrimaryInfoModel.getOtherDetails().done(function(data) {
          if (data.applicantOtherDetails) {
            if (data.applicantOtherDetails.isServiceMemberRelation) {
              self.applicantObject().primaryInfo.armedForcesMember("OPTION_YES");
              self.armedForcesMemberDefault("OPTION_YES");
              if (data.applicantOtherDetails.effectiveDateSCRA) {
                self.applicantObject().primaryInfo.SCRADate(data.applicantOtherDetails.effectiveDateSCRA);
                self.applicantObject().primaryInfo.SCRARefNo(data.applicantOtherDetails.scraRefNo);
              }
            } else {
              self.applicantObject().primaryInfo.armedForcesMember("OPTION_NO");
            }
          }
          PrimaryInfoModel.fetchpplicantList(self.productDetails().submissionId.value).done(function(data) {
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
              if (self.productDetails().applicantList()[applicantIndex].personalInfo.suffix) {
                self.applicantObject().primaryInfo.primaryInfo.suffix = self.productDetails().applicantList()[applicantIndex].personalInfo.suffix ? self.productDetails().applicantList()[applicantIndex].personalInfo.suffix : "";
              }
              if (self.productDetails().applicantList()[applicantIndex].personalInfo.middleName) {
                self.applicantObject().primaryInfo.primaryInfo.middleName = self.productDetails().applicantList()[applicantIndex].personalInfo.middleName;
              } else {
                self.applicantObject().primaryInfo.primaryInfo.middleName = null;
              }
              self.applicantObject().primaryInfo.primaryInfo.birthDate = ko.observable(self.productDetails().applicantList()[applicantIndex].personalInfo.birthDate ? self.productDetails().applicantList()[applicantIndex].personalInfo.birthDate.substring(0, 10) : "");
              self.applicantObject().primaryInfo.primaryInfo.salutation = self.productDetails().applicantList()[applicantIndex].personalInfo.salutation;
              self.applicantObject().primaryInfo.primaryInfo.otherSalutation = self.productDetails().applicantList()[applicantIndex].personalInfo.otherSalutation;
              if (self.productDetails().applicantList()[applicantIndex].personalInfo.citizenship) {
                self.applicantObject().primaryInfo.primaryInfo.citizenship = self.productDetails().applicantList()[applicantIndex].personalInfo.citizenship;
              }
              if (self.applicantObject().primaryInfo.primaryInfo.citizenship !== "US") {
                self.showResidenceStatus(true);
                if (!self.applicantObject().newApplicant) {
                  if (!self.productDetails().applicantList()[applicantIndex].personalInfo.citizenshipStatus) {
                    self.showIcon(false, rootParams.applicantStages);
                    rootParams.applicantStages.isComplete(false);
                  } else {
                    self.showIcon(true, rootParams.applicantStages);
                  }
                }
              }
              if (self.productDetails().applicantList()[applicantIndex].personalInfo.citizenshipStatus) {
                self.applicantObject().primaryInfo.primaryInfo.citizenshipStatus = ko.observable(self.productDetails().applicantList()[applicantIndex].personalInfo.citizenshipStatus);
              }
              if (self.applicantObject().primaryInfo.primaryInfo.citizenshipStatus() === "RA") {
                self.showCountryOfResidence(true);
              }
              self.applicantObject().primaryInfo.selectedValues().salutation = rootParams.baseModel.getDescriptionFromCode(self.salutations(), self.applicantObject().primaryInfo.primaryInfo.salutation);
              self.applicantObject().primaryInfo.selectedValues().citizenship = rootParams.baseModel.getDescriptionFromCode(self.countries(), self.productDetails().applicantList()[applicantIndex].personalInfo.citizenship);
              self.applicantObject().primaryInfo.selectedValues().citizenshipStatus = rootParams.baseModel.getDescriptionFromCode(self.citizenshipStatusOptions(), self.productDetails().applicantList()[applicantIndex].personalInfo.citizenshipStatus);
              if (self.productDetails().applicantList()[applicantIndex].personalInfo.email) {
                self.applicantObject().primaryInfo.primaryInfo.email = self.productDetails().applicantList()[applicantIndex].personalInfo.email.replace("&#x40;", "@");
              }
              self.applicantObject().channelUser(self.productDetails().applicantList()[applicantIndex].channelUser);
              if (self.applicantObject().applicantId().value && self.applicantObject().applicantId().value.length > 0) {
                if (self.applicantObject().applicantType() === "customer") {
                  self.applicantObject().primaryInfo.disableInputs(true);
                } else {
                  self.applicantObject().primaryInfo.disableInputs(false);
                }
              }
            }
            primaryInfoCopy = ko.toJSON(self.applicantObject().primaryInfo);
            self.setAccordionTitle();
            self.primaryDataLoaded(true);
          });
        });
      }
      var selectedSalutation = self.applicantObject().primaryInfo.primaryInfo.salutation;
      if (selectedSalutation === "145") {
        PrimaryInfoModel.getOtherSalutations().then(getOtherSalutationsSuccessHandler);
      }
    });
    self.saveArmedForcesMember = function(event) {
      if (event.detail.value === "OPTION_NO") {
        self.applicantObject().primaryInfo.armedForcesMember("OPTION_NO");
        self.applicantObject().primaryInfo.SCRADate("");
        self.applicantObject().primaryInfo.SCRARefNo("");
      }
      if (event.detail.value === "OPTION_YES") {
        self.applicantObject().primaryInfo.armedForcesMember("OPTION_YES");
      }
    };
    self.savecitizenshipStatus = function(event) {
      if (event.detail.value) {
        if (event.detail.value === "RA") {
          self.applicantObject().primaryInfo.primaryInfo.citizenshipStatus(event.detail.value);
          self.showCountryOfResidence(true);
        }
        if (event.detail.value === "NRA") {
          self.applicantObject().primaryInfo.primaryInfo.citizenshipStatus(event.detail.value);
          self.showCountryOfResidence(false);
        }
      }
    };
    self.selectCountry = function(event) {
      if (event.detail.value) {
        if (event.detail.value === "US") {
          self.applicantObject().primaryInfo.primaryInfo.citizenshipStatus(null);
          self.showResidenceStatus(false);
          self.showCountryOfResidence(false);
        }
        if (event.detail.value !== "US") {
          self.showResidenceStatus(true);
        }
      }
    };
    self.submitApplicant = function() {
      var tracker = document.getElementById("primary-tracker");
      if (tracker.valid === "valid") {
        self.applicantObject().primaryInfo.selectedValues().salutation = rootParams.baseModel.getDescriptionFromCode(self.salutations(), self.applicantObject().primaryInfo.primaryInfo.salutation);
        self.applicantObject().primaryInfo.selectedValues().citizenship = rootParams.baseModel.getDescriptionFromCode(self.countries(), self.applicantObject().primaryInfo.primaryInfo.citizenship);
        self.applicantObject().primaryInfo.selectedValues().citizenshipStatus = rootParams.baseModel.getDescriptionFromCode(self.citizenshipStatusOptions(), self.applicantObject().primaryInfo.primaryInfo.citizenshipStatus());
        if (self.checkformDataChange(primaryInfoCopy, ko.toJSON(self.applicantObject().primaryInfo), rootParams.applicantStages)) {
          if (self.productDetails().isRegistered && self.isRequirementRequired()) {
            if (self.productDetails().productClassName === "CREDIT_CARD") {
              self.productDetails().requirements.requestedAmount.amount = self.productDetails().offers.offerAdditionalDetails.creditCardLimitDetail[0].maximumCreditLimit;
            }
            PrimaryInfoModel.submitRequirements(url, self.productDetails().submissionId.value, ko.toJSON(self.productDetails().requirements)).done(function(data) {
              if (self.productDetails().productClassName === "LOANS") {
                self.productDetails().facilityId = data.loanApplicationRequirementDTO.facilityId;
              } else if (self.productDetails().productClassName === "CREDIT_CARD") {
                self.productDetails().facilityId = data.creditCardApplicationRequirementDTO.facilityId;
              }
            });
          }
          return true;
        }
        var sendData = {
          applicantId: self.applicantObject().applicantId().value,
          personalInfo: self.applicantObject().primaryInfo.primaryInfo,
          applicantRelationshipType: self.applicantObject().applicantRelationshipType,
          applicantType: "IND",
          newApplicant: self.applicantObject().newApplicant
        };
        if (self.applicantObject().applicantId() && self.applicantObject().applicantId().value.length > 0) {
          sendData.applicantId = self.applicantObject().applicantId().value;
          PrimaryInfoModel.setApplicantId(self.applicantObject().applicantId().value);
          var isActiveServiceMember = false;
          if (self.applicantObject().primaryInfo.armedForcesMember() === "OPTION_YES") {
            isActiveServiceMember = true;
          } else {
            self.applicantObject().primaryInfo.SCRADate(null);
            self.applicantObject().primaryInfo.SCRARefNo(null);
          }
          var sendDataOtherDetails = {
            isServiceMemberRelation: isActiveServiceMember,
            effectiveDateSCRA: self.applicantObject().primaryInfo.SCRADate(),
            scraRefNo: self.applicantObject().primaryInfo.SCRARefNo()
          };
          var updateOtherDetails = false;
          PrimaryInfoModel.getOtherDetails().done(function(data) {
            if (!$.isEmptyObject(data.applicantOtherDetails)) {
              updateOtherDetails = true;
            }
            PrimaryInfoModel.saveOtherDetails(ko.toJSON(sendDataOtherDetails), updateOtherDetails);
          });
          if (!sendData.personalInfo.citizenshipStatus()) {
            sendData.personalInfo.citizenshipStatus(null);
          }
          PrimaryInfoModel.updateApplicant(ko.toJSON(sendData)).done(function() {
            if (self.productDetails().isRegistered && self.isRequirementRequired()) {
              if (self.productDetails().productClassName === "CREDIT_CARD") {
                self.productDetails().requirements.requestedAmount.amount = self.productDetails().offers.offerAdditionalDetails.creditCardLimitDetail[0].maximumCreditLimit;
              }
              PrimaryInfoModel.submitRequirements(url, self.productDetails().submissionId.value, ko.toJSON(self.productDetails().requirements)).done(function(data) {
                if (self.productDetails().productClassName === "LOANS") {
                  self.productDetails().facilityId = data.loanApplicationRequirementDTO.facilityId;
                } else if (self.productDetails().productClassName === "CREDIT_CARD") {
                  self.productDetails().facilityId = data.creditCardApplicationRequirementDTO.facilityId;
                }
              });
            }
            self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion);
          });
        } else {
          PrimaryInfoModel.saveApplicant(ko.toJSON(sendData)).done(function(data) {
            self.applicantObject().applicantId().value = data.applicantId.value;
            if (self.productDetails().productClassName === "CREDIT_CARD") {
              self.productDetails().requirements.requestedAmount.amount = self.productDetails().offers.offerAdditionalDetails.creditCardLimitDetail[0].maximumCreditLimit;
            }
            PrimaryInfoModel.submitRequirements(url, self.productDetails().submissionId.value, ko.toJSON(self.productDetails().requirements)).done(function(data) {
              if (self.productDetails().productClassName === "LOANS") {
                self.productDetails().facilityId = data.loanApplicationRequirementDTO.facilityId;
              } else if (self.productDetails().productClassName === "CREDIT_CARD") {
                self.productDetails().facilityId = data.creditCardApplicationRequirementDTO.facilityId;
              }
              self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion);
              primaryInfoCopy = ko.toJSON(self.applicantObject().primaryInfo);
            });
          });
        }

      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }

    };
  };
});
