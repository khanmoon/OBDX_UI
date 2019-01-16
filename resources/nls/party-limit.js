define([
  "ojL10n!resources/nls/generic"
], function(Activity, Generic) {
  "use strict";
  var LimitsLocale = function() {
    return {
      root: {
        pageTitle: {
          loans: "User Limit"
        },
        limitsInquiry: {
          header: {
            dailyLimits: "Daily Limits"
          },
          buttons: {
            back: "Back",
            ok: "Ok"
          },
          messages: {

            header_title: "User Limit",
            analysis_title: "User Limit",
            minimum_amount: "Min Amount - {minTran}",
            maximum_amount: "Max Amount - {maxTran}",
            total_amount: "Total - {totalamount}",
            total_count: "Total - {totalcount}",
            available_amount: "Available - {amount}",
            available_count: "Available - {count}",
            countUtilizationStatus: "Count Utilization Status",
            amountUtilizationStatus: "Amount Utilization Status",
            transaction_undefined: "NA",
            duration_undefined: "NA",
            count: "Count",
            amount: "Amount",
            initiationlimit: "Initiation Limit",
            approvallimit: "Approval Limit",
            transaction: "Transaction",
            detail: "Limit Inquiry"

          }

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
  return new LimitsLocale();
});