define([], function() {
  "use strict";
  var FileIdentifierSearchLocale = function() {
    return {
      root: {
        fileAdminCreate: {
          fuids: "File Identifiers",
          create: "Create",
          cancelTransaction: "Are you sure you want to cancel the maintenance?",
          back: "Back",
          cancel: "Cancel",
          note: "Note",
          description1: "Assignment of file identifiers to different parties can be done. Approval type needs to be set as whether it would be record level or file level. File template can be selected for the maintenance. Once this is created for a party, account level changes can be done from User File Identifier mapping screen.",
          srno: "Sr. no.",
          description: "Description",
          transactiontype: "Transaction Type",
          approvaltype: "Approval Type",
          noData: "No file identifiers have been created for this party."
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
  return new FileIdentifierSearchLocale();
});
