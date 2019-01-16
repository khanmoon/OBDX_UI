define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "ojL10n!lzn/beta/resources/nls/primary-registration",
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
        KoModel.primaryInfo.isPermanentResidence = ko.observable(KoModel.primaryInfo.isPermanentResidence, true);
        KoModel.primaryInfo.residentCountry = ko.observable(KoModel.primaryInfo.residentCountry.trim(), "");
        KoModel.selectedValues = ko.observable(KoModel.selectedValues, "");
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
    PrimaryInfoModel.init(self.productDetails().submissionId.value);
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
    self.permanentResident = ko.observable("OPTION_YES");
    self.coApplicant = rootParams.coApplicant;
    self.tncText = self.resource.tncLine1 + "\n" + self.resource.tncLine2 + "\n" + self.resource.tncLine3;
    self.suffixLoaded = ko.observable(false);
    self.suffixOptions = ko.observableArray([]);
    var primaryInfoCopy;
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
    if (self.applicantObject().primaryInfo && self.productDetails().productType === "AUTOMOBILE") {
      var basicInfo = self.applicantObject().primaryInfo;
    }
    PrimaryInfoModel.getSalutations().then(function(data) {
      self.salutations(data.enumRepresentations[0].data);
      self.salutationsLoaded(true);
    });
    PrimaryInfoModel.fetchSuffixes().done(function(data) {
      self.suffixOptions(data.enumRepresentations[0].data);
      self.suffixLoaded(true);
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
      $.when(PrimaryInfoModel.getSalutations(), PrimaryInfoModel.fetchSuffixes(), PrimaryInfoModel.fetchCountries()).done(function() {
        enumCallsFinishedDeferred.resolve(true);
      });
      return enumCallsFinishedDeferred;
    };
    self.enumCallsFinished().done(function() {
      if (!self.applicantObject().primaryInfo) {
        self.applicantObject().primaryInfo = getNewKoModel();
        self.applicantObject().primaryInfo.applicantType = "primary";
        self.applicantObject().primaryInfo.disableInputs(false);
        self.applicantObject().primaryInfo.primaryInfo.citizenship = self.resource.citizenship.toUpperCase();
        if (!(self.applicantObject().applicantId() && self.applicantObject().applicantId().value.length > 0)) {
          self.primaryDataLoaded(true);
        }
      }
      if (self.applicantObject().applicantId() && self.applicantObject().applicantId().value.length > 0) {
        PrimaryInfoModel.fetchpplicantList(self.productDetails().submissionId.value).done(function(data) {
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
            self.applicantObject().primaryInfo.primaryInfo.citizenship = self.productDetails().applicantList()[applicantIndex].personalInfo.citizenship ? self.productDetails().applicantList()[applicantIndex].personalInfo.citizenship : self.resource.citizenship.toUpperCase();
            self.applicantObject().primaryInfo.primaryInfo.isPermanentResidence = ko.observable(self.productDetails().applicantList()[applicantIndex].personalInfo.isPermanentResidence);
            if (self.applicantObject().primaryInfo.primaryInfo.isPermanentResidence()) {
              self.permanentResident("OPTION_YES");
            } else if (self.applicantObject().primaryInfo.primaryInfo.isPermanentResidence() === undefined) {
              self.permanentResident("OPTION_YES");
              self.applicantObject().primaryInfo.primaryInfo.isPermanentResidence(true);
            } else {
              self.permanentResident("OPTION_NO");
              self.applicantObject().primaryInfo.primaryInfo.isPermanentResidence(false);
            }
            self.applicantObject().primaryInfo.primaryInfo.residentCountry = ko.observable(self.productDetails().applicantList()[applicantIndex].personalInfo.residentCountry);
            self.applicantObject().primaryInfo.selectedValues().salutation = rootParams.baseModel.getDescriptionFromCode(self.salutations(), self.applicantObject().primaryInfo.primaryInfo.salutation);
            self.applicantObject().primaryInfo.selectedValues().citizenship = rootParams.baseModel.getDescriptionFromCode(self.countries(), self.productDetails().applicantList()[applicantIndex].personalInfo.citizenship);
            self.applicantObject().primaryInfo.selectedValues().residentCountry = rootParams.baseModel.getDescriptionFromCode(self.countries(), self.productDetails().applicantList()[applicantIndex].personalInfo.residentCountry);
            if (self.productDetails().applicantList()[applicantIndex].personalInfo.email) {
              self.applicantObject().primaryInfo.primaryInfo.email = self.productDetails().applicantList()[applicantIndex].personalInfo.email.replace("&#x40;", "@");
            }
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
      }
      if (event.detail.value === "OPTION_YES") {
        self.applicantObject().primaryInfo.primaryInfo.isPermanentResidence(true);
      }
    };
    self.submitApplicant = function() {
      var primaryRegistrationTracker = document.getElementById("primaryRegistrationTracker");
      if (primaryRegistrationTracker.valid === "valid") {
        if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
          return;
        }
        if (!self.applicantObject().primaryInfo.primaryInfo.middleName) {
          self.applicantObject().primaryInfo.primaryInfo.middleName = null;
        }
        self.applicantObject().primaryInfo.selectedValues().salutation = rootParams.baseModel.getDescriptionFromCode(self.salutations(), self.applicantObject().primaryInfo.primaryInfo.salutation);
        self.applicantObject().primaryInfo.selectedValues().citizenship = rootParams.baseModel.getDescriptionFromCode(self.countries(), self.applicantObject().primaryInfo.primaryInfo.citizenship);
        self.applicantObject().primaryInfo.selectedValues().residentCountry = rootParams.baseModel.getDescriptionFromCode(self.countries(), self.applicantObject().primaryInfo.primaryInfo.residentCountry());
        if (self.checkformDataChange(primaryInfoCopy, ko.toJSON(self.applicantObject().primaryInfo), rootParams.applicantStages)) {
          if (self.productDetails().isRegistered && self.isRequirementRequired()) {
            if (self.productDetails().productClassName === "CREDIT_CARD") {
              self.productDetails().requirements.requestedAmount.amount = self.productDetails().offers.offerAdditionalDetails.creditCardLimitDetail[0].maximumCreditLimit;
            }
            self.productDetails().requirements.isIPA = false;
            self.productDetails().requirements.state = self.productDetails().selectedState;
            PrimaryInfoModel.submitRequirements(url, self.productDetails().submissionId.value, ko.mapping.toJSON(self.productDetails().requirements, {
              "ignore": ["selectedValues"]
            })).done(function(data) {
              if (self.productDetails().productClassName === "LOANS") {
                self.productDetails().facilityId = data.loanApplicationRequirementDTO.facilityId;
              } else if (self.productDetails().productClassName === "CREDIT_CARD") {
                self.productDetails().facilityId = data.creditCardApplicationRequirementDTO.facilityId;
              }
              self.displayDisclosure(true);
            });
          } else {
            self.displayDisclosure(true);
          }
          return true;
        }
        if (!basicInfo) {
          self.setAccordionTitle();
        }
        var sendData = {
          facilityId: self.productDetails().facilityId,
          productGroupSerialNumber: self.productGroupSerialNumber().toString(),
          personalInfo: self.applicantObject().primaryInfo.primaryInfo,
          applicantRelationshipType: self.applicantObject().applicantRelationshipType,
          applicantType: "IND"
        };
        if (self.applicantObject().applicantId() && self.applicantObject().applicantId().value.length > 0) {
          sendData.applicantId = self.applicantObject().applicantId().value;
          PrimaryInfoModel.setApplicantId(self.applicantObject().applicantId().value);
          PrimaryInfoModel.updateApplicant(ko.toJSON(sendData)).done(function() {
            if (self.productDetails().isRegistered && self.isRequirementRequired()) {
              if (self.productDetails().productClassName === "CREDIT_CARD") {
                self.productDetails().requirements.requestedAmount.amount = self.productDetails().offers.offerAdditionalDetails.creditCardLimitDetail[0].maximumCreditLimit;
              }
              self.productDetails().requirements.isIPA = false;
              PrimaryInfoModel.submitRequirements(url, self.productDetails().submissionId.value, ko.mapping.toJSON(self.productDetails().requirements, {
                "ignore": ["selectedValues"]
              })).done(function(data) {
                if (self.productDetails().productClassName === "LOANS") {
                  self.productDetails().facilityId = data.loanApplicationRequirementDTO.facilityId;
                } else if (self.productDetails().productClassName === "CREDIT_CARD") {
                  self.productDetails().facilityId = data.creditCardApplicationRequirementDTO.facilityId;
                }
                self.displayDisclosure(true);
              });
            } else {
              self.displayDisclosure(true);
            }
            self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion);
          });
        } else {
          var applicantCreateData = sendData;
          applicantCreateData.personalInfo = getNewKoModel().primaryInfo;
          applicantCreateData.personalInfo.salutation = self.applicantObject().primaryInfo.primaryInfo.salutation;
          applicantCreateData.personalInfo.firstName = self.applicantObject().primaryInfo.primaryInfo.firstName;
          applicantCreateData.personalInfo.lastName = self.applicantObject().primaryInfo.primaryInfo.lastName;
          applicantCreateData.personalInfo.middleName = self.applicantObject().primaryInfo.primaryInfo.middleName;
          PrimaryInfoModel.createApplicant(ko.toJSON(applicantCreateData)).done(function(data) {
            sendData.personalInfo = self.applicantObject().primaryInfo.primaryInfo;
            self.applicantObject().applicantId().value = data.applicantId.value;
            PrimaryInfoModel.setApplicantId(self.applicantObject().applicantId().value);
            if (self.productDetails().productClassName === "CREDIT_CARD") {
              self.productDetails().requirements.requestedAmount.amount = self.productDetails().offers.offerAdditionalDetails.creditCardLimitDetail[0].maximumCreditLimit;
            }
            self.productDetails().requirements.isIPA = false;
            PrimaryInfoModel.submitRequirements(url, self.productDetails().submissionId.value, ko.mapping.toJSON(self.productDetails().requirements, {
              "ignore": ["selectedValues"]
            })).done(function(data) {
              PrimaryInfoModel.updateApplicant(ko.toJSON(sendData)).done(function() {
                self.displayDisclosure(true);
                self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion, rootParams.index + 1);
                primaryInfoCopy = ko.toJSON(self.applicantObject().primaryInfo);
              });
              if (self.productDetails().productClassName === "LOANS") {
                self.productDetails().facilityId = data.loanApplicationRequirementDTO.facilityId;
              } else if (self.productDetails().productClassName === "CREDIT_CARD") {
                self.productDetails().facilityId = data.creditCardApplicationRequirementDTO.facilityId;
              }
            });
          });
        }
      } else {
        primaryRegistrationTracker.showMessages();
        primaryRegistrationTracker.focusOn("@firstInvalidShown");
      }
    };
  };
});
