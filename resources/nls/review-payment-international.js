define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var ReviewPaymentInternational = function() {
    return {
      root: {
        paymentDetails: {
          internationalHeader: "International Fund Transfer Details",
          transferto: "Transfer To",
          amount: "Amount",
          transferon: "Transfer When",
          frequency: "Transfer Frequency",
          startTransfer: "Start Transferring",
          stopTransfer: "Stop Transferring",
          transferfrom: "Transfer From",
          purpose: "Purpose",
          note: "Note",
          correspondencecharges: "Correspondence Charges",
          paymentdetails: "Payment Details",
          instances: "Instances",
          intaccountType: "International",
          accountType: "Account Type",
          accountNumber: "Account Number",
          accountName: "Account Name",
          accountBranch: "Account Branch",
          reviewHeaderMsg: "You initiated a request for International Transfer. Please review details before you confirm!"
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
  return new ReviewPaymentInternational();
});