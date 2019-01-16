define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var ReviewDemandDraft = function() {
    return {
      root: {
        demandDraft: {
          ddHeader: "International Demand Draft Details",
          favouring: "Favouring",
          transferon: "Transfer On",
          addeditpayee: "Add/edit Payees",
          addpayee: "Add Payee",
          name: "Name",
          address: "Address",
          country: "Country",
          city: "City",
          postalcode: "Postal Code",
          now: "Now",
          later: "Later",
          deliverymode: "Delivery Mode",
          scheduledon: "Scheduled On",
          amount: "Amount",
          description: "Description",
          payableat: "Payable At",
          transferfrom: "Transfer From",
          reviewdemanddraft: "Review",
          balance: "Balance",
          "confirm-msg": "Demand Draft of {amount} has been issued to {name}, {address}",
          verification: "Verification",
          "verification-msg": "A verification code has been sent to your registered mobile number.\nPlease enter that code below to complete the process",
          verificationcode: "Verification code",
          resendcode: "Resend Code",
          "resendcode-msg": "Didn't get the code?",
          "invalid-code": "Wrong verification code. Try again",
          note: "Note",
          BRN: "Branch Near Me",
          MAI: "My Address",
          reviewHeaderMsg: "You initiated a request for International Demand Draft. Please review details before you confirm!"
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
  return new ReviewDemandDraft();
});