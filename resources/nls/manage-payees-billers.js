define([], function() {
  "use strict";
  var ManagePayeesBillers = function() {
    return {
      root: {

        labels: {
          manage: "Manage Whom",
          payeetype: "Payee Type",
          payees: "Payees",
          billers: "Billers",
          accpayee: "Account Payee",
          draftpayee: "Draft Payee"
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
  return new ManagePayeesBillers();
});