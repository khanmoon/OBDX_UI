define([
  "ojL10n!resources/nls/payments-common"
], function(Common) {
  "use strict";
  var AddbillerMainLocal = function() {
    return {
      root: {
        billers: {
          billeradd: "Biller Registration",
          pendingApproval: "Pending Approval",
          select: "Select",
          cancel: "Cancel",
          add: "Add",
          confirm: "Confirm",
          done: "Done",
          pay: "Pay",
          category: "Category",
          billerName: "Biller Name",
          addMessage: "Biller {billerName} has been added to your billers!",
          sucessfull: "Successful!",
          relationship1: "Relationship No 1",
          relationship2: "Relationship No 2",
          relationship3: "Relationship No 3",
          header: "Add Biller",
          cancelConfirm: "Are you sure you want to cancel the operation?",
          review: "Review",
          successMessage: "Biller added successfully.",
          confirmBiller: "Transaction",
          confirmBillerWithAuth: "Transaction"
        },
        common: Common.payments.common
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
  return new AddbillerMainLocal();
});