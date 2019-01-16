define([
  "ojL10n!resources/nls/messages",
  "ojL10n!resources/nls/admin-approvals",
  "ojL10n!resources/nls/generic"
], function(Messages, AdminApprovals, Generic) {
  "use strict";
  var WorkFlowLocale = function() {
    return {
      root: {
        common: {
          back: "Back",
          edit: "Edit",
          confirm: "Confirm",
          create: "Create",
          add: "Add",
          cancelTransaction: "Are you sure you want to cancel this maintenance",
          view: "View",
          approvalDetails: "Approval Details",
          partyname: "Party Name",
          partyid: "Party ID",
          approver: "Approver",
          yes: "Yes",
          no: "No",
          Empty: "This field cannot be empty",
          selectAll: "Select All",
          confirmation: "Confirmation",
          userType: "User Type",
          fetchDetails: "Fetch Details",
          groupDescription: "Group Description",
          modify: "Modify",
          review: "Review",
          createNew: "Create",
          userName: "{firstName} {lastName} ({userName})"
        },
        pageTitle: {
          approvals: "Approvals"
        },
        moduleName: {
          approvals: "Approvals"
        },

        workflow: {
          workflowDescription: "Workflow Description",
          successful: "Workflow Created successfully.",
          details: "Workflow Details",
          workflowSearch: "Workflow Search",
          workflowView: "Workflow Details",
          workflowCreate: "Workflow Create",
          workflowDetails: "Workflow Management",
          adminWorkflowDetails: "Admin Workflow Management",
          approval: "Workflow",
          editWorkflow: {
            editWorkflow: "Edit Workflow",
            successful: "Workflow Modified successfully."
          },
          noSearchResults: "No Workflow found. Please update search criteria",
          selectApprover: "Select Approver {level}",
          addWorkflow: "Add Workflow Level",
          workflowCode: "Workflow Code",
          approvalLevels: "Approval Levels",
          workflowList: "Workflow List",
          workflowTable: "Workflow Table",
          level: "Level {level}",
          appLevel: "Level {level}",
          sno: "S No.",
          userOrUserGroup: "User / Usergroup",
          id: "Id",
          successMessage: "Workflow Maintenance Saved successfully.",
          createWorkflow: "Create Workflow",
          modifyWorkflow: "Modify Workflow"
        },
        editWorkflow: {
          editWorkflow: "Edit Workflow"
        },

        messages: Messages,
        approvals: AdminApprovals,
        generic: Generic,
        info: {
          noData: "No data to display.",
          noRecordFound: "No records found.",
          noDescription: "Please enter either Workflow Code or Workflow Description.",
          searchError: "Many matching records found, please narrow your search criteria.",
          landingHelpTitle: "Workflow Management",
          landingHelpDescription1: "You can now create workflows with multiple levels of approvals. Each workflow can be configured to have up to five levels of approval with a specific user or a user group configured at each level.",
          landingHelpDescription2: "Workflows can be created independently and can be attached to a specific transaction/maintenance as part of the approval rule configuration. Ensure to maintain necessary users groups before you proceed.",
          createHelpTitle: "Workflow Management",
          createHelpDescription1: "You can now create workflows with multiple levels of approvals. Each workflow can be configured to have up to five levels of approval with a specific user or a user group configured at each level.",
          createHelpDescription2: "Workflows can be created independently and can be attached to a specific transaction/maintenance as part of the approval rule configuration. Ensure to maintain necessary users groups before you proceed.",
          viewHelpTitle: "Workflow Management",
          viewHelpDescription1: "You can now create workflows with multiple levels of approvals. Each workflow can be configured to have up to five levels of approval with a specific user or a user group configured at each level.",
          viewHelpDescription2: "Workflows can be created independently and can be attached to a specific transaction/maintenance as part of the approval rule configuration. Ensure to maintain necessary users groups before you proceed.",
          reviewMessage: "You have initiated a request for workflow. Please review details before you confirm!"
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
  return new WorkFlowLocale();
});
