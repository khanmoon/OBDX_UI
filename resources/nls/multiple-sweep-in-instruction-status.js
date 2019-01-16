define([], function() {
  "use strict";
  var MultipleSweepInInstructionStatusLocale = function() {
    return {
      root: {
        header: "Multiple Sweep-in Instruction Status",
        headerSmall: "Status",
        label: {
          accountNo: "Account Number",
          partyName: "Primary Holder Name",
          status: "Status",
          failureReason: "Failure Reason",
          caption: "Multiple Sweep-in Instruction Status Table",
          na: "NA",
          hostRefNo: "Host Reference Number"
        },
        action: {
          backToDashboard: "Back to Dashboard",
          eReceipt: "e-Receipt",
          downloadAllEreceipts: "Download all e-Receipts"
        },
        status: {
          200: "Completed",
          202: "Initiated",
          error: "Failed"
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
  return new MultipleSweepInInstructionStatusLocale();
});
