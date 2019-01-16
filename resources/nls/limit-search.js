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

          limitDescription: "Limit Description",
          LastUpdatedOn: "Updated On",
          maxAmount: "Maximum Amount",
          minAmount: "Minimum Amount",
          maxTransactions: "Maximum Transactions",
          limitSearch: "Search Result of limit",
          fromDate: "From Date",
          toDate: "To Date",
          updationDate:"Updation Date"
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
          infoHeader:"Limit Definition",
          infoMessage:"Transaction limits can be defined to set up amount and duration based restrictions on transactions that can be carried out by the customers.This maintenance allows you to search and view limit definitions. Also you can create new and delete existing limit definitions.Search limit definitions based on different search parameters and the matching result will be listed."
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
