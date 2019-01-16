define(
  ["ojL10n!resources/nls/generic"],
  function(Generic) {
    "use strict";
    var MaturityDetails = function() {
      return {
        root: {
          maturityDetails: {
            self: "To My Mapped Accounts",
            domestic: "Through Domestic Clearing Network",
            internal: "Internal bank Account",
            maturity: "How would you like the account transfer?",
            selfAccount: "Choose funding account number",
            maturityAccount: "On maturity, money should be transferred to which account?",
            beneName: "Please mention the beneficiary name",
            bankCode: "Please tell us the bank code",
            verify: "Verify",
            reset: "Reset",
            banklookup: "Look up Bank Code",
            branch: "Branch",
            invalidCode: "Invalid code.",
            networkType: "What would be the network type?"
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
    return new MaturityDetails();
  }
);