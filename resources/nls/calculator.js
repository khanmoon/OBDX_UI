define([], function() {
  "use strict";
  var LoanCalculatorLocale = function() {
    return {
      root: {
        calculator: {
          labels: {
            loanHeader: "Instalment Calculator",
            tdCalcHeader: "Term Deposit Calculator",
            amount: "Amount",
            frequency: "Frequency",
            interest: "Interest",
            totalReturns: "Total Returns",
            princAmount: "Principal Amount",
            interestEarned: "Interest Earned",
            years: "Years",
            months: "Months",
            days: "Days",
            back: "Back",
            backToDashboard: "Back To Dashboard",
            duration: "Duration",
            installmentAmt: "Instalment Amount",
            pageHeader: "Loan Instalment Calculator",
            header: "How Much Loan Can You Get",
            depositHeader: "How Much would you like to Deposit",
            calculate: "Calculate",
            tenure: "Tenure (months)",
            for: "For",
            reduceInterest: "Reduce Interest Rate",
            reduceInterestTitle: "Click here to reduce Interest Rate",
            increaseInterest: "Increase Interest Rate",
            increaseInterestTitle: "Click here to increase Interest Rate",
            installmentAmtVal: "{amount}",
            monthlyInstallment: "Instalment Amount :<span class=\"calculated-amount\">{amount}</span>",
            interestRate: "@Interest",
            returns: "You get back :<span class=\"calculated-amount\">{calculatedAmount}</span>"
          },
          validate: {
            amount: "Please enter numeric values within specified range",
            day: "Please enter numeric value",
            month: "Please enter numeric value",
            year: "Please enter numeric value",
            interest: "Please enter numeric value",
            emptyYear: "Please enter year tenure within specified range",
            emptyInterest: "Please enter vaild Interest"
          }
        },
        installmentCalculator: {
          labels: {
            amount: "Amount",
            calculate: "Calculate",
            interest: "Interest",
            period: "Period"
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
  return new LoanCalculatorLocale();
});
