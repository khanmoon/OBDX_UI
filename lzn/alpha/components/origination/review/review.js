define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "ojL10n!lzn/alpha/resources/nls/review",
  "ojL10n!lzn/alpha/resources/nls/review-accessibility",
  "ojs/ojcheckboxset",
  "ojs/ojbutton"
], function(oj, ko, $, ReviewServiceObject, resourceBundle, accessibilityResource) {
  "use strict";
  return function(rootParams) {
    var self = this,
      ReviewService = new ReviewServiceObject();
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.accessibilityResource = accessibilityResource;
    self.reviewDataLoaded = ko.observable(false);
    require([
      "ojL10n!lzn/alpha/resources/nls/requirements",
      "ojL10n!lzn/alpha/resources/nls/primary-registration",
      "ojL10n!lzn/alpha/resources/nls/identity-info",
      "ojL10n!lzn/alpha/resources/nls/contact-info",
      "ojL10n!lzn/alpha/resources/nls/occupation-info",
      "ojL10n!lzn/alpha/resources/nls/income-info",
      "ojL10n!lzn/alpha/resources/nls/expense-info",
      "ojL10n!lzn/alpha/resources/nls/assets-info",
      "ojL10n!lzn/alpha/resources/nls/liabilities-info",
      "ojL10n!lzn/alpha/resources/nls/collateral-info",
      "ojL10n!lzn/alpha/resources/nls/account-funding",
      "ojL10n!lzn/alpha/resources/nls/account-holder",
      "ojL10n!lzn/alpha/resources/nls/funding-table",
      "ojL10n!lzn/alpha/resources/nls/property-info",
      "ojL10n!lzn/alpha/resources/nls/vehicle-info",
      "ojL10n!lzn/alpha/resources/nls/loan-account-configuration",
      "ojL10n!lzn/alpha/resources/nls/loan-account-summary",
      "ojL10n!lzn/alpha/resources/nls/loan-account-preference",
      "ojL10n!lzn/alpha/resources/nls/card-addon",
      "ojL10n!lzn/alpha/resources/nls/card-balance-transfer",
      "ojL10n!lzn/alpha/resources/nls/anti-money-laundering"
    ], function(Requirements, PrimaryRegistration, IdentityInfo, ContactInfo, OccupationInfo, IncomeInfo, ExpenseInfo, AssetsInfo, LiabilitiesInfo, CollateralInfo, AccountFunding, AccountHolder, FundingTable, PropertyInfo, VehicleInfo, LoanAccountConfigurationInfo, LoanAccountSummaryInfo, LoanAccountPreference, CardAddon, CardBalanceTransfer, AntiMoneyLaundering) {
      self.resource.requirements = Requirements;
      self.resource.primaryRegistration = PrimaryRegistration;
      self.resource.propertyInfo = PropertyInfo;
      self.resource.fundingTable = FundingTable;
      self.resource.identityInfo = IdentityInfo;
      self.resource.contactInfo = ContactInfo;
      self.resource.occupationInfo = OccupationInfo;
      self.resource.accountHolder = AccountHolder;
      self.resource.accountFunding = AccountFunding;
      self.resource.incomeInfo = IncomeInfo;
      self.resource.expenseInfo = ExpenseInfo;
      self.resource.assetsInfo = AssetsInfo;
      self.resource.liabilitiesInfo = LiabilitiesInfo;
      self.resource.collateralInfo = CollateralInfo;
      self.resource.loanAccountConfigurationInfo = LoanAccountConfigurationInfo;
      self.resource.loanAccountPreference = LoanAccountPreference;
      self.resource.loanAccountSummaryInfo = LoanAccountSummaryInfo;
      self.resource.addOnCard = CardAddon;
      self.resource.cardBalanceTransfer = CardBalanceTransfer;
      self.resource.vehicleInfo = VehicleInfo;
      self.resource.antiMoneyLaundering = AntiMoneyLaundering;
      self.reviewDataLoaded(true);
    });
    self.productHeadingName(self.resource.review);
    self.offersLoadedInReview = ko.observable(false);
    self.countryOptions = ko.observable([]);
    self.stateOptions = ko.observable([]);
    self.selectedState = ko.observable();
    self.selectedCountry = ko.observable();
    self.selectedlandlordCountry = ko.observable();
    self.selectedlandlordState = ko.observable();
    self.selectedPreviousCountry = ko.observable();
    self.selectedPreviousState = ko.observable();
    self.selectedlandlordPreviousCountry = ko.observable();
    self.selectedlandlordPreviousState = ko.observable();
    self.reviewTransactionName = {
      header: self.resource.review,
      reviewHeader: self.resource.beforesubmit
    };
    self.applicantObject = rootParams.applicantObject;
    self.stateLoaded = ko.observable(false);
    self.productDetails().applicationId = {
      value: "",
      displayValue: ""
    };
    self.getFilmstripLabel = function(index, applicantIndex) {
      if (self.applicantDetails().length > 1) {
        return rootParams.baseModel.format(self.accordionNames.accordionNames.financialDetailsReview, {
          index: self.applicantDetails()[applicantIndex].financialProfile.length > 1 ? index + 1 : "",
          applicantName: rootParams.baseModel.format(self.resource.generic.common.name, {
            firstName: self.applicantDetails()[applicantIndex].primaryInfo.primaryInfo.firstName(),
            lastName: self.applicantDetails()[applicantIndex].primaryInfo.primaryInfo.lastName()
          })
        });
      }
      return rootParams.baseModel.format(self.accordionNames.accordionNames.financialTemplate.name, {
        index: self.applicantDetails()[applicantIndex].financialProfile.length > 1 ? index + 1 : "",
        applicantName: ""
      });

    };
    self.getAccordionLabel = function(key, applicantIndex) {
      if (self.applicantDetails().length > 1) {
        return rootParams.baseModel.format(self.accordionNames.accordionNames[key], {
          applicant: rootParams.baseModel.format(self.accordionNames.accordionNames.applicantName, {
            name: rootParams.baseModel.format(self.resource.generic.common.name, {
              firstName: self.applicantDetails()[applicantIndex].primaryInfo.primaryInfo.firstName(),
              lastName: self.applicantDetails()[applicantIndex].primaryInfo.primaryInfo.lastName()
            })
          })
        });
      }
      return rootParams.baseModel.format(self.accordionNames.accordionNames[key], {
        applicant: ""
      });

    };
    self.editRequirementDetails = function() {
      self.productDetails().sectionBeingEdited("requirements");
      self.setCurrentStage("requirements");
    };
    self.editInsuranceDetails = function() {
      self.productDetails().sectionBeingEdited("application-insurance-input");
      self.setCurrentStage("application-insurance-input");
    };
    self.editPersonalDetails = function(data) {
      self.productDetails().sectionBeingEdited(data);
      for (var i = 0; i < self.productDetails().productStages.length; i++) {
        if (self.productDetails().productStages[i].id === "application-form") {
          self.productDetails().currentStage = self.productDetails().productStages[i];
          self.productDetails().application().currentApplicationStage = self.productDetails().application().stages()[0];
          self.productDetails().productApplicationComponentName(self.productDetails().application().currentApplicationStage.id);
          self.setCurrentStage(0);
          break;
        }
      }
    };
    self.editFinancialDetails = function(data) {
      self.productDetails().sectionBeingEdited(data);
      for (var i = 0; i < self.productDetails().productStages.length; i++) {
        if (self.productDetails().productStages[i].id === "application-form") {
          self.productDetails().currentStage = self.productDetails().productStages[i];
          self.productDetails().application().currentApplicationStage = self.productDetails().application().stages()[1].applicantStages[0];
          self.productDetails().productApplicationComponentName(self.productDetails().application().stages()[1].id);
          self.setCurrentStage(0);
          break;
        }
      }
    };
    self.editCardDetails = function(data) {
      self.productDetails().sectionBeingEdited(data);
      self.productDetails().productApplicationComponentName(data);
      self.setCurrentStage(-1);
    };
    self.editCollateralDetails = function(data) {
      self.productDetails().sectionBeingEdited(data);
      self.productDetails().productApplicationComponentName(data);
      self.setCurrentStage(-1);
    };
    self.getIndex = function(obj, key) {
      for (var i = 0; i < obj.length; i++) {
        if (obj[i].fundingItemType === key) {
          return i;
        }
      }
    };
    self.getStageIndex = function(obj, key) {
      for (var i = 0; i < obj.length; i++) {
        if (obj[i].stageName === key) {
          return i;
        }
      }
    };
    self.successHandlerCountry = function(data) {
      self.countryOptions(data.enumRepresentations[0].data);
      self.selectedCountry(rootParams.baseModel.getDescriptionFromCode(self.countryOptions(), self.applicantDetails()[0].contactInfo.contactInfo.address.postalAddress.country));
      if (self.applicantDetails()[0].contactInfo.contactInfo.address.landlordAddress) {
        self.selectedlandlordCountry(rootParams.baseModel.getDescriptionFromCode(self.countryOptions(), self.applicantDetails()[0].contactInfo.contactInfo.address.landlordAddress.country));
      }
      if (self.applicantDetails()[0].previousContactInfo) {
        self.selectedPreviousCountry(rootParams.baseModel.getDescriptionFromCode(self.countryOptions(), self.applicantDetails()[0].previousContactInfo.contactInfo.address.postalAddress.country));
        if (self.applicantDetails()[0].previousContactInfo.contactInfo.address.landlordAddress) {
          self.selectedlandlordPreviousCountry(rootParams.baseModel.getDescriptionFromCode(self.countryOptions(), self.applicantDetails()[0].previousContactInfo.contactInfo.address.landlordAddress.country));
        }
      }
      if (self.productDetails().requirements.propertyDetails) {
        self.productDetails().requirements.selectedValues.selectedCountry = rootParams.baseModel.getDescriptionFromCode(self.countryOptions(), self.productDetails().requirements.propertyDetails.address.country);
        ReviewService.fetchStates(self.productDetails().requirements.propertyDetails.address.country, self.successHandlerStatePropertyInfo);
      }
      ReviewService.fetchStates(self.applicantDetails()[0].contactInfo.contactInfo.address.postalAddress.country, self.successHandlerState);
    };
    self.successHandlerState = function(data) {
      self.stateOptions(data.enumRepresentations[0].data);
      self.selectedState(rootParams.baseModel.getDescriptionFromCode(self.stateOptions(), self.applicantDetails()[0].contactInfo.contactInfo.address.postalAddress.state));
      if (self.applicantDetails()[0].contactInfo.contactInfo.address.landlordAddress) {
        self.selectedlandlordState(rootParams.baseModel.getDescriptionFromCode(self.stateOptions(), self.applicantDetails()[0].contactInfo.contactInfo.address.landlordAddress.state));
      }
      if (self.applicantDetails()[0].previousContactInfo) {
        self.selectedPreviousState(rootParams.baseModel.getDescriptionFromCode(self.stateOptions(), self.applicantDetails()[0].previousContactInfo.contactInfo.address.postalAddress.state));
        if (self.applicantDetails()[0].previousContactInfo.contactInfo.address.landlordAddress) {
          self.selectedlandlordPreviousState(rootParams.baseModel.getDescriptionFromCode(self.stateOptions(), self.applicantDetails()[0].previousContactInfo.contactInfo.address.landlordAddress.state));
        }
      }
    };
    self.successHandlerStatePropertyInfo = function(data) {
      self.stateOptions(data.enumRepresentations[0].data);
      self.productDetails().requirements.selectedValues.selectedState = rootParams.baseModel.getDescriptionFromCode(self.stateOptions(), self.productDetails().requirements.propertyDetails.address.state);
      self.stateLoaded(true);
    };
    ReviewService.fetchCountryList(self.successHandlerCountry);
    self.fetchOfferHandler = function(data) {
      var offers = {
        offerId: data.offerDetails[0].offerId,
        applicationFees: data.offerDetails[0].applicationFees,
        interestRate: data.offerDetails[0].interestRate
      };
      self.productDetails().offers = offers;
      self.offersLoadedInReview(true);
    };
    if (!self.productDetails().offers) {
      if (!self.productDetails().requirements.productGroupSerialNumber) {
        self.productDetails().requirements.productGroupSerialNumber = self.productGroupSerialNumber();
      }
      ReviewService.getSelectedOffer(self.productDetails().submissionId.value, self.productDetails().requirements.productGroupSerialNumber, self.fetchOfferHandler);
    } else {
      self.offersLoadedInReview(true);
    }
    self.submitApplicationSuccessHandler = function(data) {
      self.isSubmitSubmissionRequested(false);
      if (data.applicationDetailsDTO && data.applicationDetailsDTO[0]) {
        if (data.applicationDetailsDTO[0].accountId && data.applicationDetailsDTO[0].accountId.value) {
          self.accountId(data.applicationDetailsDTO[0].accountId.displayValue);
        }
        if (data.applicationDetailsDTO[0].applicationId && data.applicationDetailsDTO[0].applicationId.value) {
          self.appRefNo(data.applicationDetailsDTO[0].applicationId.displayValue);
          self.productDetails().applicationId.value = data.applicationDetailsDTO[0].applicationId.value;
          self.productDetails().applicationId.displayValue = data.applicationDetailsDTO[0].applicationId.displayValue;
        }
        self.getNextStage();
      }
    };
    self.downloadCardImage = function(documentContentRefId, applicantId) {
      ReviewService.fetchDocumentsByteArray(documentContentRefId, applicantId);
    };
    self.getApplications = function() {
      ReviewService.getApplications(self.productDetails().submissionId.value, self.getApplicationsSuccessHandler);
    };
    self.getApplicationsSuccessHandler = function(data) {
      if (data.applications[0].applicationId.value) {
        self.appRefNo(data.applications[0].applicationId.displayValue);
        self.getNextStage();
      }
    };
    self.getAccountId = function(appId) {
      ReviewService.getAccountId(self.productDetails().submissionId.value, appId, self.getAccountIdSuccessHandler);
    };
    self.getAccountIdSuccessHandler = function(data) {
      self.accountId(data.demandDepositSummaryResponse.accountId);
      self.getNextStage();
    };
    self.fetchRegistrationRequiredSuccessHandler = function(data) {
      self.registrationCompulsory(data.registrationRequired);
      if (self.registrationCompulsory()) {
        self.showPluginComponent("user-creation");
      } else {
        ReviewService.submitApplication(self.productDetails().submissionId.value, self.submitApplicationSuccessHandler);
      }
    };
    self.submitApplication = function() {
      self.isSubmitSubmissionRequested(true);
      ReviewService.fetchRegistrationRequired(self.productDetails().submissionId.value, self.fetchRegistrationRequiredSuccessHandler);
    };
  };
});
