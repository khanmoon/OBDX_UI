define([
  "ojL10n!lzn/gamma/resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var dashboardLocale = function() {
    return {
      root: {
        applicant: "Applicant",
        requiredDocuments: "Required Documents",
        invalidDocument: "This document is not valid, please re-upload",
        verified: "Verified",
        noFile: "No file selected. Please select a file to upload",
        ok: "Ok",
        documents: "Documents",
        documentDownloadClick: "Document Download",
        documentDownloadClickTitle: "Click for Document Download",
        deleteDocumentClick: "Delete Document",
        deleteDocumentClickTitle: "Click for Delete Document",
        chooseFile: "Choose file...",
        uploadDocuments: "Upload Documents",
        saveAndContinue: "Save and Continue",
        attachDocument: "<span class='icon-attachment'> Attach Document</span>",
        attachAnotherDocument: "<span class='icon-attachment'> Attach Another Document</span>",
        documentLabel: "Document",
        remarks: "Remarks",
        action: "Action",
        tableHeading: "Attached Documents",
        uploadDocumentText1: "Upload documents to support the following proofs.",
        uploadDocumentText2: "Click here to view instructions.",
        uploadDocumentText3: "Please note – Certain documents are required by the bank to process your application. You will not be able to submit the application unless you have uploaded the required documents.",
        uploadDocumentPolicyClick: "Click to view document upload instructions",
        uploadDocumentPolicyTitle: "Instructions For Uploading Documents",
        documentIns1: "Documents marked as ‘required’ need to be uploaded on a mandatory basis.",
        documentIns2: "Multiple documents can be attached against each document type.",
        documentIns3: "The total size of all documents must not exceed 5 MB.",
        documentIns4: "Supported file types are - .jpeg, .png, .doc.",
        documentRequired: "{documentType} <span class='text'>(required)</span>",
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
  return new dashboardLocale();
});
