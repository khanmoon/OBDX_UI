define([], function() {
  "use strict";
  var SIlanding = function() {
    return {
      root: {

        labels: {
          silist: "View Standing Instructions",
          sicreate: "Setup Standing Instruction",
          option: "Options"
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
  return new SIlanding();
});