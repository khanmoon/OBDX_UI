define([], function() {
  "use strict";
  var restservicesLocale = function() {
    return {
      root: {
        serviceIdLabel: "Service Id",
        authTypeLable: "Auth Type",
        contexturlLabel: "Context Url",
        authenticationLable: "Authentication",
        credentialStoreKeyLable: "Credential Store Key",
        credentialStoreTypeLable: "Credential Store Type",
        objectVersionNumberLable: "Object Version Number",
        requestMediaTypeLable: "Request Media Type",
        responseMediaTypeLable: "Response Media Type",
        serviceUrlLable: "Service Url",
        ok: "Ok",
        addLabel: "Save",
        invalidFlag: "Enter either Y or N",
        filterPlaceholder: "Enter Service Id",
        filterButton: "Filter",
        resetButton: "Reset",
        searching: "Searching...",
        propIdLabel: "Property Id",
        configFetchSuccess: "List of configurations fetched successfully",
        restServiceTitle: "{serviceId}",
        editLabel: "Edit",
        deleteLabel: "Delete",
        updateLabel: "Update",
        cancelLabel: "Cancel",
        backLabel: "Back",
        resetLabel: "Reset",
        dialogLabel: "Are you sure you want to delete the Web Service?",
        confirm: "Confirm",
        confirmation: "Confirmation"

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
  return new restservicesLocale();
});
