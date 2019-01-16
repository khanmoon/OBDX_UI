define([], function() {
  "use strict";
  var AccessManagementCommonLocale = function() {
    return {
      root: {
        cancel: "Cancel",
        clear: "Clear",
        search: "Search",
        header: "Enterprise Role Maintenance",
        transactionName: "Enterprise Role",
        roleDetails: "Enterprise Role Details",
        view: "View",
        message: {
          deleteRoleMessage: "Are you sure you want to delete this role?",
          invalidRoleName: "Enter a valid role name",
          invalidRoleDescription: "Enter a valid role description"
        },
        fieldname: {
          roleName: "Role Name",
          name: "Name",
          description: "Description",
          roleDescription: "Role Description",
          childRoles: "Enterprise Child Roles"
        },
        buttons: {
          create: "Create",
          back: "Back",
          cancel: "Cancel",
          edit: "Edit",
          delete: "Delete",
          no: "No",
          yes: "Yes"
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
  return new AccessManagementCommonLocale();
});