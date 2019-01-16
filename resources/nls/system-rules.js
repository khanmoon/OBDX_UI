define([
  "ojL10n!resources/nls/messages",
  "ojL10n!resources/nls/generic"
], function(Messages, Generic) {
  "use strict";
  var OriginationLocale = function() {
    return {
      root: {
        common: {
          apply: "Apply",
          cancel: "Cancel",
          ok: "Ok",
          error: "Error",
          submit: "Submit",
          continue: "Continue",
          login: "Login",
          confirm: "Confirm",
          edit: "Edit",
          amount: "Amount",
          tenure: "Tenure",
          save: "Save",
          delete: "Delete",
          reset: "Reset",
          create: "Create",
          add: "Add",
          remove: "Remove",
          searching: "Searching...",
          displayName: "Display Name",
          desc: "Description",
          selectRole: "Please Select",
          selectLimitPckge: "Select Limit Packages"
        },
        messages: Messages,
        generic: Generic,
        info: {
          noData: "No data to display.",
          reviewCreateMessage:"You initiated a request for updating system rules. Please review details before you confirm!",
          noLimitsAssigned: "No limit packages have been assigned."
        },
        rolePreferences: {
          limitsEntityLevelConf: "Limits - Entity Level Configuration",
          systemRules: "System Rules",
          enterpriseRoles: "Enterprise Role",
          updateSuccess: "System Rules",
          failedMessage: "Creation Failed",
          addAnotherEntity: "Add Another Entity",
          entityLimitPackageTable: "Entity Limit Package Mapping Table",
          entity: "Entity",
          limitPackage: "Limit Package",
          limitPackageSelectionError: "Please select the Limit Package for all Entities"
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
  return new OriginationLocale();
});
