define([], function() {
  "use strict";
  var FinancialSummaryLocale = function() {
    return {
      root: {
        labels: {
          myAccounts: "Accounts",
          myBankName: "Zig Bank Limited.",
          accounts: "{count} Accounts",
          CSA: "Current & Savings",
          savings: "Savings",
          LON: "Loans and Finances",
          TRD: "Term Deposits",
          RD: "Recurring Deposits",
          total: "Total",
          totalAccounts: "Total Accounts",
          accountCount: "({count} Accounts)",
          CCA: "Credit Card",
          numberOfAccounts: "<div class=\"count\">{count}</div>Accounts",
          netBalance: "Net Balance",
          ddDetails: "Savings & Current Account Details",
          tdDetails: "Term Deposits Account Details",
          loanDetails: "Loan Account Details",
          ddDetailsTitle: "Click Here For Savings & Current Account Details",
          tdDetailsTitle: "Click Here For Term Deposits Account Details",
          loanDetailsTitle: "Click Here For Loan Account Details",
          filmstripText: "Specific Account Details",
          noCASAAccounts: "You do not have any Savings and Current account",
          noTRDAccounts: "You do not have any Term Deposit",
          noLoanAccounts: "You do not have any Loans",
          noAccounts: "No active accounts are found, please contact Branch/Customer Care for further information"
        },
        subHeaders: {
          LON: "Apply online and get instant approval!",
          TRD: "Earn interest on your deposits. Open instantly!",
          CCA: "You do not have any credit cards!"
        },
        accountSummary: {
          netBalance: "Net Balance",
          depositRateAndMaturityDate: "@ {interestRate} | Maturing on {maturityDate}",
          outstandingBalance: "Outstanding Balance",
          linkDetails: "Click to see details of {accountNo}",
          displayContent: "{nickname}"
        },
        depositsSummary: {
          depositRateAndMaturityDate: "@ {interestRate} | Maturing on {maturityDate}",
          maturityBalance: "Maturity Balance",
          principalBalance: "Principal Balance"
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
  return new FinancialSummaryLocale();
});
