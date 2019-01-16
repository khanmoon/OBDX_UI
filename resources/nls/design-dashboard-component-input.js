define([], function () {
  "use strict";
  var ComponentInputLocale = function () {
    return {
      root: {
        "dashboard": {
          "dashboard-quick-links": {
            "type": {
              "name": "Component Type",
              "values": {
                "payments-quick-links": "Payments",
                "quick-access": "Quick Access"
              }
            }
          }
        },
        "personal-finance-management":{
          "spend-summary":{
            "type": {
              "name": "Component Type",
              "values": {
                "cards": "Cards",
                "graph": "Graph"
              }
            }
          }
        },
        "corporateDashboard":{
          "limits-widget":{
            "type": {
              "name": "Component Type",
              "values": {
                "USER": "User",
                "PARTY": "Party"
              }
            }
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
  return new ComponentInputLocale();
});