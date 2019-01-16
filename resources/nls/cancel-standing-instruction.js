define([
  "ojL10n!resources/nls/messages-payments",
  "ojL10n!resources/nls/generic",
  "ojL10n!resources/nls/payments-common"
], function(Messages, Generic, Common) {
  "use strict";
  var TransactionLocale = function() {
    return {
      root: {
        payments: {
          standinginstructions: {
            canceltransfer: "Cancel Transfer",
            cancelsimessage: "Are you sure you want to cancel this transfer?",
            transferTo: "Transfer to",
            amount: "Amount",
            repeat: "Repeat",
            verifyCancelSI: "Cancel Instruction",
            payeeName: "Payee Name",
            accountType: "Account Type",
            accountNumber: "Account Number",
            transferWhen: "Transfer When",
            yes:"Yes",
            no:"No"

          }
        },
        common: Common.payments.common,
        messages: Messages,
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
  return new TransactionLocale();
});