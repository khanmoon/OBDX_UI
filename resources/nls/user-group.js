define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";
  var UserGroupLocale = function() {
    return {
      root: {
        userGroup: {
          userGroupDetails: "User Groups",
          groupCode: "Group Code",
          groupDescription: "Group Description",
          users: "Users",
          missingSearchCriteria: "Please specify Party ID.",
          PartyID: "Party ID",
          PartyName: "Party Name",
          GROUP_MEMBERS: "Group Members:",
          UserID: "User ID",
          UserName: "User Name",
          invalidError: "Invalid Userid",
          modifyUserGroup: "Modify User Group",
          INITIATED: "Initiated",
          ACCEPTED: "Pending Approval",
          REJECTED: "Rejected",
          successMessage: "User Group maintenance saved successfully.",
          createUserGroup: "Create User Group",
          cancelMaintenanceMsg: "Are you sure you want to cancel this maintenance",
          empty: "This field cannot be empty",
          input: "Input",
          addNew: "Add",
          userListNull: "User Group list cannot be empty. Please add at least 1 User.",
          selectUser: "Select User",
          cancelTransaction: "Are you sure you want to cancel this maintenance",
          confirmation: "Confirmation",
          usersAdded: "Users Added",
          userToAdd: "User to Add"
        },
        headers: {
          VIEW: "View",
          EDIT: "Edit",
          CREATE: "Create",
          APPROVALREVIEW: "Review",
          REVIEW: "Review"
        },
        info: {
          noData: "No data to display."
        },
        common: Generic.common
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
  return new UserGroupLocale();
});