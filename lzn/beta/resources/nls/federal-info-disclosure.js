define([
  "ojL10n!lzn/beta/resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var federalDisclosure = function() {
    return {
      root: {
        tableHeading: "Federal Info Disclosure.",
        federalTruth: "Federal Truth in Lending Act Disclosure",
        annualPercentageRate: "Annual Percentage Rate",
        financeCharge: "Finance Charge",
        amountFinanced: "Amount Financed",
        totalOfPayments: "Total of Payments",
        theCreditCost: "The cost of your credit at a yearly rate",
        theCreditDollarAmount: "The dollar amount the credit will cost you",
        creditAmount: "The amount of credit provided to you or on your behalf",
        paidAmount: "The amount you will have paid after you have made all payments as scheduled",
        aprPer: "APR{percentage}",
        dollarCost: "Dollar Cost in {dollar}",
        loanAmountDollar: "Amount of Loan in {dollar}",
        totalDue: "Total Due in {dollar}",
        paymentSchedule: "Payment Schedule",
        paymentScheduleText: "One payment in the amount of <Total payment due in U.S. dollar> due on <due date as Day and Date>",
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
  return new federalDisclosure();
});