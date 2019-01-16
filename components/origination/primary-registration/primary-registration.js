define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "baseLogger",
  "ojL10n!resources/nls/primary-registration",
  "ojs/ojcheckboxset",
  "ojs/ojinputtext",
  "ojs/ojswitch",
  "ojs/ojknockout-validation",
  "ojs/ojdialog",
  "ojs/ojswitch",
  "ojs/ojvalidationgroup"
], function(oj, ko, $, PrimaryInfoModelObject, BaseLogger, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this,
      PrimaryInfoModel = new PrimaryInfoModelObject(),
      i = 0,
      url, depsData = {
        "enumRepresentations": {
          "data": [{
              "code": "0",
              "description": "0"
            },
            {
              "code": "1",
              "description": "1"
            },
            {
              "code": "2",
              "description": "2"
            },
            {
              "code": "3",
              "description": "3"
            },
            {
              "code": "4",
              "description": "4"
            },
            {
              "code": "5",
              "description": "5"
            }
          ]
        }
      },
      getNewKoModel = function(model) {
        var KoModel = PrimaryInfoModel.getNewModel(model);
        KoModel.primaryInfo.firstName = ko.observable(KoModel.primaryInfo.firstName);
        KoModel.primaryInfo.lastName = ko.observable(KoModel.primaryInfo.lastName);
        KoModel.primaryInfo.birthDate = ko.observable(KoModel.primaryInfo.birthDate);
        KoModel.disableInputs = ko.observable(KoModel.disableInputs);
        KoModel.selectedValues = ko.observable(KoModel.selectedValues);
        KoModel.isCompleting = ko.observable(KoModel.isCompleting);
        KoModel.adConsent = ko.observable(KoModel.adConsent);
        KoModel.primaryInfo.citizenship = KoModel.primaryInfo.citizenship.trim();
        KoModel.primaryInfo.isPermanentResidence = ko.observable(KoModel.primaryInfo.isPermanentResidence);
        if (self.productDetails().productType !== "CHECKING" && (self.applicantDetails()[0].newApplicant || (model && model.isPermanentResidence))) {
          KoModel.primaryInfo.isPermanentResidence(true);
        }
        return KoModel;
      },
      getOtherSalutationsSuccessHandler = function(data) {
        self.otherSalutations(data.enumRepresentations[0].data);
        self.otherSalutationLoaded(true);
      };
    ko.utils.extend(self, rootParams.rootModel);
    self.passwordRepeat = ko.observable();
    self.applicantObject = ko.observable(rootParams.applicantObject);
    rootParams.baseModel.registerElement("modal-window");
    self.resource = resourceBundle;
    PrimaryInfoModel.init(self.productDetails().submissionId.value);
    self.salutations = ko.observable([]);
    self.otherSalutations = ko.observable([]);
    self.genderOptions = ko.observable([]);
    self.countries = ko.observableArray([]);
    self.countriesLoaded = ko.observable(false);
    self.maritalStatus = ko.observable([]);
    self.tempApplicantId = ko.observable();
    self.noOfDeps = ko.observable(depsData.enumRepresentations.data);
    self.validationTracker = ko.observable();
    self.primaryDataLoaded = ko.observable(false);
    self.otherSalutationLoaded = ko.observable(false);
    self.salutationsLoaded = ko.observable(false);
    self.genderLoaded = ko.observable(false);
    self.maritalStatusLoaded = ko.observable(false);
    self.displaypasswordpolicy = ko.observable();
    self.baseUrl = ko.observable();
    self.pwshown = ko.observable(false);
    self.permanentResident = ko.observable();
    self.groupValid = ko.observable();
    if (self.productDetails().productType !== "CHECKING" && self.applicantDetails()[0].newApplicant) {
      self.permanentResident("OPTION_YES");
    }
    self.coApplicant = rootParams.coApplicant;
    self.tncText = self.resource.tncLine1 + "\n" + self.resource.tncLine2 + "\n" + self.resource.tncLine3;
    var primaryInfoCopy;
    self.salutionChanged = function(event) {
      if (event.detail.value) {
        if (event.detail.value === "145") {
          PrimaryInfoModel.getOtherSalutations().then(getOtherSalutationsSuccessHandler);
        } else {
          self.otherSalutationLoaded(false);
        }
      }
    };
    PrimaryInfoModel.getSalutations().then(function(data) {
      self.salutations(data.enumRepresentations[0].data);
      self.salutationsLoaded(true);
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
    PrimaryInfoModel.getGenderEnum().then(function(data) {
      self.genderOptions(data.enumRepresentations[0].data);
      self.genderLoaded(true);
    });
    PrimaryInfoModel.getMaritalStatus().then(function(data) {
      self.maritalStatus(data.enumRepresentations[0].data);
      self.maritalStatusLoaded(true);
    });
    var enumCallsFinishedDeferred = $.Deferred();
    self.enumCallsFinished = function() {
      $.when(PrimaryInfoModel.getSalutations(), PrimaryInfoModel.getMaritalStatus(), PrimaryInfoModel.getGenderEnum()).done(function() {
        enumCallsFinishedDeferred.resolve(true);
      });
      return enumCallsFinishedDeferred;
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
    self.enumCallsFinished().done(function() {
      if (!self.applicantObject().primaryInfo) {
        self.applicantObject().primaryInfo = getNewKoModel();
        self.applicantObject().primaryInfo.applicantType = "primary";
        self.applicantObject().primaryInfo.disableInputs(false);
        if (!self.productDetails().isRegistered && self.socialMediaResponse()) {
          self.applicantObject().primaryInfo.primaryInfo.firstName(self.socialMediaResponse().firstName);
          self.applicantObject().primaryInfo.primaryInfo.lastName(self.socialMediaResponse().lastName);
          if (self.socialMediaResponse().location) {
            self.applicantObject().primaryInfo.primaryInfo.citizenship = self.socialMediaResponse().location.country.code.toUpperCase();
          }
        }
        if (!(self.applicantObject().applicantId() && self.applicantObject().applicantId().value.length > 0)) {
          self.primaryDataLoaded(true);
        }
      }
      if (self.applicantObject().applicantId() && self.applicantObject().applicantId().value.length > 0) {
        PrimaryInfoModel.fetchpplicantList(self.productDetails().submissionId.value, self.applicantDetails()[0].applicantId().value).done(function(data) {
          if (!self.applicantObject().newApplicant) {
            var showComplete = false;
            if (self.checkDataAvailability(data.applicant.personalInfo, rootParams.applicantStages.id)) {
              showComplete = true;
            }
            self.showIcon(showComplete, rootParams.applicantStages);
          }
          self.productDetails().applicantList(data.applicant);
          if (self.productDetails().applicantList()) {
            if (!self.applicantObject().primaryInfo.primaryInfo.firstName()) {
              self.applicantObject().primaryInfo.primaryInfo.firstName(self.productDetails().applicantList().personalInfo.firstName);
            }
            if (self.productDetails().applicantList().personalInfo.middleName) {
              self.applicantObject().primaryInfo.primaryInfo.middleName = self.productDetails().applicantList().personalInfo.middleName;
            } else {
              self.applicantObject().primaryInfo.primaryInfo.middleName = "";
            }
            if (!self.applicantObject().primaryInfo.primaryInfo.lastName()) {
              self.applicantObject().primaryInfo.primaryInfo.lastName(self.productDetails().applicantList().personalInfo.lastName);
            }
            self.applicantObject().primaryInfo.primaryInfo.birthDate(self.productDetails().applicantList().personalInfo.birthDate ? self.productDetails().applicantList().personalInfo.birthDate.substring(0, 10) : "");
            self.applicantObject().primaryInfo.primaryInfo.salutation = self.productDetails().applicantList().personalInfo.salutation ? self.productDetails().applicantList().personalInfo.salutation : "";
            self.applicantObject().primaryInfo.primaryInfo.otherSalutation = self.productDetails().applicantList().personalInfo.otherSalutation;
            self.applicantObject().primaryInfo.primaryInfo.noOfDependants = self.productDetails().applicantList().personalInfo.noOfDependants.toString();
            self.applicantObject().primaryInfo.primaryInfo.gender = self.productDetails().applicantList().personalInfo.gender ? self.productDetails().applicantList().personalInfo.gender : "";
            self.applicantObject().primaryInfo.primaryInfo.maritalStatus = self.productDetails().applicantList().personalInfo.maritalStatus ? self.productDetails().applicantList().personalInfo.maritalStatus : "";
            self.applicantObject().primaryInfo.selectedValues().maritalStatus = rootParams.baseModel.getDescriptionFromCode(self.maritalStatus(), self.applicantObject().primaryInfo.primaryInfo.maritalStatus);
            self.applicantObject().primaryInfo.selectedValues().gender = rootParams.baseModel.getDescriptionFromCode(self.genderOptions(), self.applicantObject().primaryInfo.primaryInfo.gender);
            self.applicantObject().primaryInfo.primaryInfo.citizenship = self.productDetails().applicantList().personalInfo.citizenship ? self.productDetails().applicantList().personalInfo.citizenship : "";
            if (self.productDetails().applicantList().personalInfo.isPermanentResidence && self.productDetails().productType !== "CHECKING") {
              self.applicantObject().primaryInfo.primaryInfo.isPermanentResidence(self.productDetails().applicantList().personalInfo.isPermanentResidence);
              if (self.applicantObject().primaryInfo.primaryInfo.isPermanentResidence()) {
                self.permanentResident("OPTION_YES");
              } else {
                self.permanentResident("OPTION_NO");
              }
            }
            self.applicantObject().primaryInfo.selectedValues().citizenship = rootParams.baseModel.getDescriptionFromCode(self.countries(), self.productDetails().applicantList().personalInfo.citizenship);
            if (self.productDetails().applicantList().personalInfo.email) {
              self.applicantObject().primaryInfo.primaryInfo.email = self.productDetails().applicantList().personalInfo.email.replace("&#x40;", "@");
            }
            self.applicantObject().channelUser(self.productDetails().applicantList().channelUser);
            if (!self.productDetails().applicantList().newApplicant) {
              self.applicantObject().applicantType("customer");
              self.applicantObject().primaryInfo.disableInputs(true);
            } else {
              self.applicantObject().primaryInfo.disableInputs(false);
            }
          }
          primaryInfoCopy = self.toCleanJson(self.applicantObject().primaryInfo);
          self.primaryDataLoaded(true);
        });
      }
      var selectedSalutation = self.applicantObject().primaryInfo.primaryInfo.salutation;
      if (selectedSalutation === "145") {
        PrimaryInfoModel.getOtherSalutations().then(getOtherSalutationsSuccessHandler);
      }
    });
    self.savePermanentResidence = function(event) {
      if (event.detail.value === "OPTION_NO") {
        self.applicantObject().primaryInfo.primaryInfo.isPermanentResidence(false);
        self.permanentResident("OPTION_NO");
      }
      if (event.detail.value === "OPTION_YES") {
        self.applicantObject().primaryInfo.primaryInfo.isPermanentResidence(true);
        self.permanentResident("OPTION_YES");
      }
    };
    self.submitApplicant = function() {
      var tracker = document.getElementById("tracker");
      if (tracker.valid === "valid") {
        self.applicantObject().primaryInfo.primaryInfo.salutation = self.applicantObject().primaryInfo.primaryInfo.salutation;
        self.applicantObject().primaryInfo.primaryInfo.otherSalutation = self.applicantObject().primaryInfo.primaryInfo.otherSalutation;
        self.applicantObject().primaryInfo.primaryInfo.gender = self.applicantObject().primaryInfo.primaryInfo.gender;
        self.applicantObject().primaryInfo.primaryInfo.maritalStatus = self.applicantObject().primaryInfo.primaryInfo.maritalStatus;
        self.applicantObject().primaryInfo.primaryInfo.citizenship = self.applicantObject().primaryInfo.primaryInfo.citizenship;
        self.applicantObject().primaryInfo.selectedValues().citizenship = rootParams.baseModel.getDescriptionFromCode(self.countries(), self.applicantObject().primaryInfo.primaryInfo.citizenship);
        if (self.checkformDataChange(primaryInfoCopy, self.toCleanJson(self.applicantObject().primaryInfo), rootParams.applicantStages)) {
          if (self.productDetails().isRegistered && self.isRequirementRequired()) {
            if (self.productDetails().productClassName === "CREDIT_CARD") {
              self.productDetails().requirements.requestedAmount.amount = self.productDetails().offers.offerAdditionalDetails.creditCardLimitDetail[0].maximumCreditLimit;
            }
            PrimaryInfoModel.submitRequirements(url, self.productDetails().submissionId.value, self.toCleanJson(self.productDetails().requirements)).done(function(data) {
              if (self.productDetails().productClassName === "LOANS") {
                self.productDetails().facilityId = data.loanApplicationRequirementDTO.facilityId;
              } else if (self.productDetails().productClassName === "CREDIT_CARD") {
                self.productDetails().facilityId = data.creditCardApplicationRequirementDTO.facilityId;
              }
            });
          }
          return true;
        }
        self.applicantObject().primaryInfo.selectedValues().salutation = rootParams.baseModel.getDescriptionFromCode(self.salutations(), self.applicantObject().primaryInfo.primaryInfo.salutation);
        self.applicantObject().primaryInfo.selectedValues().otherSalutation = rootParams.baseModel.getDescriptionFromCode(self.otherSalutations(), self.applicantObject().primaryInfo.primaryInfo.otherSalutation);
        self.applicantObject().primaryInfo.selectedValues().gender = rootParams.baseModel.getDescriptionFromCode(self.genderOptions(), self.applicantObject().primaryInfo.primaryInfo.gender);
        self.applicantObject().primaryInfo.selectedValues().maritalStatus = rootParams.baseModel.getDescriptionFromCode(self.maritalStatus(), self.applicantObject().primaryInfo.primaryInfo.maritalStatus);
        if (self.applicantObject().primaryInfo.primaryInfo.gender === undefined) {
          self.applicantObject().primaryInfo.primaryInfo.gender = null;
        }
        var sendData = {
          applicantId: self.applicantObject().applicantRefId,
          personalInfo: self.applicantObject().primaryInfo.primaryInfo,
          applicantRelationshipType: self.applicantObject().applicantRelationshipType,
          applicantType: "IND",
          newApplicant: self.applicantObject().newApplicant
        };
        if (self.applicantObject().applicantId() && self.applicantObject().applicantId().value.length > 0) {
          sendData.applicantId = self.applicantObject().applicantId().value;
          PrimaryInfoModel.setApplicantId(self.applicantObject().applicantId().value);
          PrimaryInfoModel.updateApplicant(self.toCleanJson(sendData)).done(function() {
            if (self.productDetails().isRegistered && self.isRequirementRequired()) {
              if (self.productDetails().productClassName === "CREDIT_CARD") {
                self.productDetails().requirements.requestedAmount.amount = self.productDetails().offers.offerAdditionalDetails.creditCardLimitDetail[0].maximumCreditLimit;
              }
              PrimaryInfoModel.submitRequirements(url, self.productDetails().submissionId.value, self.toCleanJson(self.productDetails().requirements)).done(function(data) {
                if (self.productDetails().productClassName === "LOANS") {
                  self.productDetails().facilityId = data.loanApplicationRequirementDTO.facilityId;
                } else if (self.productDetails().productClassName === "CREDIT_CARD") {
                  self.productDetails().facilityId = data.creditCardApplicationRequirementDTO.facilityId;
                }
              });
            }
            self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion, rootParams.index + 1);
          });
        } else {
          PrimaryInfoModel.saveApplicant(self.toCleanJson(sendData)).done(function(data) {
            self.applicantObject().applicantId().value = data.applicantId.value;
            if (self.productDetails().productClassName === "CREDIT_CARD") {
              self.productDetails().requirements.requestedAmount.amount = self.productDetails().offers.offerAdditionalDetails.creditCardLimitDetail[0].maximumCreditLimit;
            }
            PrimaryInfoModel.submitRequirements(url, self.productDetails().submissionId.value, self.toCleanJson(self.productDetails().requirements)).done(function(data) {
              if (self.productDetails().productClassName === "LOANS") {
                self.productDetails().facilityId = data.loanApplicationRequirementDTO.facilityId;
              } else if (self.productDetails().productClassName === "CREDIT_CARD") {
                self.productDetails().facilityId = data.creditCardApplicationRequirementDTO.facilityId;
              }
            });
            self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion, rootParams.index + 1);
            primaryInfoCopy = self.toCleanJson(self.applicantObject().primaryInfo);
          });
        }
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };
    self.showTermsAndConditions = function() {
      $("#termsAndConditions").ojDialog("open");
    };
    var showPassword = function() {
      $("#pwd").prop({
        type: "text"
      });
    };
    var hidePassword = function() {
      $("#pwd").prop({
        type: "password"
      });
    };
    self.showHide = function() {
      if (!self.pwshown()) {
        self.pwshown(true);
        showPassword();
      } else {
        self.pwshown(false);
        hidePassword();
      }
    };
  };
});
