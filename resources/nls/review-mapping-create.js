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
          mappingDesc: "Mapping Description",
          groupCode: "Group Code",
          select: "Select",
          subject: "Subjects"
        },
        headers: {
          review: "Review",
          mppingDetails: "Mapping Details"
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