define([], function() {
  "use strict";
  var TenureLocale = function() {

    return {
      root: {
        tenure_year: "Tenure Years",
        tenure_year_placeholder: "Tenure in Years",
        tenure_month: "Tenure Months",
        tenure_month_placeholder: "Tenure in Months",
        invalidTenure: "Please specify Loan Tenure"
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
  return new TenureLocale();
});