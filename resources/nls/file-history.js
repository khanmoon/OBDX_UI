define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var FileHistoryLocale = function() {
    return {
      root: {
        fileHistory: {
          uploadDate: "Upload Date",
          fileName: "File Name",
          referenceId: "File Reference Id",
          paymentType: "Payment Type",
          noOfRecordds: "Number of Records",
          fileId: "File Identifier",
          status: "File Status",
          txnRefId: "Transaction Reference Id",
          errorReport: "Error Report",
          responseFile: "Response File Download",
          statusDetails: "Status Details",
          fileWorkFlow: "File Workflow",
          fileHistory: "File History",
          fileView: "File View",
          complete: "Complete({success})",
          deleted: "Deleted({remove})",
          failed: "Failed({fail})",
          process: "Process({success})",
          error: "Error({fail})",
          pending: "Pending({pending})",
          approved: "Approved({success})",
          rejected: "Rejected({rejected})",
          expired: "Expired({expired})",
          inError: "In Error({fail})",
          verified: "Verified({success})",
          fileDetails: "File Details",
          transactionType: "Transaction Type",
          downloadErrorFile: "Download Error File",
          downloadErrorFileText: "Click to download Error File",
          downloadResponseFile: "Download Response File",
          downloadResponseFileText: "Click to download Response File",
          downloadFile: "Download File",
          downloadFileText: "Click to Download File"

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
  return new FileHistoryLocale();
});