define([], function() {
  "use strict";
  var LoanClosedModel = function() {
    return {
      root: {
        closedLoans: {
          closed_title: "Closed Loans",
          closed_description: "Loans",
          closed_viewall: "View All"

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
  return new LoanClosedModel();
});