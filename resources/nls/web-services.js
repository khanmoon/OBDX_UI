define([

], function() {
  "use strict";
  var webServicesLocale = function() {
    return {
      root: {
        serviceIdLabel: "Service Id",
        processLabel: "Process",
        urlLabel: "URL",
        nameSpaceLabel: "Namespace",
        serviceLabel: "Service",
        summaryLabel: "Summary Text",
        stubClassLabel: "Stub Class",
        stubServiceLabel: "Stub Service",
        proxyClassNameLabel: "Proxy Classname",
        endpointNameLabel: "End-Point",
        ok: "Ok",
        endPointUrlLabel: "End-Point URL",
        timeOutLabel: "Time-Out",
        ipLabel: "Ip",
        portLabel: "Port",
        userLabel: "User",
        passwordLabel: "Password",
        httpBasicAuthConnectorLabel: "Http Basic Auth Connector",
        httpBasicAuthRealmLabel: "Http Basic Auth Realm",
        securityPolicyLabel: "Security Policy",
        anonymousSecurityPolicyLabel: "Anonymous Security Policy",
        anonymousSecurityKeyNameLabel: "Anonymous Security Key Name",
        addLabel: "Save",
        filterPlaceholder: "Enter Property Id",
        filterButton: "Filter",
        resetButton: "Reset",
        searching: "Searching...",
        propIdLabel: "Property Id",
        configFetchSuccess: "List of configurations fetched successfully",
        webServiceTitle: "{serviceId}.{process}",
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
  return new webServicesLocale();
});
