define([], function() {
  "use strict";

  var UserLoginConfigurationLocale = function() {
    return {
      root: {
        pageTitle: {
          header: "User Login Flow"
        },
        fieldname: {
          agree: "I agree to the terms and conditions.",
          line1: "Thank You for choosing Zig Bank as your Banking needs partner.",
          line2: "We welcome you to the Zig Bank family.",
          line3: "Happy Banking!!!"
        },
        buttons: {
          search: "Search",
          acceptButton: "Accept"
        },
        messages: {
          agreeButtonNotSelected: "Please accept the terms and conditions"
        }
      },
      ar: false,
      en: false,
      "en-us": false
    };
  };

  return new UserLoginConfigurationLocale();
});
