define(["ojL10n!resources/nls/generic",
  "ojL10n!resources/nls/payments-common"

], function(Generic, Common) {
  "use strict";
  var CreateFundRequest = function() {
    return {
      root: {
        createFundRequest: {
          selectFriends: "Select Friends",
          title: "Title",
          pleaseSelect: "Please Select",
          split: "Split",
          enterEmail: "enter email or mobile",
          note: "Notes",
          splitBetween: "Split Between",
          transferAmount: "Amount",
          save: "Save",
          cancel: "Cancel",
          emailValidation: "Invalid Email",
          posted: "Posted",
          initiated: "Initiated",
          equally: "Equally",
          percentage: "Percentage",
          invalidError: "Total amount given not equal to the amount to be distributed"

        },
        generic: Generic,
        common: Common.payments.common
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
  return new CreateFundRequest();
});
