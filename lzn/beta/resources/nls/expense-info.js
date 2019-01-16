define([
  "ojL10n!lzn/beta/resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var orientationLocale = function() {
    return {
      root: {
        compName: "expense-info",
        expense: "Expense {index}",
        primaryExpense: "Primary Expense",
        additionalExpense: "Additional Expense",
        addExpense: "Add an Expense",
        addAnotherExpense: "Add another Expense",
        expenseType: "Type of Expense",
        expenseShare: "Share of Expense (%)",
        totalExpense: "Total Expense Value",
        frequency: "Frequency of Expense",
        skipFrequency: "Maturity",
        noExpenses: "No Expense Details Added",
        expenseFrequency: "Frequency of Expense",
        allExpenses: "Expenses",
        messages: {
          expenseType: "Please select a valid expense type",
          ownershipExpense: "Please provide a valid share of expense %",
          frequencyExpense: "Please select a valid frequency of expense",
          ownershipMinError: "Please enter a percentage greater than {min}",
          ownershipMaxError: "Please enter a percentage less than {max}"
        },

        generic: Generic
      },
      "ar": true,
      "fr": true,
      "cs": true,
      "sv": true,
      "en": false,
      "en-us": false,
      "el": true
    };
  };
  return new orientationLocale();
});