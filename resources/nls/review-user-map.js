define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var ReviewUserMapLocale = function() {
    return {
      root: {
        reviewUserMap: {
          userMapApproval: "User File Identifier Approval",
          username: "User Name",
          user: "{firstName} {lastName}",
          userId: "User Id",
          cancel: "Cancel",
          back: "Back",
          "success-userfimap": "Corporate User-File Identifier Mapping saved successfully.",
          done: "Done",
          review: "Review",
          mappingSummary: "Mapping Summary",
          mappingDetails: "Mapping Details",
          transactiontype: "Transaction Type",
          fileIdentifier: "File Identifier",
          approvaltype: "Approval Type",
          corporateid: "Party Id",
          corporatename: "Party Name",
          senstiveCheck: "Sensitive Check",
          headerCheckBox: "Header Check Box",
          childCheckBox: "Child Check Box"
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
  return new ReviewUserMapLocale();
});