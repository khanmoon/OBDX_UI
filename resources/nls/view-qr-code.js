define([], function() {
  "use strict";
  var locale = function() {
    return {
      root: {
        download: "Download",
        share: "Share",
        qrCodeImage: "QR Code Image",
        qrCodeImageOfMerchant: "QR Code Image of the Merchant",
        clickHereToDownload: "Click Here To Download",
        clickHereToShare: "Click Here To Share",
        coudntdownloadImage: "Unable To Download Image",
        coudntloadImage: "Unable To Load Image"
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
  return new locale();
});