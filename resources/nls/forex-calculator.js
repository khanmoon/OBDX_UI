define([], function() {
  "use strict";
  var ForexCalculatorLocale = function() {
    return {
      root: {
        forexCalculator: {
          forex_calculator: "Forex Calculator",
          forex_calculator_title: "Forex Calculator",
          from: "From",
          to: "To",
          note: "* Conversion rates are based on mid rate for<br/>Funds Transfer",
          rateDescription: "@ 1 {buyCurrency} = {exchangeRate} {sellCurrency}",
          currencyforeignError: "You must select a foreign currency",
          currencylocalError: "You must select a local currency",
          amountError: "You must enter some amount",
          foreign_placeHolder: "Foreign Currency",
          local_placeHolder: "Local Currency",
          foreign_amount: "Amount",
          localAmount: "Amount",
          foreignCurrency: "Currency",
          convert: "Convert",
          refreshTitle: "Click to Refresh",
          seeAll: "See all frequently asked questions",
          reason: "Reason",
          currency: "Currency",
          backToDashboard: "Back To Dashboard",
          back: "Back",
          returns: "Amount: <span class=\"calculated-amount\">{calculatedAmount}</span>",
          calculateRate: "Calculate Rate",
          currentRateInfo: "@ 1 {currencyForeignStr} = {showCurRate} {currencyLocalStr}"
        }
      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
      "en-us": false,
      el: false
    };
  };
  return new ForexCalculatorLocale();
});