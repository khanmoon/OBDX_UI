define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";
  var RulesLocale = function() {
    return {
      root: {
        accountType: {
          CSA: "Casa",
          TRD: "Term Deposits",
          LON: "Loans"
        },
        rules: {
          ruleMaintainance: "Rules Management",
          fromAmountGreater: "From Amount cannot be less than To Amount",
          partyid: "Party ID",
          partyname: "Party Name",
          selectTransaction: "Rule Type",
          financialTransaction: "Financial",
          nonFinancialTransaction: "Non Financial",
          administrationValue: "Administration",
          admin_maintenance: "Maintenance",
          administration: "Administration",
          ruleCode: "Rule Code",
          Empty: "This field cannot be empty",
          input: "Input",
          ruleDescription: "Rule Description",
          initiator: "Initiator",
          transactions: "Transactions",
          pleaseSelect: "Please Select",
          accounts: "Accounts",
          amountRange: "Amount Range",
          fromAmount: "From Amount",
          toAmount: "To Amount",
          workflowDetails: "Workflow Details",
          approvalsRequired: "Approval Required",
          ruleWorkflow: "Workflow",
          appLevel: "Level {level}",
          userName: "{firstName} {lastName} {userName}",
          description: "Rule Description",
          bothAmountNull: "Both amount fields cannot be null. If amount constraint is not required then please put 0 in Amount From feild.",
          deleteRuleMsg: "Are you sure you want to delete this Approval Rule?",
          cancelTransaction: "Are you sure you want to cancel this maintenance",
          confirmation: "Confirmation",
          results: "Results",
          createNew: "Create",
          maker: "Maker",
          workflowCode: "Workflow Code",
          details: "Rules Details",
          selectInitiator: "Initiator Type",
          searchAllRules: "All",
          noAccounts: "No Supported Accounts for the selected transaction",
          createRules: "Create Rules",
          successMessage: "Approval Rule Maintenance saved successfully.",
          successful: "Successful",
          createRule: "Create Rule",
          modifyRule: "Modify Rule",
          deleteRule: "Delete Rule",
          successDeleteMessage: "Approval Rule Deleted successfully.",
          cancelMaintenanceMsg: "Are you sure you want to cancel this maintenance",
          currency: "Currency",
          transactionType: "Transaction Type",
          INITIATED: "Initiated",
          ACCEPTED: "Pending Approval",
          REJECTED: "Rejected"
        },
        headers: {
          VIEW: "View",
          EDIT: "Edit",
          CREATE: "Create",
          REVIEW: "Review",
          APPROVALREVIEW: "Review"
        },
        common: Generic.common,
        info: {
          noData: "No data to display.",
          reviewMessage: "You initaited a request for approval rules management. Please review details before you confirm!"
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
  return new RulesLocale();
});
