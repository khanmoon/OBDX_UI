define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var FriendListLocale = function() {
    return {
      root: {
        selectContactText: "Click to select contact",
        selectContact: "Select Contact",
        searchContact: "Search Contacts",
        header: "Select Contact",
        contacts: "Contacts",
        contactsHelpMessage: "Facebook contacts who have provided permission to Zigbank are present in the list",
        generic: Generic
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
  return new FriendListLocale();
});
