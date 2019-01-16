define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "ojL10n!lzn/gamma/resources/nls/requirements",
  "ojs/ojselectcombobox",
  "ojs/ojinputnumber",
  "ojs/ojinputtext",
  "ojs/ojcheckboxset",
  "ojs/ojknockout-validation",
  "ojs/ojdialog"
], function(oj, ko, $, RequirementsModel, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this,
      i = 0,
      url, getNewKoModel = function() {
        var KoModel = RequirementsModel.getNewModel(rootParams.baseModel.getLocaleValue("localCurrency"));
        return KoModel;
      };
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.groupValid = ko.observable();
    self.loanPurposeLoaded = ko.observable(false);
    rootParams.baseModel.registerElement("amount-input");
    self.validationEmailTracker = ko.observable();
    self.userId = ko.observable("");
    self.baseUrl = ko.observable();
    self.secondaryPurposes = ko.observableArray([]);
    self.purposeData = ko.observableArray([]);
    self.optionYears = ko.observableArray([]);
    self.minimumAmount = 5000;
    self.productDetails().SCRADate = ko.observable("");
    self.productDetails().SCRARefNo = ko.observable("");
    self.optionMonths = ko.observableArray([]);
    self.years = self.productDetails().maxTerm ? self.productDetails().maxTerm / 12 : 20;
    self.preferenceMode = ko.observableArray([]);
    self.productDetails().militaryDisclosures = ko.observableArray([]);
    self.disableSubmit = ko.observable(true);
    self.isServiceMember = ko.observable(false);
    self.existingRequirementsLoaded = ko.observable(false);
    self.validateScraRefNo = {
      type: "length",
      options: {
        min: 1,
        max: 30
      }
    };
    for (i = 0; i <= 1; i++) {
      self.productDetails().militaryDisclosures.push({
        value: false,
        disclosure: self.resource.militaryDisclosures[i]
      });
    }
    self.productDetails().militaryDisclosures()[0].value = true;
    for (i = 0; i <= self.years; i++) {
      self.optionYears.push({
        label: i,
        value: i
      });
    }
    for (i = 0; i <= 11; i++) {
      self.optionMonths.push({
        label: i,
        value: i
      });
    }
    var update = false;
    self.getRequirementModel = function(type) {
      RequirementsModel.fetchRequirements(self.productDetails().submissionId.value).done(function(data) {
        if (!self.productDetails().requirements) {
          self.productDetails().requirements = getNewKoModel()[type];
          self.productDetails().requirements.promoCode = "";
          if (self.productDetails().productClassName !== "CREDIT_CARD") {
            self.productDetails().requirements.noOfCoApplicants = "0";
          }
          if (self.productDetails().requirements.requestedAmount) {
            self.productDetails().requirements.requestedAmount.amount = ko.observable(ko.utils.unwrapObservable(self.productDetails().requirements.requestedAmount.amount));
          }
          if (data.loanApplicationRequirementDTO) {
            self.productDetails().requirements.nextPayDate = data.loanApplicationRequirementDTO.nextPayDate;
            self.productDetails().requirements.secondPayDate = data.loanApplicationRequirementDTO.secondPayDate;
            self.productDetails().requirements.alternatePayDay = data.loanApplicationRequirementDTO.alternatePayDay;
          }
          if (self.productDetails().requirements.requestedTenure) {
            self.productDetails().requirements.requestedTenure.years = ko.observable(ko.utils.unwrapObservable(self.productDetails().requirements.requestedTenure.years));
            self.productDetails().requirements.requestedTenure.months = ko.observable(ko.utils.unwrapObservable(self.productDetails().requirements.requestedTenure.months));
            self.productDetails().requirements.frequency = ko.observable(ko.utils.unwrapObservable(self.productDetails().requirements.frequency));
          }
        } else if (data.loanApplicationRequirementDTO && data.loanApplicationRequirementDTO.promoCode) {
          self.productDetails().requirements.promoCode = data.loanApplicationRequirementDTO.promoCode;
        } else {
          self.productDetails().requirements.promoCode = "";
        }
        self.existingRequirementsLoaded(true);
        var isServiceMemberRelation;
        RequirementsModel.getOtherDetails(self.productDetails().submissionId.value, self.applicantDetails()[0].applicantId().value).done(function(data) {
          if (!$.isEmptyObject(data.applicantOtherDetails)) {
            update = true;
            if (data.applicantOtherDetails.isServiceMemberRelation) {
              isServiceMemberRelation = data.applicantOtherDetails.isServiceMemberRelation;
              if (isServiceMemberRelation) {
                self.selectMilitaryDisclosure(0);
                self.isServiceMember(true);
                if (data.applicantOtherDetails.effectiveDateSCRA) {
                  self.productDetails().SCRADate(data.applicantOtherDetails.effectiveDateSCRA);
                  self.productDetails().SCRARefNo(data.applicantOtherDetails.scraRefNo);
                }
              } else {
                self.isServiceMember(false);
                self.selectMilitaryDisclosure(1);
              }
            }
          }
        });
      });
    };
    url = "submissions/{submissionId}/loanApplications";
    self.getRequirementModel("loanRequirement");
    var militaryDisclosurePayload;
    self.selectMilitaryDisclosure = function(index) {
      if (self.productDetails().militaryDisclosures()[index].value) {
        self.isServiceMember(true);
      } else {
        self.productDetails().SCRADate("");
        self.productDetails().SCRARefNo("");
        self.isServiceMember(false);
      }
      militaryDisclosurePayload = {
        isServiceMemberRelation: self.productDetails().militaryDisclosures()[index].value
      };
      self.productDetails().militaryDisclosures().index = index;
      $("#militaryDisclosure" + index).toggleClass("selected");
      for (i = 0; i < self.productDetails().militaryDisclosures().length; i++) {
        if (index !== i) {
          $("#militaryDisclosure" + i).removeClass("selected");
        }
      }
      for (i = 0; i < self.productDetails().militaryDisclosures().length; i++) {
        if ($("#militaryDisclosure" + i).hasClass("selected")) {
          self.disableSubmit(false);
          break;
        } else {
          self.disableSubmit(true);
        }
      }
    };
    self.productHeadingName(self.resource.requirements);
    self.validationTracker = ko.observable();
    self.currencyLoaded = ko.observable(false);
    self.currenciesLoaded = ko.observable(false);
    self.checkEmpty = function(obj) {
      if (obj !== "" && obj !== undefined && obj !== null) {
        return true;
      }
      return false;
    };
    self.submitRequirements = function() {
      var tracker = document.getElementById("payday-requirements-tracker");
      if (tracker.valid === "valid") {
        if (militaryDisclosurePayload.isServiceMemberRelation) {
          militaryDisclosurePayload.effectiveDateSCRA = self.productDetails().SCRADate();
          militaryDisclosurePayload.scraRefNo = self.productDetails().SCRARefNo();
        } else {
          self.productDetails().SCRADate("");
          self.productDetails().SCRARefNo("");
        }
        RequirementsModel.submitMilitaryDisclosure(self.productDetails().submissionId.value, self.applicantDetails()[0].applicantId().value, militaryDisclosurePayload, update);

        self.productDetails().requirements.productGroupCode = self.productDetails().productCode;
        self.productDetails().requirements.productGroupName = self.productDetails().productDescription;
        var productId = self.productDetails().productCode;
        self.productDetails().requirements.productClass = self.productDetails().productClassName;
        self.productDetails().requirements.productId = productId;
        self.productDetails().requirements.state = self.selectedState();
        if (self.productDetails().productType) {
          self.productDetails().requirements.productSubClass = self.productDetails().productType;
        }
        if (!self.productDetails().requirements.purpose) {
          self.productDetails().requirements.purpose = {};
          self.productDetails().requirements.purpose.code = "";
          self.productDetails().requirements.purposeType = "";
        }

        self.productDetails().requirements.facilityId = self.productDetails().facilityId;
        self.productDetails().requirements.productGroupSerialNumber = self.productGroupSerialNumber();
        RequirementsModel.submitRequirements(url, self.productDetails().submissionId.value, ko.toJSON(self.productDetails().requirements)).done(function() {
          self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion);
        });
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };
  };
});
