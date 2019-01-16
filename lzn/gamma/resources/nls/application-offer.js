define([
  "ojL10n!lzn/gamma/resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var applicationOfferLocale = function() {
    return {
      root: {
        negotiate: "Negotiate",
        offerAccept: "Offer Letter Acceptance",
        tnc1: "I, {firstName} {lastName} hereby confirm that I have read and understood the Terms & Conditions of the offer document.",
        tnc2: "I hereby confirm that my co-applicant, has read and understood the Terms & Conditions of the offer document.",
        tnc3: "I, {firstName} hereby confirm that I have read and understood the Terms & Conditions of the offer document.",
        reject: "Reject",
        accept: "Accept",
        offer: "Offer",
        noOffer: "Offer generation pending",
        alreadyAccepted: "The offer has been accepted",
        alreadyRejected: "The offer has been rejected",
        success: "Done",
        error: "Error",
        offerContainerClick: "Click For Offer Container",
        acceptSuccess: "You have accepted the offer",
        rejectSuccess: "You have rejected the offer",
        cancelApplicationModalBtnText: "Cancel Application",
        ok: "Ok",
        return: "Return to Tracker",
        back: "Back",
        errorContacting: "There was an error contacting the server",
        onlyPrimary: "Note: Only primary applicant can accept or reject the offer",
        decisionLetter: "Offer Letter",
        messages: {
          offerAcceptenceError: "Unable to process the application. Please contact the bank.",
          offerRejectionError: "Unable to process the application. Please contact the bank."
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
  return new applicationOfferLocale();
});