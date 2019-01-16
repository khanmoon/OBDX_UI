define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var externalPaymentReportLocale = function() {
    return {
      root: {
        externalPaymentReport: {

          merchantCode: "Merchant Code",
          duration: "Duration",
          select: "Select",
          notFound: "No Matches Found",
          dateTo: "Date To"

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
  return new externalPaymentReportLocale();
});