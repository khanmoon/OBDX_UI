define([], function() {
  "use strict";
  var LocationSearchLocale = function() {
    return {
      root: {
        pageTitle: {
          locationCreate: "Adding Location"
        },
        fieldname: {

          select: "Select",
          id: "Search by ATM/Branch ID",
          atm: "ATM",
          branch: "Branch"
        },
        buttons: {
          cancel: "Cancel",
          clear: "Clear",
          search: "Search"
        }
      },
      ar: false,
      en: false,
      "en-us": false
    };
  };
  return new LocationSearchLocale();
});