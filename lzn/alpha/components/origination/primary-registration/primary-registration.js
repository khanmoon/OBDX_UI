define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "baseLogger",
  "ojL10n!lzn/alpha/resources/nls/primary-registration",
  "ojs/ojcheckboxset",
  "ojs/ojinputtext",
  "ojs/ojswitch",
  "ojs/ojknockout-validation",
  "ojs/ojdialog",
  "ojs/ojswitch",
  "ojs/ojvalidationgroup",
  "promise",
  "ojs/ojradioset"
], function (oj, ko, $, PrimaryInfoModelObject, BaseLogger, resourceBundle) {
  "use strict";
  return function (rootParams) {
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
      getNewKoModel = function (model) {
        var KoModel = PrimaryInfoModel.getNewModel(model);
        KoModel.primaryInfo.firstName = ko.observable(KoModel.primaryInfo.firstName);
        KoModel.primaryInfo.lastName = ko.observable(KoModel.primaryInfo.lastName);
        KoModel.primaryInfo.birthDate = ko.observable(KoModel.primaryInfo.birthDate);
        KoModel.primaryInfo.aliasNamePresent = ko.observable(KoModel.primaryInfo.aliasNamePresent, false);
        KoModel.primaryInfo.aliasName.firstName = ko.observable(KoModel.primaryInfo.aliasName.firstName);

        KoModel.primaryInfo.aliasName.lastName = ko.observable(KoModel.primaryInfo.aliasName.lastName);
        KoModel.disableInputs = ko.observable(KoModel.disableInputs);
        KoModel.selectedValues = ko.observable(KoModel.selectedValues);
        KoModel.isCompleting = ko.observable(KoModel.isCompleting);
        KoModel.adConsent = ko.observable(KoModel.adConsent);
        KoModel.primaryInfo.citizenship = KoModel.primaryInfo.citizenship.trim();
        KoModel.primaryInfo.isPermanentResidence = ko.observable(KoModel.primaryInfo.isPermanentResidence, true);
        KoModel.primaryInfo.residentCountry = ko.observable(KoModel.primaryInfo.residentCountry.trim());
        return KoModel;
      },
      getOtherSalutationsSuccessHandler = function (data) {
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
    self.securityQuestions = ko.observableArray([]);
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
    self.groupValid = ko.observable();
    self.pwshown = ko.observable(false);
    self.permanentResident = ko.observable("OPTION_YES");
    self.coApplicant = rootParams.coApplicant;
    self.isAlternateName = (rootParams.applicantObject.primaryInfo && rootParams.applicantObject.primaryInfo.primaryInfo.aliasNamePresent() === true) ? ko.observable("YES") : ko.observable("NO");
    self.isAlternateNameFlag = (rootParams.applicantObject.primaryInfo && rootParams.applicantObject.primaryInfo.primaryInfo.aliasNamePresent) ? rootParams.applicantObject.primaryInfo.primaryInfo.aliasNamePresent : ko.observable(false);
    self.tncText = self.resource.tncLine1 + "\n" + self.resource.tncLine2 + "\n" + self.resource.tncLine3;
    var primaryInfoCopy, basicInfo;
    self.salutionChanged = function (event) {
      if (event.detail.value) {
        if (event.detail.value === "145") {
          PrimaryInfoModel.getOtherSalutations().then(getOtherSalutationsSuccessHandler);
        } else {
          self.otherSalutationLoaded(false);
        }
      }
    };

    self.alternateNameChangeHandler = function (event) {

      if (event.detail.value === "YES") {
        self.applicantObject().primaryInfo.primaryInfo.aliasNamePresent(true);
        self.isAlternateNameFlag(true);
      } else if (event.detail.value === "NO") {
        self.applicantObject().primaryInfo.primaryInfo.aliasNamePresent(false);
        self.isAlternateNameFlag(false);
      }
    };

    PrimaryInfoModel.getSalutations().then(function (data) {
      self.salutations(data.enumRepresentations[0].data);
      self.salutationsLoaded(true);
    });
    PrimaryInfoModel.fetchCountries().done(function (data) {
      for (i = 0; i < data.enumRepresentations[0].data.length; i++) {
        self.countries().push({
          code: data.enumRepresentations[0].data[i].code,
          description: data.enumRepresentations[0].data[i].description
        });
      }
      self.countriesLoaded(true);
    });
    PrimaryInfoModel.getGenderEnum().then(function (data) {
      self.genderOptions(data.enumRepresentations[0].data);
      self.genderLoaded(true);
    });
    PrimaryInfoModel.getMaritalStatus().then(function (data) {
      self.maritalStatus(data.enumRepresentations[0].data);
      self.maritalStatusLoaded(true);
    });
    var enumCallsFinishedDeferred = $.Deferred();
    self.enumCallsFinished = function () {
      $.when(PrimaryInfoModel.getSalutations(), PrimaryInfoModel.getMaritalStatus(), PrimaryInfoModel.getGenderEnum()).done(function () {
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
    if (self.applicantObject().primaryInfo && self.productDetails().productType === "LOANS") {
      basicInfo = self.applicantObject().primaryInfo;
    }
    self.enumCallsFinished().done(function () {
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
        PrimaryInfoModel.fetchpplicantList(self.productDetails().submissionId.value).done(function (data) {
          self.productDetails().applicantList(data.applicants);
          if (self.productDetails().applicantList() && self.productDetails().applicantList().length > 0) {
            var applicantIndex;
            var applicantsIndexArray = self.productDetails().applicantList().reduce(function (a, e, i) {
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
            self.applicantObject().primaryInfo.primaryInfo.firstName(self.productDetails().applicantList()[applicantIndex].personalInfo.firstName);
            if (self.productDetails().applicantList()[applicantIndex].personalInfo.middleName) {
              self.applicantObject().primaryInfo.primaryInfo.middleName = self.productDetails().applicantList()[applicantIndex].personalInfo.middleName;
            } else {
              self.applicantObject().primaryInfo.primaryInfo.middleName = null;
            }
            self.applicantObject().primaryInfo.primaryInfo.lastName(self.productDetails().applicantList()[applicantIndex].personalInfo.lastName);
            self.applicantObject().primaryInfo.primaryInfo.birthDate(self.productDetails().applicantList()[applicantIndex].personalInfo.birthDate ? self.productDetails().applicantList()[applicantIndex].personalInfo.birthDate.substring(0, 10) : "");
            self.applicantObject().primaryInfo.primaryInfo.salutation = self.productDetails().applicantList()[applicantIndex].personalInfo.salutation ? self.productDetails().applicantList()[applicantIndex].personalInfo.salutation : "";
            self.applicantObject().primaryInfo.primaryInfo.otherSalutation = self.productDetails().applicantList()[applicantIndex].personalInfo.otherSalutation;
            self.applicantObject().primaryInfo.primaryInfo.noOfDependants = self.productDetails().applicantList()[applicantIndex].personalInfo.noOfDependants.toString();
            self.applicantObject().primaryInfo.primaryInfo.gender = self.productDetails().applicantList()[applicantIndex].personalInfo.gender ? self.productDetails().applicantList()[applicantIndex].personalInfo.gender : "";
            self.applicantObject().primaryInfo.primaryInfo.maritalStatus = self.productDetails().applicantList()[applicantIndex].personalInfo.maritalStatus ? self.productDetails().applicantList()[applicantIndex].personalInfo.maritalStatus : "";
            self.applicantObject().primaryInfo.selectedValues().maritalStatus = rootParams.baseModel.getDescriptionFromCode(self.maritalStatus(), self.applicantObject().primaryInfo.primaryInfo.maritalStatus);
            self.applicantObject().primaryInfo.selectedValues().gender = rootParams.baseModel.getDescriptionFromCode(self.genderOptions(), self.applicantObject().primaryInfo.primaryInfo.gender);
            self.applicantObject().primaryInfo.selectedValues().salutation = rootParams.baseModel.getDescriptionFromCode(self.salutations(), self.applicantObject().primaryInfo.primaryInfo.salutation);
            self.applicantObject().primaryInfo.primaryInfo.citizenship = self.productDetails().applicantList()[applicantIndex].personalInfo.citizenship ? self.productDetails().applicantList()[applicantIndex].personalInfo.citizenship : "";
            self.applicantObject().primaryInfo.primaryInfo.isPermanentResidence(self.productDetails().applicantList()[applicantIndex].personalInfo.isPermanentResidence);
            self.applicantObject().primaryInfo.primaryInfo.aliasNamePresent(self.productDetails().applicantList()[applicantIndex].personalInfo.aliasNamePresent);
            if (self.productDetails().applicantList()[applicantIndex].personalInfo.aliasNamePresent === true) {
              self.isAlternateName("YES");
              self.isAlternateNameFlag(true);
              self.applicantObject().primaryInfo.primaryInfo.aliasName.firstName(self.productDetails().applicantList()[applicantIndex].personalInfo.aliasName.firstName);
              if (self.productDetails().applicantList()[applicantIndex].personalInfo.aliasName.middleName) {
                self.applicantObject().primaryInfo.primaryInfo.aliasName.middleName = self.productDetails().applicantList()[applicantIndex].personalInfo.aliasName.middleName;
              } else {
                self.applicantObject().primaryInfo.primaryInfo.aliasName.middleName = null;
              }
              self.applicantObject().primaryInfo.primaryInfo.aliasName.lastName(self.productDetails().applicantList()[applicantIndex].personalInfo.aliasName.lastName);
            }
            self.applicantObject().primaryInfo.primaryInfo.residentCountry(self.productDetails().applicantList()[applicantIndex].personalInfo.residentCountry ? self.productDetails().applicantList()[applicantIndex].personalInfo.residentCountry : "");
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
          self.primaryDataLoaded(true);
        });
      }
      var selectedSalutation = self.applicantObject().primaryInfo.primaryInfo.salutation;
      if (selectedSalutation === "145") {
        PrimaryInfoModel.getOtherSalutations().then(getOtherSalutationsSuccessHandler);
      }
    });
    self.savePermanentResidence = function (event) {
      if (event.detail.value === "OPTION_NO") {
        self.applicantObject().primaryInfo.primaryInfo.isPermanentResidence(false);
        self.permanentResident("OPTION_NO");
      }
      if (event.detail.value === "OPTION_YES") {
        self.applicantObject().primaryInfo.primaryInfo.isPermanentResidence(true);
        self.permanentResident("OPTION_YES");
      }
    };
    self.submitApplicant = function () {
      var tracker = document.getElementById("tracker");
      if (tracker.valid === "valid") {
        if (!basicInfo) {
          self.setAccordionTitle();
        }
        self.applicantObject().primaryInfo.primaryInfo.residentCountry(self.applicantObject().primaryInfo.primaryInfo.residentCountry());
        self.applicantObject().primaryInfo.selectedValues().citizenship = rootParams.baseModel.getDescriptionFromCode(self.countries(), self.applicantObject().primaryInfo.primaryInfo.citizenship);
        self.applicantObject().primaryInfo.selectedValues().residentCountry = rootParams.baseModel.getDescriptionFromCode(self.countries(), self.applicantObject().primaryInfo.primaryInfo.residentCountry());
        if (self.checkformDataChange(primaryInfoCopy, ko.toJSON(self.applicantObject().primaryInfo), rootParams.applicantStages)) {
          if (self.productDetails().isRegistered && self.isRequirementRequired()) {
            if (self.productDetails().productClassName === "CREDIT_CARD") {
              self.productDetails().requirements.requestedAmount.amount = self.productDetails().offers.offerAdditionalDetails.creditCardLimitDetail[0].maximumCreditLimit;
            }
            PrimaryInfoModel.submitRequirements(url, self.productDetails().submissionId.value, ko.mapping.toJSON(self.productDetails().requirements, {
              "ignore": ["selectedValues"]
            })).done(function (data) {
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
        if (self.applicantObject().primaryInfo.primaryInfo.email) {
          self.applicantObject().primaryInfo.primaryInfo.email = self.applicantObject().primaryInfo.primaryInfo.email;
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
          PrimaryInfoModel.updateApplicant(ko.toJSON(sendData)).done(function () {
            if (self.productDetails().isRegistered && self.isRequirementRequired()) {
              if (self.productDetails().productClassName === "CREDIT_CARD") {
                self.productDetails().requirements.requestedAmount.amount = self.productDetails().offers.offerAdditionalDetails.creditCardLimitDetail[0].maximumCreditLimit;
              }
              PrimaryInfoModel.submitRequirements(url, self.productDetails().submissionId.value, ko.toJSON(self.productDetails().requirements)).done(function (data) {
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
          var applicantCreateData = sendData;
          applicantCreateData.personalInfo = getNewKoModel().primaryInfo;
          applicantCreateData.personalInfo.salutation = self.applicantObject().primaryInfo.primaryInfo.salutation;
          applicantCreateData.personalInfo.firstName = self.applicantObject().primaryInfo.primaryInfo.firstName;
          applicantCreateData.personalInfo.lastName = self.applicantObject().primaryInfo.primaryInfo.lastName;
          applicantCreateData.personalInfo.middleName = self.applicantObject().primaryInfo.primaryInfo.middleName;
          applicantCreateData.personalInfo.aliasNamePresent(self.applicantObject().primaryInfo.primaryInfo.aliasNamePresent());
          applicantCreateData.personalInfo.aliasName.firstName = self.applicantObject().primaryInfo.primaryInfo.aliasName.firstName;
          applicantCreateData.personalInfo.aliasName.lastName = self.applicantObject().primaryInfo.primaryInfo.aliasName.lastName;
          applicantCreateData.personalInfo.aliasName.middleName = self.applicantObject().primaryInfo.primaryInfo.aliasName.middleName;
          PrimaryInfoModel.createApplicant(ko.toJSON(applicantCreateData)).done(function (data) {
            sendData.personalInfo = self.applicantObject().primaryInfo.primaryInfo;
            self.applicantObject().applicantId().value = data.applicantId.value;
            PrimaryInfoModel.setApplicantId(self.applicantObject().applicantId().value);
            if (self.productDetails().productClassName === "CREDIT_CARD") {
              self.productDetails().requirements.requestedAmount.amount = self.productDetails().offers.offerAdditionalDetails.creditCardLimitDetail[0].maximumCreditLimit;
            }
            PrimaryInfoModel.submitRequirements(url, self.productDetails().submissionId.value, ko.toJSON(self.productDetails().requirements)).done(function (data) {
              PrimaryInfoModel.updateApplicant(ko.toJSON(sendData)).done(function () {
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
        if (self.productDetails().requirements.propertyDetails) {
          var i;
          for (i = 0; i < self.productDetails().requirements.propertyDetails.ownership.length; i++) {
            self.productDetails().requirements.propertyDetails.ownership[i].partyName(rootParams.baseModel.format(self.resource.generic.common.name, {
              firstName: self.applicantDetails()[i].primaryInfo.primaryInfo.firstName(),
              lastName: self.applicantDetails()[i].primaryInfo.primaryInfo.lastName()
            }));
          }
        }
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };
    self.showTermsAndConditions = function () {
      $("#termsAndConditions").ojDialog("open");
    };
    var showPassword = function () {
      $("#pwd").prop({
        type: "text"
      });
    };
    var hidePassword = function () {
      $("#pwd").prop({
        type: "password"
      });
    };
    self.showHide = function () {
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