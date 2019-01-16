define([

  "ojL10n!resources/nls/payments-common"
], function(Common) {
  "use strict";
  var PaymentPeerToPeer = function() {
    return {
      root: {
        txnname: "Peer to peer transfer",
        transferto: "Transfer To",
        amount: "Amount",
        transferfrom: "Transfer From",
        note: "Note",
        payvia: "Pay via",
        transfermode: {
          FACEBOOK: "Facebook",
          EMAIL: "Email",
          MOBILE: "Mobile"
        },

        common: Common.payments.common,
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
  return new PaymentPeerToPeer();
});