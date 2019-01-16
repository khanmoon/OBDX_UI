define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var RecordListNonFinancialLocale = function() {
    return {
      root: {
        recordListNonFinancial: {
          recordList: "Record List",
          payeeType: "Payee Type",
          accountType: "Account Type",
          accountName: "Account Name",
          selectPayeeType: "Select Payee Type",
          selectAccountType: "Select Account Type",
          payeeName: "Payee Name",
          recordViewErrorMsg: "Please provide search inputs.",
          cancel: "Cancel",
          clear: "Clear",
          search: "Search",
          noData: "No data to display. Please modify your search inputs.",
          rStatus: "Record Status",
          selectRStatus: "Select Record Status",
          details: "Non-Financial Accounts Record List",
          searchEnable: "Enable Search",
          searchEnableText: "Click to Enable Search",
          viewlist: "View List",
          viewlistText: "Click to View List",
          internal: "Internal",
          domestic: "Domestic",
          international: "International",
          bankAccount: "Bank Account",
          demandDraft: "Demand Draft"
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
  return new RecordListNonFinancialLocale();
});