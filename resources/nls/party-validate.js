define([], function() {
  "use strict";
  var PartyValidateLocale = function() {
    return {
      root: {
        validateParty: "Validate Party",
        corporateid: "Party ID",
        corporatename: "Party Name",
        fetch: "Fetch",
        user: "User",
        userGroup: "User Group",
        details: "Show Party Details List",
        cancel: "Cancel",
        clear: "Clear",
        noDescription: "Please enter Party ID or Party Name.",
        search: "Search"
      },
      ar: false,
      fr: true,
      cs: false,
      sv: false,
      en: false,
      "en-us": false,
      el: false
    };
  };
  return new PartyValidateLocale();
});