define([], function() {
  "use strict";
  var CategoryConfigLocale = function() {
    return {
      root: {
        configuration: {
          categories: {
            OriginationConfig: "Origination",
            EMailConfiguration: "Email",
            MaskingPattern: "Masking pattern configuration",
            Masking: "Type of masking",
            calculatorconfig: "Calculator",
            fileuploadconfig: "File upload",
            reportconfig: "Report configuration",
            mobileconfig: "Mobile configuration"

          }
        }

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
  return new CategoryConfigLocale();
});