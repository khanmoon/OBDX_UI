define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var ReviewDomesticPayee = function() {
    return {
      root: {
        domesticPayee: {
          header: "Domestic Payee Details",
          recipientname: "Payee Name",
          accountnumber: "Account Number",
          accountName: "Account Name",
          accounttype: "Account Type",
          payvia: "Pay Via",
          ifsc: "IFSC Code",
          accountnickname: "Nickname",
          sortcode: "Sort Code",
          swiftcode: "SWIFT Code",
          sepaRecipientaccnumber: "Account Number (IBAN)",
          bankcodebic: "Bank Code (BIC)",
          debtorbankcode: "Debtor Bank Code (BIC)",
          accdomestic: "Domestic",
          payeeaccesstype: "Access Type"
        },
        generic: Generic
      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
      "en-us": false,
      el: false
    };
  };
  return new ReviewDomesticPayee();
});