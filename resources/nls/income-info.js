define([
  "ojL10n!resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var orientationLocale = function() {
    return {
      root: {

        primaryIncome: "Primary Income",
        additionalIncome: "Additional Income",
        addIncome: "Add an Income",
        addAnotherIncome: "Add another Income",
        incomeType: "Type of Income",
        grossIncome: "Gross Income",
        netIncome: "Net Income",
        frequency: "Frequency",
        employmentStatus: "Employment Status",
        incomeShare: "Share of Income (%)",
        occupationType: "Employment Type",
        startDate: "Start Date",
        incomeGross: "Gross Income",
        incomeNet: "Net Income",
        incomeFreq: "Frequency",
        allIncome: "Income",
        deleteIncomeClickTitle: "Click For Delete Income",
        deleteIncomeClick: "Delete Income",
        editIncomeInfoClick: "Click For Edit Income Detail",
        addIncomeClick: "Click For Add Income Detail",
        addAnotherIncomeClick: "Click For Add another Income Detail",
        noIncome: "No Income Details added",
        limitExceeded: "You can only add upto {limit} income records.",
        skipFrequency: "Maturity",
        messages: {
          occupationType: "Please select an employment type",
          startDate: "Please provide start date",
          incomeType: "Please select a valid income type",
          ownershipMinError: "Please enter a percentage greater than {min}",
          ownershipMaxError: "Please enter a percentage less than {max}",
          ownershipIncome: "Please provide a valid share of income %",
          frequencyIncome: "Please select a valid frequency of income",
          netIncome: "Net income entered cannot be greater than gross income"
        },
        incomeInfoDisclaimer1: "You do not have to include alimony, child support or separate maintenance income if you do not want it considered as a basis for repayment.",
        incomeSource: "Income Source",
        sourceOfIncome: "Source of Income",
        income: "Income",
        submitIncome: "Click Here to Submit Income Information",

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
