define([
  "ojL10n!resources/nls/account-activity",
  "ojL10n!resources/nls/generic"
], function(Activity, Generic) {
  "use strict";
  var LoansLocale = function() {
    return {
      root: {
        loanEligibilityCalculator: {
          loanEligibility: "Loan Eligibility",
          pageHeader: "Eligibility Calculator",
          header: "How Much Loan Can You Get?",
          monthlyIncome: "Your Average Monthly Income",
          monthlyExpenses: "Your Average Monthly Expenses",
          avgMonthlyInc: "Avg Monthly Income",
          avgMonthlyExp: "Avg Monthly Expense",
          amount: "Amount",
          for: "For How Many Years",
          years: "Years",
          months: "Tenure (months)",
          interest: "Interest",
          interestRate: "@Interest",
          eligibleAmount: "Eligible Amount",
          eligibleAmountValue: "{amount}",
          avgInstallment: "Average Installment",
          perMonthAmount: "{amount} / month",
          back: "Back",
          backToDashboard: "Back To Dashboard",
          calculate: "Calculate",
          reduceInterest: "Reduce Interest Rate",
          reduceInterestTitle: "Click here to reduce Interest Rate",
          increaseInterest: "Increase Interest Rate",
          increaseInterestTitle: "Click here to increase Interest Rate",
          loanOf: "You can get a loan of :<span class=\"calculated-amount\">{calculatedAmount}</span>",
          avgInstallmentValue: "Average Installment :<span class=\"calculated-amount\">{value}/month</span>",
          loanOffersText: "Check out loan offers",
          tenure: "Tenure",
          tenureValidation: "Please enter numbers only"

        },
        validate: {
          amount: "Please enter numeric values",
          day: "Please enter numeric value",
          month: "Please enter numeric value",
          year: "Please enter numeric value",
          interest: "Please enter numeric value",
          emptyYear: "Please enter year tenure",
          emptyInterest: "Please enter Interest"
        },
        accountActivity: Activity,
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
  return new LoansLocale();
});
