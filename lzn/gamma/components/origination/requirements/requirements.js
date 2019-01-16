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
  "ojs/ojdialog",
  "ojs/ojvalidationgroup"
], function(oj, ko, $, RequirementsModel, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this,
      i, url, getNewKoModel = function() {
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
    self.optionMonths = ko.observableArray([]);
    self.years = self.productDetails().maxTerm ? self.productDetails().maxTerm / 12 : 20;
    self.preferenceMode = ko.observableArray([]);
    self.productDetails().militaryDisclosures = ko.observableArray([]);
    self.disableContinue = ko.observable(false);
    self.requirementLoaded = ko.observable(false);
    self.downPaymentRequired = ko.observable("OPTION_NO");
    rootParams.baseModel.registerComponent("loan-tenure", "origination");
    for (i = 1; i <= 2; i++) {
      self.productDetails().militaryDisclosures.push({
        value: false,
        disclosure: self.resource["militaryDisclosure" + i]
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
    var purchasePrice = 0,
      downpaymentAmount = 0;
    self.getRequirementModel = function() {
      if (!self.productDetails().requirements) {
        self.productDetails().requirements = getNewKoModel().loanRequirement;
        if (self.productDetails().productClassName !== "CREDIT_CARD") {
          self.productDetails().requirements.noOfCoApplicants = "0";
        }
        if (self.productDetails().requirements.requestedAmount) {
          self.productDetails().requirements.requestedAmount.amount = ko.observable(ko.utils.unwrapObservable(self.productDetails().requirements.requestedAmount.amount));
        }
        if (self.productDetails().requirements.purchasePrice) {
          self.productDetails().requirements.purchasePrice.amount = ko.observable(ko.utils.unwrapObservable(self.productDetails().requirements.purchasePrice.amount));
        }
        if (self.productDetails().requirements.downpaymentAmount) {
          self.productDetails().requirements.downpaymentAmount.amount = ko.observable(ko.utils.unwrapObservable(self.productDetails().requirements.downpaymentAmount.amount));
        }
        if (self.productDetails().requirements.requestedTenure) {
          self.productDetails().requirements.requestedTenure.years = ko.observable(ko.utils.unwrapObservable(self.productDetails().requirements.requestedTenure.years));
          self.productDetails().requirements.requestedTenure.months = ko.observable(ko.utils.unwrapObservable(self.productDetails().requirements.requestedTenure.months));
        }
        self.productDetails().requirements.frequency = ko.observable(ko.utils.unwrapObservable(self.productDetails().requirements.frequency));
      } else {
        if (!self.productDetails().requirements.purchasePrice) {
          self.productDetails().requirements.purchasePrice = {};
          self.productDetails().requirements.purchasePrice.amount = ko.observable();
          self.productDetails().requirements.purchasePrice.currency = rootParams.baseModel.getLocaleValue("localCurrency");
        }
        if (!self.productDetails().requirements.downpaymentAmount) {
          self.productDetails().requirements.downpaymentAmount = {};
          self.productDetails().requirements.downpaymentAmount.amount = ko.observable();
          self.productDetails().requirements.downpaymentAmount.currency = rootParams.baseModel.getLocaleValue("localCurrency");
        }
        if (!self.productDetails().requirements.requestedAmount) {
          self.productDetails().requirements.requestedAmount = {};
          self.productDetails().requirements.requestedAmount.amount = ko.observable();
          self.productDetails().requirements.requestedAmount.currency = rootParams.baseModel.getLocaleValue("localCurrency");
        }
        if (!self.productDetails().requirements.requestedTenure) {
          self.productDetails().requirements.requestedTenure = {};
          self.productDetails().requirements.requestedTenure.years = ko.observable(0);
          self.productDetails().requirements.requestedTenure.months = ko.observable(0);
          self.productDetails().requirements.requestedTenure.days = 0;
        } else {
          self.productDetails().requirements.frequency = ko.observable("MONTHLY");
        }
      }
    };
    url = "submissions/{submissionId}/loanApplications";
    self.getRequirementModel();
    RequirementsModel.fetchRequirements(self.productDetails().submissionId.value).done(function(data) {
      if (self.checkEmpty(data.loanApplicationRequirementDTO)) {
        if (data.loanApplicationRequirementDTO.requestedAmount) {
          self.productDetails().requirements.requestedAmount.amount(data.loanApplicationRequirementDTO.requestedAmount.amount);
        }
        if (data.loanApplicationRequirementDTO.purchasePrice) {
          self.productDetails().requirements.purchasePrice.amount = ko.observable(data.loanApplicationRequirementDTO.purchasePrice.amount);
          purchasePrice = JSON.parse(JSON.stringify(self.productDetails().requirements.purchasePrice.amount()));
        }
        if (data.loanApplicationRequirementDTO.downpaymentAmount && data.loanApplicationRequirementDTO.downpaymentAmount.amount) {
          self.downPaymentRequired("OPTION_YES");
          self.productDetails().requirements.downpaymentAmount.amount = ko.observable(data.loanApplicationRequirementDTO.downpaymentAmount.amount);
          downpaymentAmount = JSON.parse(JSON.stringify(self.productDetails().requirements.downpaymentAmount.amount()));
        }
        if (data.loanApplicationRequirementDTO.requestedTenure) {
          self.productDetails().requirements.requestedTenure.years(JSON.stringify(data.loanApplicationRequirementDTO.requestedTenure.years));
          self.productDetails().requirements.requestedTenure.months(JSON.stringify(data.loanApplicationRequirementDTO.requestedTenure.months));
        }
      }
      self.requirementLoaded(true);
    });
    self.downPaymentRequiredChange = function(event) {
      if (event.detail.value === "OPTION_NO") {
        self.downPaymentRequired("OPTION_NO");
        self.productDetails().requirements.downpaymentAmount.amount(0);
        downpaymentAmount = 0;
        self.calculateLoanAmount();
      }
      if (event.detail.value === "OPTION_YES") {
        self.downPaymentRequired("OPTION_YES");
      }
    };
    $(document).off("focusout", "#purchase-price");
    $(document).on("focusout", "#purchase-price", function(event) {
      purchasePrice =Number(event.target.value.toString().replace(/[^\d.]/g, ""));
      self.calculateLoanAmount();
    });
    $(document).off("focusout", "#down-payment-amount");
    $(document).on("focusout", "#down-payment-amount", function(event) {
      downpaymentAmount = Number(event.target.value.toString().replace(/[^\d.]/g, ""));
      self.calculateLoanAmount();
    });
    self.calculateLoanAmount = function() {
      self.productDetails().requirements.requestedAmount.amount(parseInt(purchasePrice) - parseInt(downpaymentAmount));
      if (self.productDetails().requirements.requestedAmount.amount() <= 0) {
        $("#loanAmountError").show().trigger("openModal");
        self.disableContinue(true);
        self.productDetails().requirements.requestedAmount.amount(0);
      } else {
        self.disableContinue(false);
      }
    };
    self.productDetails().requirements.promoCode = "";
    self.productDetails().coappPreference = getNewKoModel().coappPreference;
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
    self.editRequirements = function() {
      self.setCurrentStage(-1);
    };
    self.submitRequirements = function() {
      var tracker = document.getElementById("requirements-tracker");
      if (tracker.valid === "valid") {


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
        RequirementsModel.submitRequirements(url, self.productDetails().submissionId.value, ko.mapping.toJSON(self.productDetails().requirements, {"ignore": ["selectedValues"]})).done(function() {
          self.completeApplicationStageSection(rootParams.applicantStages, rootParams.applicantAccordion);
        });

      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }

    };
    self.exitApplication = function() {
      $("#EXITAPPLICATION").show().trigger("openModal");
    };
  };
});
