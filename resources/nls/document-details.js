define([], function() {
  "use strict";
  var DocumentDetailsLocale = function() {
    return {
      root: {
        labels: {
          clauseDesc: "Clause Description",
          clause: "Clause",
          clauses: "Clauses",
          copies: "Copies",
          dateOfAttachement: "Date of Attachment",
          documentsToBePresented: "Documents to be presented within/beyond",
          daysAfterShipment: "days after the date of shipment but within validity of this credit.",
          documentsPresentedInDays: "Documents to be presented within/beyond {noOfDays} days after the date of shipment but within validity of this credit.",
          docName: "Document Name",
          documentList: "Document List",
          documentsPresented: "Documents Presented",
          documentsRequired: "Documents Required",
          fileName: "File Name",
          firstMail: "First Mail",
          forwardSlash: "/",
          incoterm: "Incoterm",
          notes: "Notes",
          original: "Original",
          uploadDocuments: "Upload Documents",
          uploadedDocuments: "Uploaded Documents",
          viewClause: "View Clause",
          selectClause: "Select Clause",
          secondMail: "Second Mail",
          docDetails: "Document Details",
          documentAttached: "Document Attached",
          docYes: "Yes (Documentary)",
          docNo: "No (Clean)",
          sight: "Sight",
          usance: "Usance",
          firstMailInfo: "(First Mail)",
          secondMailInfo: "(Second Mail)",
          docId: "Document Id",
          docCategory: "Document Category",
          docType: "Document Type",
          remarks: "Remarks",
          attachedDocuments: "Attached Documents",
          deletedDocuments: "Deleted Documents",
          attachDocument: "Attach Document",
          attachAnotherDocument: "Attach Another Document",
          chooseFileToAttach: "Choose file to attach",
          remove: "Remove",
          documentTable: "Document Table",
          docForLC: "Attach Document to Letter of Credit"
        },
        docAttached: {
          true: "Yes,Documentary",
          false: "No,Clean"
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
  return new DocumentDetailsLocale();
});