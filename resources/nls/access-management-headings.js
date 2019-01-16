define([], function() {
  "use strict";
  var AccessManagementHeadingLocale = function() {
    return {
      root: {
        details: "Details",
        editAccountMapping: "Edit Account Mapping",
        mappedAccounts: "Mapped Accounts",
        unMappedAccounts: "Unmapped Accounts",
        cpNotExist: "Party Preference Does Not Exist. Do you want to create it now?",
        createPreference: "Create Preferences",
        disableConfirm: "Are you sure you want to disable?",
        enableConfirm: "Are you sure you want to enable?",
        deleteConfirm: "Are you sure you want to delete?",
        accntNum: "A/C Number",
        accntName: "A/C Name",
        NumberOfAccounts: "Number of accounts",
        NumberOfMAppedAccounts: "Number Of mapped accounts",
        currency: "Currency",
        accntNumber: "Account Number",
        accountName: "Account Name",
        userList: "Search Results",
        mapAllTransactionToAllAccnts: "Map All Transactions to All Accounts",
        mapAllTransactions: "Map All Transactions",
        payment: "Payment",
        internal: "Internal",
        domestic: "Domestic",
        international: "International",
        sepa: "sepa",
        ownAcc: "Own Account",
        repeatTransfer: "Repeat Transfer",
        billPay: "Bill Payment",
        bulkUploads: "Bulk Uploads",
        fileUpload: "File Upload",
        fileView: "File View",
        reqCheqBook: "Request Cheque Book",
        stopCheq: "Stop/Unblock Cheque",
        savedSuccessfully: "Account-Transaction Mapping saved successfully.",
        successful: "successful."
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
  return new AccessManagementHeadingLocale();
});