define([], function() {
  "use strict";
  var MessagesMerchantLocale = function() {
    return {
      root: {
        merchant: {
          merchantid: "Please enter valid Merchant ID",
          merchantdesc: "Please enter valid Merchant description",
          accounttype: "Please enter valid Account type",
          accountidnumber: "Please enter valid Account ID/number",
          staticurl: "Please enter valid Static URL",
          dynamicurl: "Please enter valid Dynamic URL"
        }
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
  return new MessagesMerchantLocale();
});