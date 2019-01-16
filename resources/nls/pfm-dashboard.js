define(
  [],
  function() {
    "use strict";
    var PFMdashboard = function() {
      return {
        root: {
          subtitle: "Personal Finance Management",

          title: "Overview",

          goals: {
            header: "My Goals"
          },
          spend: {
            header: "My Spends",
            viewalltxn: "View All Transactions"
          },
          budget: {
            header: "My Budgets"
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
    return new PFMdashboard();
  }
);