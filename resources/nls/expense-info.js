define([
  "ojL10n!resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var orientationLocale = function() {
    return {
      root: {
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
        expenseSource: "Expense",
        frequencyExpense: "Frequency",
        amount: "Amount",
        allExpenses: "Expenses",
        deleteExpenseClick: "Deleting Expense",
        deleteExpenseClickTitle: "Click For Deleting Expense",
        editExpenseInfoClick: "Click For Editing Expense",
        addExpenseOnClick: "Click For Adding Expense",
        addAnotherExpenseOnClick: "Click For Adding Another Expense",
        limitExceeded: "You can only add upto {limit} expense records.",
        exenseInfoDisclaimer1: "Identify the expenses you incur on a regular basis such as the amount you spend towards food, transport, education and other expenditure.",
        messages: {
          expenseType: "Please enter a valid expense",
          ownershipExpense: "Please provide a valid share of expense %",
          frequencyExpense: "Please select a valid frequency of expense",
          ownershipMinError: "Please enter a percentage greater than {min}",
          ownershipMaxError: "Please enter a percentage less than {max}"
        },
        submitExpense: "Click Here to Submit Expenses Information",
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
  return new orientationLocale();
});
