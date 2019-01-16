define([], function() {
  "use strict";
  var CallLocale = function() {
    return {
      root: {
        call: {
          labels: {
            callme: "Call Me",
            callmeTitle: "Click to Call me",
            chatnow: "Chat with Me",
            chatnowTitle: "Click to Chat with Me",
            emailus: "Email Us",
            emailusTitle: "Click to Email"
          }
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
  return new CallLocale();
});