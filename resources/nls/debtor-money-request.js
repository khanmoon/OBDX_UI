define([
  "ojL10n!resources/nls/messages-payments",
  "ojL10n!resources/nls/generic",
  "ojL10n!resources/nls/payments-common"
], function(Messages, Generic, Common) {
  "use strict";
  var TransactionLocale = function() {
    return {
      root: {
        debtors: {
          review: "Review",
          sucessfull: "Successful!",
          requstFrom: "Request From",
          amount: "Amount",
          requestIn: "Request In",
          noteOpt: "Note (Optional)",
          note: "Note (Optional)",
          addDebtor: "Add Debtor",
          request: "Request",
          requestMoney: "Request Money",
          receivedOn: "Receive On",
          invalidError: "Invalid bank code",
          selectDebtorNumber: "Select debtor number",
          refresh: "Refresh",
          refreshTitle: "Click to refresh",
          confirmRequest: "Request Money",
          reviewHeaderMsg: "You initiated a request money transaction. Please review details before you confirm!"
        },
        messages: Messages,
        generic: Generic,
        common: Common.payments.common
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