define([
  "ojL10n!resources/nls/messages",
  "ojL10n!resources/nls/admin-approvals",
  "ojL10n!resources/nls/generic"
], function(Messages, AdminApprovals, Generic) {
  "use strict";
  var AdminUserGroupLocale = function() {
    return {
      root: {

        accountType: {
          CSA: "Casa",
          TRD: "Term Deposits",
          LON: "Loans"
        },
        common: {
          createNew: "Create",
          userGroup: "User Group",
          ok: "Ok",
          addNew: "Add",
          add: "Add",
          cancelTransaction: "Are you sure you want to cancel this maintenance",
          usersAdded: "Users Added",
          userToAdd: "User to Add"
        },
        userSearch: {
          search: "Search",
          header: "Select a user",
          username: "User ID",
          lookUp: "Look-Up",
          userGroup: "User Group",
          userName: "{firstName} {lastName} ({userName})"
        },
        headers: {
          userGroup: "User Group",
          userGroupMaintenance: "Admin User Groups",
          REVIEW: "Review",
          userGroupCreate: "Create User Group",
          userGroupModify: "Modify User Group",
          VIEW: "View",
          APPROVALREVIEW: "Review",
          adminWorkflowMaintenance: "Admin Workflow Maintenance",
          adminUserGroupMaintenance: "Admin User Group Maintenance"

        },

        userGroup: {
          userGroups: "User Groups",
          UserGroupId: "User Group Id",
          UserType: "User Type",
          UserGroupName: "User Group",
          viewDetails: "View Details",
          userGroupName: "User Group Name",
          UserID: "User ID",
          UserName: "User Name",
          UserCount: "User Count",
          editUserGroup: "Modify User Group",
          successful: "User Group Created successfully.",
          reviewUserGroup: "Create User Group",
          searchText: "Please enter the username you are looking for.",
          noSearchResults: "No User Group Found. Please update search criteria",
          editSuccess: "User Group Updated Successfully.",
          linkUsers: "Add User",
          noUserGroupDetails: "User Group details not found",
          groupDescription: "Group Description",
          groupCode: "Group Code",
          userGroupDetails: "User Groups",
          adminUserGroupDetails: "Admin User Groups",
          users: "Users",
          successMessage: "User Group Maintenance Saved successfully.",
          createUserGroup: "Create User Group",
          modifyUserGroup: "Modify User Group",
          title: "User Group Details",
          delete: "Delete",
          moredetails: "Click for more details."
        },

        messages: Messages,
        approvals: AdminApprovals,
        generic: Generic,
        info: {
          noData: "No data to display.",
          noRecordFound: "No records found.",
          userGroupDataError: "User Group list cannot be empty. Please add at least 1 User.",
          noDescription: "Please enter either Group Code or Group Description."
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
  return new AdminUserGroupLocale();
});
