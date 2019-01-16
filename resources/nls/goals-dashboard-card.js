define(["ojL10n!resources/nls/payments-common"], function(Common) {
  "use strict";
  var goalsDashboardCard = function() {
    return {
      root: {
        goals: "Goals",
        nextDue: "Next Due",
        creategoal: "Create Goal",
        managegoals: "Manage Goals",
        viewAll: "View All",
        noGoals: "No goals currently exist.",
        menuLabel: "Goals link",
        menualt: "Click here for more goal options",
        menuTitle: "Click here for more goal options",
        goalalt: "Goal Image",
        goaltitle: "Goal Image",
        goalsActive: "Currently, you have {totalGoals} active goals!",
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
  return new goalsDashboardCard();
});