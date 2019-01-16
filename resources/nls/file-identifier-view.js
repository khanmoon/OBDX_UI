define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var FileIdentifierViewLocale = function() {
    return {
      root: {
        fileIdentifierView: {
          fIMaintenance: "File Identifier Maintenance",
          view: "View",
          edit: "Edit",
          back: "Back",
          note: "Note",
          description1: "Assignment of file identifiers to different parties can be done. Approval type needs to be set as whether it would be record level or file level. File template can be selected for the maintenance. Once this is created for a party, account level changes can be done from User File Identifier mapping screen.",
          cancelTransaction: "Are you sure you want to cancel the maintenance?",
          details: "Details",
          approvaltype: "Approval Type",
          approvallevel: "{approvalType} Level",
          allFileFormat: "CSV,XML,XLS,XLSX",
          textFileFormat: "CSV,TXT",
          cancel: "Cancel",
          corporateid: "Party Id",
          corporatename: "Party Name",
          fileIdentifier: "File Identifier",
          description: "Description",
          fileformat: "File Template",
          transactiontype: "Transaction Type",
          accountingtype: "Accounting Type",
          filetype: "File Type",
          formattype: "Format Type",
          ppTolerance: "Partial Preprocessing Tolerance(%)",
          maxNoOfRecords: "Maximum No Of Records",
          debitAccountNumber: "Debit Account Number"
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
  return new FileIdentifierViewLocale();
});