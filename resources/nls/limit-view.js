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
          LimitId: "Limit Id",
          LimitType: "Limit Type",
          LimitName: "Limit Name",
          limitCode: "Limit Code",
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
          tranasctionName: "Delete Limit",
          perDay: "{attribute} Per Day",
          perMonth: "{attribute} Per Month",
          durationFormat: "{dd}dd \: {hh}hh \: {mm}mm",
          limitCurrency: "Currency",
          DAILY: "Daily",
          MONTHLY: "Monthly",
          deleteMessage: "Limit Deletion"
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
          infoHeader:"Limit Details",
          infoMessage:"You may delete the definitions, by clicking on Delete button. Ensure this definition is not in user before you proceed.You can choose to go back to the previous screen or cancel the operations."
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
