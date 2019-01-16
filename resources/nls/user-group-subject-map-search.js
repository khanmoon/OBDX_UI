define([
  "ojL10n!resources/nls/messages",
  "ojL10n!resources/nls/generic"
], function(Messages, Generic) {
  "use strict";
  var OriginationLocale = function() {
    return {
      root: {
        pageTitle: {
          userGroupSubjectMap: "User Group - Subject Mapping"
        },
        fieldname: {
          mappingCode: "Mapping Code",
          mappingDesc: "Description",
          groupCode: "Group Code",
          select: "Select",
          mappingDetails: "Mapping Details"
        },
        buttons: {
          cancel: "Cancel",
          clear: "Clear",
          search: "Search"
        },
        headers: {
          create: "Create"
        },
        info: {
          inputRequired: "Please provide at least one search input."
        },
        messages: Messages,
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
  return new OriginationLocale();
});