define(["ojL10n!resources/nls/messages-payments"], function(Messages) {
  "use strict";
  var TransactionLocale = function() {
    return {
      root: {
        merchant: {

        },
        dummyMerchant: {
          merchantcode: "Merchant Code",
          succStatUrlFlag: "Success static Url Flag",
          failStatUrlFlag: "Failure Static Url Flag",
          txnDate: "Transaction Date",
          accnoflag: "Account Number In Request",
          accnumber: "User Account Number",
          merchantrefno: "Merchant Reference Number",
          checksum: "Checksum Value",
          txnamount: "Transaction Amount",
          txnCurrency: "Transaction Currency",
          submit: "Submit",
          servicecharges: "Service Charges",
          additionalDetail1: "Additional Detail1",
          additionalDetail2: "Additional Detail2",
          additionalDetail3: "Additional Detail3"
        },
        messages: Messages
      }
    };
  };
  return new TransactionLocale();
});