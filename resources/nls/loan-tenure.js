define([
  "ojL10n!resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var loanTenureLocale = function() {
    return {
      root: {
        tenure_year: "Years",
        tenure_month: "Months",
        tenure_day:"Days",
        messages: {
          months: "Please select no of month(s)",
          years: "Please select no of year(s)",
          month: "Please select a month",
          year: "Please select a year",
          loanTenure: "Please specify Loan Tenure",
          days: "Please select no of day(s)"
        },
        loanTerm: "Loan Term",
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
  return new loanTenureLocale();
});