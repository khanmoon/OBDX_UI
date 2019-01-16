define([
  "ojL10n!resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var depositRequirementsLocale = function() {
    return {
      root: {
        compName: "application-form",
        years: "Year(s)",
        months: "Month(s)",
        infoPrefilled: "We have pre-filled your existing information. (Click to View / Add)",
        continueInvalid: "Please enter information in unfilled sections.",
        continueInvalidAlert: "Please enter information in sections against which the icon <span class='icon-alert icon-error-message'></span> is displayed.",
        financialTemplate: {
          name: "Financial Profile {index}"
        },
        image: {
          primaryInformation: "Primary Information Logo",
          employmentInformation: "Employment Information Logo",
          proofOfIdentity: "Proof of Identity Logo",
          contactInformation: "Contact Information Logo",
          loanRequirements: "Loan Requirements Logo",
          income: "Income Logo",
          expenses: "Expenses Logo",
          assets: "Assets Logo",
          liabilities: "Liabilities Logo",
          vehicleInformation: "Vehicle Information Logo",
          featuresAndSpecifications: "Features and Specifications Logo",
          offers: "Offers Logo"
        },
        proceed: "Click to proceed",
        alt: {
          minimize: "Minimize",
          uploadDocumentLogo: "Upload Document Logo",
          uploadDocumentLink: "Click for Upload Document Page"
        },
        title: {
          minimize: "Minimize",
          uploadDocument: "Upload Documents"
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
  return new depositRequirementsLocale();
});
