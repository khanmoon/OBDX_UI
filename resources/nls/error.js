define([], function() {
  "use strict";
  var ErrorPageLocale = function() {
    return {
      root: {
        code: "Sorry, an error has occured. Please login again",
        error: "Possible Causes :",
        message: "Your Session has expired",
        message2: "You are trying to access a page that does not exist"
      },
      ar: false,
      fr: true,
      cs: false,
      sv: false,
      en: false,
      "en-us": false,
      el: false
    };
  };
  return new ErrorPageLocale();
});