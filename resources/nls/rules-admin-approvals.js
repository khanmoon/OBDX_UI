define([
  "ojL10n!resources/nls/messages",
  "ojL10n!resources/nls/admin-approvals",
  "ojL10n!resources/nls/workflow-admin-approvals",
  "ojL10n!resources/nls/rules",
  "ojL10n!resources/nls/generic"
], function(Messages, AdminApprovals, WorkflowAdminApprovals, Rules, Generic) {
  "use strict";
  var RulesAdminApprovalsLocale = function() {
    return {
      root: {
        common: Generic.common,
        accountType: {
          CSA: "Casa",
          TRD: "Term Deposits",
          LON: "Loans"
        },
        headers: {
          rules: "Approval Rules",
          rulesAdmin: "Admin Approval Rules",
          REVIEW: "Review",
          CREATE: "Create",
          VIEW: "View",
          EDIT: "Edit",
          rulesDetails: "View Rule",
          rulesEdit: "Modify Rule",
          rulesCreate: "Create Rule",
          rulesDelete: "Delete Rule",
          APPROVALREVIEW: "Review"
        },
        validationMsg: {
          validRuleCode: "Enter Valid Rule Code",
          validRuleDesc: "Enter Valid Rule Description"
        },
        messages: Messages,
        approvals: AdminApprovals,
        workflow: WorkflowAdminApprovals.workflow,
        adminrules: Rules,
        generic: Generic,
        info: {
          noData: "No data to display.",
          noRecordFound: "No records found.",
          noDescription: "Please enter either Rule Code or Rule Description.",
          landingHelpTitle: "Rules Management",
          landinghelpDescription: "You can search for the existing rules by keying in rule code or rule description. The matching rules are displayed as search results. Click on the rule code from the search results to go to the screen that has the details of the rule.",
          createHelpTitle: "Rules Management",
          createHelpDescription: "In Rules Management functionality you can assign approval rules for transactions initiated by a specific user or user groups. Once in the Create screen you can define the details of the rule like - rule description, user/user groups to whom the rules apply as initiators, transactions that need approval, whether approval is needed and if yes , the workflow that the approval has to go through.",
          viewHelpTitle: "Rules Management",
          viewHelpDescription: "Here you can view the details of an existing rule. Click on Edit button to update the existing rules. Please note that the Rule code is not editable. In case you want to delete the rule, click on Delete button.",
          reviewMessage: "You have initiated a request for Admin Approval Rule. Please review details before you confirm!"
        }
      }
    };
  };
  return new RulesAdminApprovalsLocale();
});
