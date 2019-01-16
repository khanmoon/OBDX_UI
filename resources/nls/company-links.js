define([], function() {
  "use strict";
  var companyLinksLocale = function() {
    return {
      root: {
        companyLinks: {
          labels: {
            social: "Social",
            companyHeader: "Company",
            legalHeader: "Legal",
            helpHeader: "Helpful Links",
            contactHeader: "Contact Us",

            Home: "Home",
            About: "About Us",
            Help: "Help",

            legalTerms: "Terms and Conditions",
            legalPolicy: "Privacy Policy",
            legalPress: "Press",

            helpSign: "Sign Up",
            helpRates: "Compare Rates",
            helpOffers: "Members only Offers",

            companyName: "Oracle Corporation",
            companyAddress1: "500 Oracle Parkway",
            companyAddress2: "Redwood Shoes",
            companyAddress3: "California 94065",
            locateABranch: "Locate a Branch",
            submit: "Submit"
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
  return new companyLinksLocale();
});