define([], function() {
  "use strict";
  var RecordListingLocale = function() {
    return {
      root: {
        recordListing: {
          uploadedFiles: "Uploaded Files Inquiry",
          recordsNotAvailable: "The record details will be available once the file has been verified.",
          recordsUnAvailable: "The record details are not available since the uploaded file had errors.",
          downloadDetails: "Download as",
          downloadDetailsText: "Click to download details",
          back: "Back",
          csv: "csv",
          pdf: "pdf",
          menuItemsText: "Click to select format",
          delete: "Delete",
          cancel: "Cancel"
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
  return new RecordListingLocale();
});