define([], function() {
  "use strict";
  var ReviewBillPayment = function() {
    return {
      root: {
        limit: {
          noviewlimits: "No Limits Found",
          maximum: "Max Amount : ",
          minimum: "Min Amount : ",
          min: "Min",
          max: "Max",
          available: "Available",
          dailytransferlimit: "Daily Transfer Limit",
          monthlytransferlimit: "Monthly Transfer Limit",
          dailyCounts: "Daily Count",
          dailyLimits: "Daily Limit",
          monthlyCounts: "Monthly Count",
          monthlyLimits: "Monthly Limit",
          initiationlimitpertransaction: "Transaction Limit",
          payeeLimit: "Payee Limit",
          total: "Total",
          utilized: "Utilized",
          notUtilized: "Not Utilized",
          total_amount: "Total - {totalamount}",
          total_count: "Total",
          remaining: "Remaining",
          available_amount: "Utilized - {amount}",
          available_count: "Utilized",
          msg: "Some message w.r.t limits",
          knowMoreInfo : "Access ‘Limits’ from menu to identify the channel specific transaction limits.",
          knowMore: "Know More"
        }
      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
      "en-us": false,
      el: false
    };
  };
  return new ReviewBillPayment();
});
