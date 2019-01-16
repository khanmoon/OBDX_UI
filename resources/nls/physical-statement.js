define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var PhysicalStatement = function() {
    return {
      root: {
        common: {
          successful: "Successful!",
          done: "Done"
        },
        accountActivity: {
          fromDate: "From Date",
          toDate: "To Date",
          accountNumber: "Account Number",
          Statement: "Request Statement",
          physicalStatementRequest: "You will receive the statement at your registered address.",
          cancel: "Cancel",
          request: "Request",
          confirm: "Confirm",
          successMessage: {
            physicalStatementRequest: "Request Statement",
            refNo: "Reference number {refNo}",
            eStatement: "Your have subscribed for eStatement.",
            unsubscribeEStatement: "You have unsubscribe for eStatement."
          }
        },
        generic: Generic
      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
      "en-us": false,
      el: false
    };
  };
  return new PhysicalStatement();
});