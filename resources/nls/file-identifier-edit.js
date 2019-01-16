define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var FileIdentifierEditLocale = function() {
    return {
      root: {
        fileIdentifierEdit: {
          edit: "Edit",
          fIMaintenance: "File Identifier Maintenance",
          details: "Details",
          description: "Description",
          approvaltype: "Approval Type",
          approvallevel: "{approvalType} Level",
          cancel: "Cancel",
          back: "Back",
          save: "Save",
          note: "Note",
          description1: "Assignment of file identifiers to different parties can be done. Approval type needs to be set as whether it would be record level or file level. File template can be selected for the maintenance. Once this is created for a party, account level changes can be done from User File Identifier mapping screen.",
          cancelTransaction: "Are you sure you want to cancel the maintenance?",
          review: "Review",
          reviewSummary: "Make sure the details are correct before you confirm!",
          allFileFormat: "CSV,XML,XLS,XLSX",
          textFileFormat: "CSV,TXT",
          confirm: "Confirm",
          successful: "Confirmation",
          transactionName: "File Identifier Maintenance",
          successbulkupdate: "File Identifier Maintenance saved successfully.",
          ppDescription: "Value in this field will define the percentage of records in a file that needs to clear the validation stage to go through further processing.",
          success: "Success",
          backToDashBoard: "Ok",
          corporateid: "Party Id",
          corporatename: "Party Name",
          fileIdentifier: "File Identifier",
          formattype: "Format Type",
          transactiontype: "Transaction Type",
          accountingtype: "Accounting Type",
          filetype: "File Type",
          fileformat: "File Template",
          pendingStatus: "Pending Approval",
          confirmStatus: "Completed",
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
  return new FileIdentifierEditLocale();
});