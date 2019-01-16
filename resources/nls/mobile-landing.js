define([], function() {
  "use strict";
  var QuickLinks = function() {
    return {
      root: {
        quickLinks: {
          labels: {
            products: "Products",
            toolsAndCalculators: "Tools & Calculators",
            contactUs: "Contact Us",
            ATMAndBranch: "ATM & Branch",
            ScanToPay: "Scan To Pay",
            claimMoney: "Claim Money",
            quickSnapshot: "Quick Snapshot",
            goBack: "Go Back",
            goHome: "Return to Home Page",
            chatbotText: "Hi,How Can I Help You?"
          }
        }
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
  return new QuickLinks();
});
