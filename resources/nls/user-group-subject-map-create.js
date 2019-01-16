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
          subject: "Subjects",
          addReviewHeaderMsg: "You Initiated a request for creating mapping for User Group and Subject. Please review details before you confirm!"
        },
        buttons: {
          cancel: "Cancel",
          save: "Save",
          back: "Back",
          create: "Create",
          confirm: "Confirm"
        },
        headers: {
          create: "Create",
          mppingDetails: "Mapping Details",
          transactionName: "User Group Subject Mapping"
        },
        common: {
          cancelConfirm: "Are you sure you want to cancel this transaction ?",
          INITIATED: "Initiated",
          ACCEPTED: "Pending Approval",
          REJECTED: "Rejected",
          confirm: "Confirm",
          transactionMessage: "Transaction completed.",
          done: "Done"
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
