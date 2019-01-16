define([
  "ojL10n!resources/nls/payments-common"
], function(Common) {
  "use strict";
  var budgetsDashboardCard = function() {
    return {
      root: {
        budgets: "Budgets",
        createBudget: "Create Budget",
        manageBudgets: "Manage Budgets",
        viewAll: "View All",
        noBudgets: "No Budget exists.",
        menuLabel: "Budget Link",
        budgetalt: "Budget Image",
        budgettitle: "Budget Image",
        budgetActive: "You have set {totalSpend} budget categories!",
        openmenualt: "Click here for more budget options",
        openmenutitle: "Click here for more budget options",
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
  return new budgetsDashboardCard();
});