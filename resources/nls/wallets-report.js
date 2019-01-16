define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var WalletReportLocale = function() {
    return {
      root: {
        wallets: {
          emailId: "Email Id",
          mobileNo: "Mobile Number",
          dateFrom: "From",
          dateTo: "To",
          kycStatus: "KYC Status",
          txnType: "Transaction Type",
          select: "Select",
          duration: "Duration"
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
  return new WalletReportLocale();
});