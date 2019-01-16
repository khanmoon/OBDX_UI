define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var TransactionSummaryReportLocale = function() {
    return {
      root: {
        transactionSummary: {
          dateFrom: "From",
          dateTo: "To",
          accountBranch: "Account Number",
          select: "Select",
          duration: "Duration",
          variable: "{Account}~{Branch}",
          noAccount: "No Current or Saving Account(s) available"

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
  return new TransactionSummaryReportLocale();
});