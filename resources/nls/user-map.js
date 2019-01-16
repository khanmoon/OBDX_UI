define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var UserMapLocale = function() {
    return {
      root: {
        userMap: {
          userfimap: "User File Identifier Mapping",
          view: "View",
          edit: "Edit",
          cancelTransaction: "Are you sure you want to cancel the maintenance?",
          username: "User Name",
          user: "{firstName} {lastName}",
          userId: "User Id",
          cancel: "Cancel",
          back: "Back",
          save: "Save",
          confirm: "Confirm",
          header2: "Note",
          createDescription: "This is used to map file identifiers to different users of a party. All the existing file types maintained for the party are shown, from which admin can select the file identifiers to be mapped to different users. At any stage it can be modified and new file identifiers can be mapped or existing ones can be unmapped.",
          successful: "Confirmation",
          transactionName: "User File Identifier Mapping",
          successUserFImap: "User - File Identifier mapping maintenance saved successfully.",
          backToDashBoard: "Ok",
          review: "Review",
          reviewSummary: "Make sure the details are correct before you confirm.",
          mappingDetails: "Mapping Summary",
          transactiontype: "Transaction Type",
          description: "Description",
          approvaltype: "Approval Type",
          corporateid: "Party Id",
          corporatename: "Party Name",
          fileIdentifier: "File Identifier",
          noData: "No  file identifier available for mapping. Please create a File Identifier.",
          userMapErrorMsg: "Please select the file identifier to be mapped to the user.",
          pendingStatus: "Pending Approval",
          confirmStatus: "Completed",
          details: "User Map Details",
          senstiveCheck: "Sensitive Data Check",
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
  return new UserMapLocale();
});