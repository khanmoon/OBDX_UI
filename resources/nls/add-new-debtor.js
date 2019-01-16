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
          initiateScreenHeader: "Add Debtor",
          debtorName: "Debtor Name",
          debtorIban: "Debtor IBAN",
          accountName: "Account Name",
          bankBICCode: "Bank BIC Code",
          verify: "Verify",
          lookUpBIC: "Lookup Bank BIC Code",
          lookUpBICTitle: "Click to lookup for Bank BIC Code",
          nickname: "Nickname",
          or: "Or",
          bankAccount: "Bank Account",
          review: "Review",
          bicCode: "BIC Code",
          requestMoney: "Request Money",
          confirmAddDebtor: "Add Debtor",
          sepaDebtor: "SEPA Debtor",
          back: "Back",
          reviewHeaderMsg: "You initiated a request for adding a Debtor. Please review details before you confirm!"
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