define([
  "ojL10n!resources/nls/messages",
  "ojL10n!resources/nls/generic"
], function(Messages, Generic) {
  "use strict";
  var AccessPointLocale = function() {
    return {
      root: {
        accessPoint: {
          accessType: "Touch Point Type",
          headerName: "Touch Point Maintenance",
          accessPointId: "Touch Point Id",
          accessPointStatus: "Touch Point Status",
          description: "Description",
          clientId: "Client Id",
          accessPointSearch: "Touch Point Search",
          accessPointNameAndId: "Touch Point Name and ID",
          accessPointName: "Touch Point Name",
          internal: "Internal",
          external: "External",
          enabled: "Enabled",
          disabled: "Disabled",
          view: "View",
          createAccessPoint: "Create Touch Point",
          updateAccessPoint: "Update Touch Point",
          searchError: "Search Error",
          searchErrorMessage: "Please enter either Touch Point id or Touch Point name.",
          headlessMode: "Headless Mode",
          twoFARequired: "Two Factor Authentication",
          searchResults: "Search Results",
          scope: "Scope",
          confirmScreenheader: "You initiated a request for Touch Point. Please review details before you confirm!",
          invalidAccessPoint: "Please enter valid Touch Point id",
          invalidClientId: "Please enter valid client id",
          invalidAccessPointName: "Please enter valid Touch Point name",
          defaultSelect: "Default Available",
          selectImage: "Upload Logo",
          attachFile: "Browse",
          selfOnboard: "Self On Board Touch Points",
          review: "Review",
          reviewwarning: "Warning!",
          cancelMessage: "Are you sure do you want to cancel the operation ?",
          skipLoginFlow: "Skip First Time Login Flow"
        },
        messages: Messages,
        generic: Generic,
        info: {
          noData: "No data to display."
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
  return new AccessPointLocale();
});
