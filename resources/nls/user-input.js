define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var UserInputLocale = function() {
    return {
      root: {

        common: {

          placeholder: {
            pleaseSelect: "Please Select",
            selectUser: "Select User",
            Empty: "This field cannot be empty"
          },
          user: "User",
          userGroup: "User Group"

        },
        userInput: {
          user: "User",
          userGroup: "User Group",
          userName: "{firstName} {lastName} ({userName})"

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
  return new UserInputLocale();
});