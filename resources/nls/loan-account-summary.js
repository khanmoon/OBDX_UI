define([
  "ojL10n!resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var orientationLocale = function() {
    return {
      root: {
        cardTitle: "Account Summary",
        interestOnlyTitle: "Interest Only Repayments",
        rateType: "Rate Type",
        term: "Term",
        frequency: "Frequency",
        approxRepaymentAmount: "Approx Repayment Amount",
        principleOnlyTitle: "Principal and Interest",
        frequencyList: {
          MONTHLY: "Monthly",
          M: "Monthly",
          DAILY: "Daily",
          WEEKLY: "Weekly",
          W: "Weekly",
          FORTNIGHTLY: "Fortnightly",
          BI_MONTHLY: "Bimonthly",
          QUARTERLY: "Quaterly",
          Q: "Quaterly",
          HALF_YEARLY: "Half Yearly",
          H: "Half Yearly",
          YEARLY: "Yearly",
          Y: "Yearly",
          MATURITY: "Maturity",
          ANNUAL: "Annual",
          NONE: "None",
          B: "Bullet"
        },
        tenure: "{years} year(s) {months} month(s)",
        messages: {},

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