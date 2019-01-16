define([
  "ojL10n!resources/nls/messages-payments",
  "ojL10n!resources/nls/generic"
], function(Messages, Generic) {
  "use strict";
  var TransactionLocale = function() {
    return {
      root: {
        payments: {
          transferMode: "Transfer Mode",
          select: "Select",
          addNewrecipientmsg: "You will first add the bank account details of the recipient and then continue to transfer",
          addbankaccount: "Add Bank Account",
          email: "Email",
          mobile: "Mobile",
          bankAccount: "Bank Account"

        },
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