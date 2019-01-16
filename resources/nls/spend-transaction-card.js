define(
  [],
  function() {
    "use strict";
    var SpendTransactionCard = function() {
      return {
        root: {

          categorizedTransaction: {
            recategorize: "Edit",
            split: "Split",
            menu: "Menu"
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
    return new SpendTransactionCard();
  }
);