define(["ojL10n!resources/nls/generic"], function(Generic, initiateLC) {
  "use strict";
  var DashboardNewLocale = function() {
    return {
      root: {
        generic : Generic,
        initiateLC : initiateLC,
        heading: {
          zigmax: "Zigmax"
        },
        labels: {
          welcome:"Welcome to Zigmax!!",
          zigmax1:"With Zigmax, you can manage your money at one place, even if they are held at other banks.",
          zigmax2:"You can discover, where your money really goes as Zigmax will help you",
          zigmax3:"to comprehensively track your spends across banking relationships.",
          zigmax4:"You are only require to link your savings accounts, checking accounts, credit cards or loan accounts maintained with other banks with Zigmax as one time process.",
          features:"Latest features:",
          linkAccount: "Link Account"
        }
      },
      ar: false,
      en: false,
      "en-us": false
    };
  };
  return new DashboardNewLocale();
});
