define([], function() {
  "use strict";
  var CalculatorsLocale = function() {
    return {
      root: {
        pageTitle: {
          calculators: "Calculators"
        },
        savingsCalculator: {
          header: "Make your money grow",
          monthlyIncome: "How Much",
          monthlyExpenses: "Your Average Monthly Expenses",
          for: "For",
          years: "Years",
          interest: "@ Interest",
          savingOf: "You get back",
          avgInstallment: "Average Instalment {value}/month",
          loanOffersText: "More Details",
          months: "months",
          days: "days",
          savings_td_calculator_title: "Savings Calculator"
        },

        calculators: {
          locator_title: "Locator",
          locator_description: "Locate the Branch",
          loan_eligibility_title: "Loan Eligibility",
          savings_td_calculator_title: "Savings Calculator",
          loan_calculator_title: "Loan Calculator",
          loan_calculator: "Loan Calculator",
          loan_eligibility: "Loan Eligibility",
          for: "For",
          years: "Years",
          interest: "@Interest",
          loanCalculator: {
            monthly: "/Month",
            loanAmount: "How much do you need",
            details: "More Details",
            loanOf: "You can get the loan at"
          },
          forexCalculator: {
            forex_calculator: "Forex Calculator",
            forex_calculator_title: "Forex Calculator",
            lookingFor: "I am looking for",
            note: "* Conversion rates are based on mid rate for<br/>Funds Transfer",
            rateDescription: "@ 1 {buyCurrency} = {exchangeRate} {sellCurrency}",
            currencyforeignError: "You must select a foreign currency",
            currencylocalError: "You must select a local currency",
            amountError: "You must enter some amount",
            foreign_placeHolder: "Foreign Currency",
            local_placeHolder: "Local Currency",
            foreign_amount: "Amount",
            local_amount: "Amount",
            foreignCurrency: "Foreign Currency",
            refresh: "Refresh"
          }
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
  return new CalculatorsLocale();
});