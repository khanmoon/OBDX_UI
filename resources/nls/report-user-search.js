define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var ReportUserSearchLocale = function() {
    return {
      root: {
        reportUserSearch: {
          reportMap: "User Report Mapping",
          userList: "Users List",
          user: "{firstName} {lastName}",
          initials: "Initials",
          userDetails: "User Details",
          number: "Contact Details",
          mapping: "Mapping",
          back: "Back",
          cancelTransaction: "Are you sure you want to cancel the maintenance?",
          cancel: "Cancel",
          viewlist: "View List",
          fullName: "Full Name",
          userName: "User Name"
        },
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
  return new ReportUserSearchLocale();
});