define([], function() {
  "use strict";

  var SecurityQuestionsOptionLocale = function() {
    return {
      root: {
        pageTitle: {
          header: "Security Questions Option"
        },
        fieldname: {
          securityHeading: "User Security Question",
          securityText: "Security questions may be used as second level of authentication for completing your transactions. These questions can be set up later from the menu options. Do you want to set them up now?"
        },
        buttons: {
          set: "Set Now",
          skip: "Skip"
        }
      },
      ar: false,
      en: false,
      "en-us": false
    };
  };

  return new SecurityQuestionsOptionLocale();
});