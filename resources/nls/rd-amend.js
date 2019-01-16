define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var amendRD = function() {
    return {
      root: {
        header: {
          amend: "Edit Maturity Instruction"
        },
          accountNumber: "Account Number",
          rollOverType: {
            "A": "Close on Maturity"
          },
          maturityInstruction: "Maturity Instruction",
          creditAccountNum: "Principal & Interest Credit Account Number",
          payTo: "Pay To",
          accountName: "Account Name",
          bankCode: "Bank Code",
          or: "or",
          lookUpBankCode: "Look Up Bank Code",
          pleaseSelect: "Please Select",
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
  return new amendRD();
});
