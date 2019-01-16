define([], function() {
  "use strict";
  var TransactionLocale = function() {
    return {
      root: {
        wallet: {
          configaration: {
            header: "Configuration",
            createoffer: "Create New",
            offername: "Offer Name",
            offercode: "Offer Code"
          },

          ledgerDescription: {
            accountgl: "Wallets Account GL",
            profitlossgl: "Wallets Profit & Loss GL",
            intermediarygl: "Wallets Intermediary GL",
            liabilityreportinggl: "Wallets Liability Reporting GL",
            assetreportinggl: "Wallets Asset Reporting GL"
          }

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
  return new TransactionLocale();
});