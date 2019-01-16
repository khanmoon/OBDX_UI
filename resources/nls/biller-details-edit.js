define(["ojL10n!resources/nls/payments-common"], function(Common) {
  "use strict";
  var BillerDetailsEditLocal = function() {
    return {
      root: {
        billers: {
          reviewHeaderMsg: "You initiated a request for editing Registered Biller. Please review details before you confirm!",
          billeredit: "Edit Biller",
          initiated: "Initiated",
          pendingApproval: "Pending Approval",
          category: "Category",
          billerName: "Biller Name",
          cancel: "Cancel",
          done: "Done",
          pay: "Pay",
          confirm: "Confirm",
          editMessage: "Your biller {billerName} has been edited!",
          relationship1: "Relationship No 1",
          relationship2: "Relationship No 2",
          relationship3: "Relationship No 3",
          review: "Review",
          edit: "Edit",
          save: "Save",
          editsuccess: "Biller Edited Successfully",
          title: "Edit Biller",
          confirmBiller: "Edit Biller",
          sucessfull: "Successful!",
          corpMaker: "You have successfully initiated the transaction.",
          successMessage: "Biller has been deleted."
        },
        generic: Common.payments.generic
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
  return new BillerDetailsEditLocal();
});