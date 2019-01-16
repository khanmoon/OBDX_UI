define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";
  var WorkFlowLocale = function() {
    return {
      root: {
        pageTitle: {
          approvals: "Approvals"
        },
        moduleName: {
          approvals: "Approvals"
        },
        common: {
          back: "Back",
          INITIATED: "Initiated",
          ACCEPTED: "Pending Approval",
          REJECTED: "Rejected",
          confirm: "Confirm",
          search: "Search",
          create: "Create",
          add: "Add",
          cancelTransaction: "Are you sure you want to cancel this operation?",
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
          successful: "Successful",
          review: "Review",
          createNew: "Create",
          userName: "{firstName} {lastName} ({userName})",
          cancelWarning: "Warning"
        },
        navLabels: {
          workflow: "Approval Workflows"
        },
        workflow: {
          modifyWorkflow: "Modify Workflow",
          createWorkflow: "Create Workflow",
          workflow: "Approval Workflows",
          workflowName: "Workflow Name",
          workflowDescription: "Workflow Description",
          successful: "Workflow Created successfully.",
          description: "Description",
          details: "Workflow Details",
          workflowDetails: "Workflow Management",
          editWorkflow: {
            editWorkflow: "Edit Workflow"
          },
          noSearchResults: "No Workflow found. Please update search criteria",
          selectApprover: "Select Approver {level}",
          addWorkflow: "Add Workflow Level",
          workflowCode: "Workflow Code",
          approvalLevels: "Approval Levels",
          workflowList: "Workflow List",
          appLevel: "Level {level}",
          ApprovalDetails: "Approval Details",
          sno: "S No.",
          successMessage: "Workflow Maintenance saved successfully."
        },
        headers: {
          workflowMaintenance: "Admin Workflow Management",
          successful: "Successful"
        },
        generic: Generic,
        info: {
          noData: "No data to display.",
          reviewMessage: "You initaited a request for workflow management. Please review details before you confirm!"
        },
        headings: {}
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
