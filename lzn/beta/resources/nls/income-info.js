define([
  "ojL10n!lzn/beta/resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var orientationLocale = function() {
    return {
      root: {
        compName: "income-info",
        income: "Income {index}",
        primaryIncome: "Primary Income",
        additionalIncome: "Additional Income",
        addIncome: "Add an Income",
        addAnotherIncome: "Add another Income",
        incomeType: "Source of Income",
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
        allIncome: "Incomes",
        deleteIncomeClick: "Click For Delete Income",
        editIncomeInfoClick: "Click For Edit Income Detail",
        addIncomeClick: "Click For Add Income Detail",
        addAnotherIncomeClick: "Click For Add another Income Detail",
        noIncome: "No Income Details added",
        skipFrequency: "Maturity",
        incomeEarned: "Income earned on your last paycheck",
        howOften: "How often are you paid?",
        nextPayDate: "Next payday",
        secondPayDate: "Second payday",
        ifPaydayHoliday: "If your payday falls on a holiday, when are you paid?",
        dayBefore: "Day before the holiday",
        dayAfter: "Day after the holiday",
        noChange: "No change - On the holiday",
        incomeSource: "Income Source",
        annualIncome: "Annual Income",
        incomeInfoDisclaimer1: "Income from alimony, child support, or separate maintenance income need not be revealed if you do not wish to have it considered as a basis for repaying this obligation",
        incomeInfoDisclaimer2: "Please make sure you capture other types of income including salary and hourly wages, overtime, bonuses, public assistance, disability, pension, interest, dividends, self-employment, commission, rental pay, social security, and retirement pay.",
        incomeInfoDisclaimer3: "Note: Proof of income may be required.",
        incomeInfoDisclaimer: "You do not have to include alimony, child support or separate maintenance income if you do not want it considered as a basis for repayment.",
        dayOfWeekPaid: "Day of week paid?",
        messages: {
          occupationType: "Please select an employment type",
          startDate: "Please provide start date",
          incomeType: "Please select a valid source of income",
          ownershipMinError: "Please enter a percentage greater than {min}",
          ownershipMaxError: "Please enter a percentage less than {max}",
          ownershipIncome: "Please provide a valid share of income %",
          frequencyIncome: "Please select a valid frequency of income",
          netIncome: "Net income entered cannot be greater than gross income",
          invalidSecondPayDay: "Second Pay day can not be less than or same as next pay day.",
          invalidFrequency: "Please select a valid option",
          alternatePayDay: "Please select a valid option",
          nextPayDate: "Please enter a valid next payday",
          secondPayDate: "Please enter a valid second payday"
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