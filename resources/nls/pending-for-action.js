define([], function () {
  "use strict";
  var PendingForActionLocale = function () {
    return {
      root: {
        header: "Pending For Action",
        gracePeriod: "Grace Period",
        financialTxn: "Financial",
        nonFinancialTxn: "Non-Financial",
        ACCOUNT_FINANCIAL: "Accounts",
        ACCOUNT_NON_FINANCIAL: "Accounts",
        ADMIN_MAINTENANCE: "Admin Maintenance",
        BULK_FILE: "Bulk File",
        BULK_RECORD: "Bulk Record",
        NON_FINANCIAL_BULK_FILE: "Bulk File",
        NON_FINANCIAL_BULK_RECORD: "Bulk Record",
        PAYEE_BILLER: "Payee and Biller",
        PAYMENTS: "Payments",
        TRADE_FINANCE: "Trade Finance",
        OTHER_TRANSACTION: "Others",
        dropDown: "Select the type of transaction",
        tooltip: {
          series: "Series : {series}",
          value: "Value : {value}"
        },
        noData: "No actions pending"
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
  return new PendingForActionLocale();
});
