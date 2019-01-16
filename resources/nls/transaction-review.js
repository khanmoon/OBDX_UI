define(function() {
  "use strict";
  var ApprovalsLocale = function() {
    return {
      root: {
        common: {
          partyname: "Party Name",
          partyid: "Party Id",
          userType: "User Type",
          review: "Review",
          approver: "Approver"
        },
        rules: {
          ruleName: "Rule Name",
          approvalsRequired: "Approvals Required",
          maker: "Maker",
          transactionType: "Transaction Type",
          transactions: "Transactions",
          accounts: "Accounts",
          fromAmount: "Amount From",
          toAmount: "Amount To",
          financialTransaction: "Financial Transaction",
          nonFinancialTransaction: "Non Financial Transaction"
        },
        workflow: {
          approval: "Approval workflow",
          workflowName: "Workflow Name",
          workflowDescription: "Workflow Description"
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
  return new ApprovalsLocale();
});