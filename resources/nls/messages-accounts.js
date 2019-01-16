define([], function() {
  "use strict";
  var MessagesAccountsLocale = function() {
    return {
      root: {
        address: {
          country: "Please select country",
          state: "Please select state",
          invalidCity: "Please specify a valid city",
          city: "Please select city",
          branch: "Please select branch",
          zipcode: "Please enter a valid zipcode",
          addressType: "Please Select Address Type",
          selectCity: "Select City",
          selectBranch: "Select Branch",
          selectAddress: "Select Address"
        },
        transactions: {
          select: "Please Select",
          specifyReason: "Please Select Reason",
          specifyChequeNumber: "Enter Valid Cheque Number"
        },
        invalidAmount: "Please enter valid amount"
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
  return new MessagesAccountsLocale();
});