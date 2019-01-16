define([], function() {
  "use strict";
  var MailBoxLogLocale = function() {
    return {
      root: {
        mailBoxDetails: {
          labels: {
            msgText: "New Messages in your mail box",
            msFooterText: "View all messages"
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
  return new MailBoxLogLocale();
});