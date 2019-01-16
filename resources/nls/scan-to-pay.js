define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";
  var scanToPay = function() {
    return {
      root: {
        header: "Scan To Pay",
        scanQRCodeToPay: "Scan QR code To Pay",
        invalidQRCode: "Invalid QR Code",
        transferTo: "Transfer To",
        transferFrom: "Transfer From",
        amount: "Amount",
        notes: "Notes (Optional)",
        invalidQRCodePopupMessage: "QR code scanned is not valid, do you wish to scan another code?",
        viewlimits: "View Limits",
        viewlimitsTitle: "View Limits",
        mylimits: "My Limits",
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
  return new scanToPay();
});