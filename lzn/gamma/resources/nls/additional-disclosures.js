define([
  "ojL10n!lzn/gamma/resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var customizeCardLocale = function() {
    return {
      root: {
        privacyLoanConsent: "I acknowledge that I have reviewed and agree to the Product Legal Documents and the Privacy Policy Notice",
        agreeLoanConsent: "By clicking submit I agree that :",
        agreeLoanConsent1: "All the information I have submitted in the application, is to the best of my knowledge, true and correct.",
        agreeLoanConsent2: "I am the person named in the application and I have obtained approval from my co-applicant to submit his/her information.",
        agreeLoanConsent3: "If I am applying with a co-applicant, we will be held jointly liable for the requested credit amount.",
        agreeLoanConsent4: "I authorize Model Bank to obtain a credit report or any other report or account information from credit or information services agencies to help verify the information provided in this application",
        agreeLoanConsent5: "Model Bank may ask for documents to verify the identity of some or all applicants.",
        agreeLoanConsent6: "This application and supporting documents remain the property of Model Bank.",
        agreeLoanConsent7: "All loan applications are subject to normal credit qualification and Model Bank is not obligated to approve my application.",
        agreeLoanConsent8: "Credit approval, Annual Percentage Rate (APR) and credit terms are based on the review of each applicant’s information and credit report.",
        generic: Generic

      },
      "ar": true,
      "fr": true,
      "cs": true,
      "sv": true,
      "en": false,
      "en-us": false,
      "el": true
    };
  };
  return new customizeCardLocale();
});