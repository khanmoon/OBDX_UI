define([], function() {
  "use strict";
  var AboutLocale = function() {
    return {
      root: {
        header: "Welcome to <span class='account-aggregator__headerName'>Zigmax</span>",
        subHeader: "Link your Savings, Checking, Loan Accounts or Credit Cards maintained with the same or other banks with Zigmax. Manage your money at one place and track your spends across banking relationships.",
        linkAccount : "Link Account",
        imgTitle: "Account Aggregator",
        title: "Our Offerings",
        investmentHeader: "Track Investments",
        investmentContent: "Single view of your accounts across multiple banks",
        category: "Categorize Spends",
        categoryContent: "Categorize your transactions for better undersatnding of your spending habits",
        spendPattern: "View Spend Patterns",
        spendPatternContent: "View a graph and make smarter financial decisions by tracking your spends",
        budget: "Setup and track Budgets",
        budgetContent: "Setup a budget! Track financial goals and relative performance"
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
  return new AboutLocale();
});
