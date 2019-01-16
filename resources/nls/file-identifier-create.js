define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var FileIdentifierCreateLocale = function() {
    return {
      root: {
        fileIdentifierCreate: {
          fuid: "File Identifier",
          fIMaintenance: "File Identifier Maintenance",
          review: "Review",
          reviewMessage: "Make sure the details are correct before you confirm!",
          success: "Success",
          successful: "Confirmation",
          selectAprrovalType: "Please select approval type.",
          create: "Create",
          back: "Back",
          save: "Save",
          edit: "Edit",
          allFileFormat: "CSV,XML,XLS,XLSX",
          textFileFormat: "CSV,TXT",
          cancelTransaction: "Are you sure you want to cancel the maintenance?",
          details: "Details",
          fileIdentifier: "File Identifier",
          description: "Description",
          fileformat: "File Template",
          select: "Select",
          approvaltype: "Approval Type",
          approvallevel: "{approvalType} Level",
          cancel: "Cancel",
          confirm: "Confirm",
          transactionName: "File Identifier Maintenance",
          provideValue: "Please provide a value.",
          selectTemplate: "Please select a file template.",
          successbulkregistration: "File Identifier Maintenance created successfully.",
          ppDescription: "Value in this field will define the percentage of records in a file that needs to clear the validation stage to go through further processing.",
          backToDashBoard: "Ok",
          corporateid: "Party Id",
          corporatename: "Party Name",
          transactiontype: "Transaction Type",
          accountingtype: "Accounting Type",
          filetype: "File Type",
          formattype: "Format Type",
          pendingStatus: "Pending Approval",
          confirmStatus: "Completed",
          ppTolerance: "Partial Pre-processing Tolerance(%)",
          maxNoOfRecords: "Maximum No Of Records",
          selectDebitAccountNumber: "Please select a account number.",
          enterNumber: "Please enter number only",
          note: "Note",
          description1: "Assignment of file identifiers to different parties can be done. Approval type needs to be set as whether it would be record level or file level. File template can be selected for the maintenance. Once this is created for a party, account level changes can be done from User File Identifier mapping screen.",
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
  return new FileIdentifierCreateLocale();
});
