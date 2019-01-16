define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var RegisterBillerErrorLocale = function() {
    return {
      root: {
        generic : Generic,
        labels: {
          viewLimits : "View Limits",
          mylimits : "My Limits",
          channel : "Channel",
          showInformation: "Select channel to view its limits",
          pleaseSelect:"Please Select"
        },
        validationErrors: {
          invalidNickname: "Nickname can comprise alphanumerics (A-Z any case, 0-9)&,/,-\"space",
          uniqueNickname: "{nickname} is already in use. Please give a different nickname.",
          invalidCustName: "Customer Name can comprise alphanumerics (A-Z any case, 0-9)&,/,-\"space",
          invalidAmountErrorMessage: "Amount should be greater than 0",
          amountError: "Amount should be lesser than 1 trillion",
          invalidpartPaymentErrorMessage: "Modified  amount can not exceed the original bill amount",
          invalidexcessPaymentErrorMessage: " Modified  amount can not be less than the original bill amount",
          ALPHANUMERIC: "Please enter  the details in the alphanumric format",
          NUMERIC: "Please enter  the details in the numeric format",
          TEXT: "Please enter  the details in the text format",
          OTHERS: "Please enter valid data",
          invalidDateErrorMessage: "Scheduled payment date can not be beyond the due date of the bill",
          invalidStartDate : "Scheduled payment Start date cannot be less than {currentDate}",
          invalidEndDate : "Scheduled payment End date cannot be less than {startDate}"
        }
      },
      ar: false,
      en: false,
      "en-us": false
    };
  };
  return new RegisterBillerErrorLocale();
});
