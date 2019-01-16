define([
  "ojL10n!resources/nls/enterprise-role"
], function(Parent) {
  "use strict";
  var EnterpriseRoleCreateLocale = function() {
    return {
      root: {
        buttons: {
          save: "Save",
          cancel: "Cancel",
          back: "Back",
          add: "Add",
          childdelete: "Remove",
          edit: "Edit",
          confirm: "Confirm"
        },
        message: {
          invalidRoleName: "Enter a valid role name",
          invalidRoleDescription: "Enter a valid role description"
        },
        headers: {
          transactionName: "Enterprise Role",
          create: "Create",
          addChildRoles: "Add Enterprise Child Roles",
          addAnother: "Add Another child role",
          mappedChildRoles: "Mapped Child Roles",
          review: "Review",
          edit: "Edit"
        },
        errors: {
          chidlRoleAlreadyExists: "This child role is already mapped."
        },
        fieldname: {
          roleName: "Role Name",
          roleDescription: "Role Description",
          action: "Action",
          childRoles: "Child Roles"
        },
        parent: Parent
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
  return new EnterpriseRoleCreateLocale();
});
