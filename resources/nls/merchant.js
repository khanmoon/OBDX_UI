define([
  "ojL10n!resources/nls/messages-merchant",
  "ojL10n!resources/nls/generic"
], function(Messages, Generic) {
  "use strict";
  var TransactionLocale = function() {
    return {
      root: {
        merchant: {
          header: "Merchant Management",
          createMerchantConfirm: "Merchant Maintenance",
          deleteMerchantConfirm: "Merchant Maintenance",
          editMerchantConfirm: "Merchant Maintenance",
          merchant_header: "Merchant Onboarding",
          merchantid: "Merchant Id",
          merchantdesc: "Merchant Description",
          accounttype: "Account Type",
          accountidnumber: "Account Number",
          successfultransactions: "Successful Transactions",
          failedtransactions: "Failed Transactions",
          staticurl: "Static URL",
          dynamicurl: "Dynamic URL",
          casa: "Current and Savings",
          successmsg: "Your updates regarding Merchant management have been saved.",
          none: "None",
          checksumAlgorithm: "Checksum Algorithm",
          securityKey: "Security Key",
          securitykeyvalidationmsg: "Security key length must be 16",
          checksumtype: "Checksum Type",
          deleteaccount: "Are you sure you want to delete merchant {name}?",
          deleteaccountsuccess: "Delete request of merchant {name}",
          branch: "Branch",
          accounts: "Accounts",
          alt: "Click here for more Details",
          title: "Click here for more Details",
          questionText: "Are you sure you want to cancel Merchant Creation?",
          list: "Merchant List Details",
          creditAccountDetails: "Credit Account Details",
          serviceCharge: "Service Charge Account Details",
          commissionAccountFlag: "Define another account for service charge",
          "userAccountFlag": "Default customer's debit account number as request parameter",
          responseRedirections: "Response Redirections",
          checksumDetails: "Checksum Details",
          message: "Please enter valid description",
          initiateHeader: "You initiated merchant management. Please review details before you confirm!"
        },
        common: {
          select: "Select",
          save: "Save",
          cancel: "Cancel",
          view: "View",
          create: "Create",
          edit: "Edit",
          search: "Search",
          done: "Done",
          back: "Back",
          review: "Review",
          success: "Successful!",
          delete: "Delete",
          ok: "Ok",
          confirm: "Confirm",
          clear: "Clear"
        },
        qrCode: "QR Code",
        clickHereForQrCode: "Click Here For QR Code",
        messages: Messages,
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
  return new TransactionLocale();
});