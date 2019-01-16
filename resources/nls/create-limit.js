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

          LimitType: "Limit Type",
          LimitName: "Limit Name",

          limitCode: "Limit Code",
          frequency: "Frequency",
          daily: "Daily",
          monthly: "Monthly",

          limitDescription: "Limit Description",
          maxAmount: "Maximum Amount",
          minAmount: "Minimum Amount",
          cummuTrnsAmnt: "Cumulative Transaction Amount",
          maxTransactions: "Maximum Transactions",
          duration: "Duration",
          fromTime: "From Time",
          toTime: "To Time",
          cumuAmount: "Cumulative Transaction Amount",
          colon: ":",
          createLimitTransaction: "Create Limit",
          timePeriod: "Add Time Period",
          dd: "dd",
          mm: "mm",
          hh: "hh",
          days: "Days",
          hours: "Hours",
          minutes: "Minutes",
          durationFormat: "{dd}dd \: {hh}hh \: {mm}mm",
          perDay: "Per Day",
          perMonth: "Per Month",
          limitCurrency: "Currency",
          selectCurrency: "Select Currency",
          countValidationMessage: "Please enter valid count",
          amountErrorMsg: "Amount Error",
          timeError: "Time Error",
          transactionTable: "Transaction Table",
          amount: "Amount"
        },
        limitType: {
          transaction: "Transaction",
          cummulative: "Cumulative",
          coolingPeriod: "Cooling Period"
        },
        common: Limits_common,
        messages: Messages,
        generic: Generic,
        info: {
          noData: "No data to display.",
          infoHeader:"Create Limit Definition",
          infoMessage:"You can define following types of limits on the transactions<br>-	Transaction – Minimum and maximum transaction initiation limit.<br>-	Cumulative -  Collective amount of a transaction and total number of transaction limit.<br>-	Cooling Period – Limits for newly added payees.<br>Map these limit definitions to a transaction as a part of limit package."
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
