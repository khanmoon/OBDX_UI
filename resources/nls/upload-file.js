define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var FileUploadLocale = function() {
    return {
      root: {
        fileUpload: {
          title: "Bulk File Upload",
          fileUpload: "File Upload",
          fileid: "File Identifier",
          fieldIdentifier: "Identifier",
          submit: "Submit",
          fileIdDesc: "{fileId} - {description}",
          filename: "File Name",
          transactionType: "Transaction Type",
          fileType: "File Format Type",
          approvalType: "Approval Type",
          approvalTypeDesc: "{approvalType} Level",
          allFileFormat: "CSV,XML,XLS,XLSX",
          textFileFormat: "CSV,TXT",
          accountingType: "Accounting Type",
          cancel: "Cancel",
          chooseFile: "Choose File",
          done: "Ok",
          upload: "Upload",
          select: "Select File Identifier",
          fileId: "File ID",
          success: "File uploaded successfully.",
          referenceId: "File Reference Id",
          refId: "File Reference Id",
          emptyFileErrorMsg: "The uploaded file is empty, Please upload a valid file.",
          fileSizeErrorMsg: "The uploaded file exceeds the maximum permissible size of 5 MB. Please reduce the file size and try again.",
          fileIdis: "File Identifier : {fileId} - {description}",
          fileNameis: "File Name : {fileName}",
          fileRefIdis: "File Reference Id : {fileRefId}",
          selectFI: "Please select a file identifier.",
          noFileFoundErrorMessage: "Please choose a file to upload",
          viewFileDetails: "View File Details",
          viewFileDetailsText: "Click to View File Details",
          noOfFileSelected: "{count} files selected",
          transactionName: "File"
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
  return new FileUploadLocale();
});