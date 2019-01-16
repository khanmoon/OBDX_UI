define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var LoanRepaymentRequestModel = function() {
    return {
      root: {
        common: {
          successful: "Successful!"
        },
        repayment: {
          principalFinance: "Outstanding Finances",
          principalBalance: "Outstanding Principal",
          installmentArrears: "Pending Arrears",
          disclaimer: "Disclaimer:",
          disclaimerText: "If arrears are pending for the account, the same will be settled first. Remaining amount of the payment will be settled against Principal Balance",
          transferAmountHeading: "Repayment Amount",
          reviewRepayment: "Review",
          transferFrom: "Transfer From",
          repaymentSuccessText: "Repayment completed successfully.",
          referenceNumberText: "Reference Number {referenceNumber}",
          sourceAccount: "Source Account",
          noCASAAccount: "No Savings/Current Account found for repayment",
          heading: "Repayment",
          selectAccount: "Select Account",
          loanRepayButton: "Repay",
          transactionName: "Loan Repayment",
          INITIATED: "Initiated",
          ACCEPTED: "Pending Approval",
          REJECTED: "Rejected"
        },
        generic: Generic
      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
      "en-us": false,
      el: false
    };
  };
  return new LoanRepaymentRequestModel();
});