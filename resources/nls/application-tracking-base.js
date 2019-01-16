define([
  "ojL10n!resources/nls/origination-generic",
  "ojL10n!resources/nls/accordion-names"
], function(Generic, AccordionNames) {
  "use strict";
  var applicationTrackingBaseLocale = function() {
    return {
      root: {
        processing: "Processing",
        myApplications: "My Applications",
        landingtext: "Track your Application",
        amountTenure: "{productGroup} <span class='{class1}'> of amount <span class='{class2}'>{amount}</span> for tenure <span class='{class2}'>{years} year(s)</span></span>",
        CASA: "Savings",
        TERM_DEPOSITS: "Term Deposits",
        LOANS: "Loans",
        CREDIT_CARD: "Credit Cards",
        productGroupsHeader: {
          productGroupsHeaderSavings: "Explore our Savings products",
          productGroupsHeaderCheckings: "Explore our Checkings products",
          productGroupsHeaderCD: "Explore our Term Deposits products",
          productGroupsHeaderCC: "Explore our Credit Cards products",
          productGroupsHeaderSPL: "Explore our Auto Loans products",
          productGroupsHeaderUPL: "Explore our Personal Loans products"
        },
        generic: Generic,
        accordionNames: AccordionNames

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
  return new applicationTrackingBaseLocale();
});