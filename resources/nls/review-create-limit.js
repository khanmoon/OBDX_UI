define([
  "ojL10n!resources/nls/messages",
  "ojL10n!resources/nls/generic",
  "ojL10n!resources/nls/financial-limits-common"
], function(Messages, Generic, Limits_common) {
  "use strict";
  var OriginationLocale = function() {
    return {
      root: {
        limit: {

          limitCode: "Limit Code",
          LimitType: "Limit Type",
          LimitName: "Limit Name",
          limitDescription: "Limit Description",
          frequency: "Frequency",
          maxAmount: "Maximum Amount",
          minAmount: "Minimum Amount",
          cummuTrnsAmnt: "Cumulative Transaction Amount",
          maxTransactions: "Maximum Transactions",
          fromTime: "From Time",
          toTime: "To Time",
          cumuAmount: "Cumulative Transaction Amount",
          colon: ":",
          transactionId: "Transaction Id",
          dd: "dd",
          mm: "mm",
          hh: "hh",
          perDay: "{attribute} Per Day",
          perMonth: "{attribute} Per Month",
          durationFormat: "{dd}dd \: {hh}hh \: {mm}mm",
          limitCurrency: "Currency",
          transactionTable: "Transaction Table",
          DAILY: "Daily",
          MONTHLY: "Monthly"
        },
        transactionName: {
          transaction: "Transaction Limit",
          cummulative: "Cumulative Limit",
          duration: "Cooling Period Limit"
        },
        limitType: {
          transaction: "Transaction",
          cummulative: "Cumulative",
          coolingPeriod: "Cooling Period",
          periodic: "Periodic",
          durational: "Durational"
        },
        common: Limits_common,
        messages: Messages,
        generic: Generic,
        info: {
          noData: "No data to display."
        },
        navLabels: {
          LimitGroup: "Limit Group",
          Events: "Events",
          Limits: "Limits",
          Service: "Service"
        }
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
  return new OriginationLocale();
});
