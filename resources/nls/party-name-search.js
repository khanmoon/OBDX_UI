define([
  "ojL10n!resources/nls/messages",
  "ojL10n!resources/nls/generic",
  "ojL10n!resources/nls/user-management-common",
  "ojL10n!resources/nls/user-management-headers"
], function(Messages, Generic, UMCommon, UMHeaders) {
  "use strict";
  var PartyNameLocale = function() {
    return {
      root: {
        fieldname: {
          partyname: "Party Name",
          partyid: "Party ID",
          searchParty: "Search Party Name",
          partyPlaceholder: "Enter Party Name",
          caption: "caption"
        },
        error: {
          invalidInputProvided: "The information you have provided is incorrect. Please check your details.",
          emptyInputField: "Please provide valid Party Name."
        },
        messages: Messages,
        generic: Generic,
        common: UMCommon,
        headers: UMHeaders
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
  return new PartyNameLocale();
});