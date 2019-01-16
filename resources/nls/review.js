define([
  "ojL10n!resources/nls/origination-generic"

], function(Generic) {
  "use strict";
  var orientationLocale = function() {
    return {
      root: {
        review:"Review",
        info: "Please review your application thoroughly before submitting",
        coApplicant: "Co-Applicant Details",
        beforesubmit: "Please review your information before submitting your application.",
        applnSummary: "Application Summary",
        primaryInfo: "Primary Information",
        countryOfCitizenship: "Country of Citizenship",
        countryOfResidence: "Country of Residence",
        identityInfoTitle: "Proof of Identity",
        contactInfoTitle: "Contact Information",
        employment: "Employment Information",
        ddaAccountDetails: "Savings Account Details",
        primaryOccupation: "Primary Employment",
        noCustomizationAdded: "No customizations made.",
        additionalOccupation: "Additional Employment",
        financialDetailsTitle: "Financial Details {index}",
        specifications: "Features & Specifications",
        accountFundingtitle: "Account Funding",
        customizeYourCard: "Customize your Card",
        depositDetailsTitle: "Deposit Details",
        collateralDetailsTitle: "Collateral Details",
        noInfo: "There is no information added in this section",
        editPersonalPrimaryInfoClick: "Person Primary information",
        editPersonalPrimaryInfoClickTitle: "Click to edit Person Primary information",
        editPersonalDetailsClick: "Edit Personal Information",
        editPersonalFundingTable: "Edit personal funding table click",
        editPersonClick: "Edit person detail",
        editInfoClick: "Edit person Information",
        editPersonInfoClick: "Edited personal Info",
        editPersonOccupationInfoClick: "Edit Personal Occupation Infomation",
        editPersonalAccountHolderClick: "Edit Personal Account Holder",
        editPersonalAccountFundingClick: "Edit personal Account Funding",
        editFinancialDetailsIncome: "Edit Financial data",
        editFinancialExpenseClick: "Edit Financial Expense",
        editFinancialAssetClick: "Edit Financial Asset",
        editFinancialLiabilityClick: "Edit Financial Liability",
        editFinancialCurrentLiabilityClick: "Edit Financial Current Liability",
        editCollateralOfferClick: "Edit Collateral Offer",
        editCardDetailsCardPreferences: "Edit Card Details",

        offers: {
          title: "Offers",
          applicationFees: "Application Fees",
          interestRate: "Interest Rate",
          offerName: "Offer Name",
          features: "Features"
        },
        generic: Generic
      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
      "en-us": false,
      el: true
    };
  };
  return new orientationLocale();
});
