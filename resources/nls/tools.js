define([], function() {
  "use strict";
  var ToolsLocale = function() {
    return {
      root: {
        tools: {
          labels: {
            tools: "Tools",
            fxRateConverter: "Forex Rate Converter",
            content: "Contents goes here....",
            inquiries: "Inquiries",
            loanRateCalculator: "Loan Rate Calculator",
            depositsCalculator: "Deposits Calculator",
            serviceRequests: "Service Requests"
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
  return new ToolsLocale();
});