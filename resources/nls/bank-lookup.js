define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var BankLookupLocale = function() {
    return {
      root: {
        stateError: "Enter a valid state",
        invalidcity: "Enter a valid city",
        invalidBankName : "Enter a valid bank name",
        invalidCode : "Please enter valid code",
        enterAnyOne : "Please enter any one",
        select : "Please Select",
        bankName: "Bank Name",
        ifscCode: "IFSC Code",
        swiftCode: "SWIFT Code",
        bicCode: "BIC Code",
        ncc: "NCC Code",
        sortCode: "Sort Code",
        searchIfsc: "Search IFSC Code",
        searchSwift: "Search SWIFT Code",
        searchBic: "Search BIC Code",
        searchSort: "Search Sort Code",
        searchNCC: "Search National Clearing Code",
        codeType: "NCC Type",
        bankCodeSubmit: "Submit bank code",
        bankCodeSubmitTitle: "Click to Submit bank code",
        branch: "Branch",
        address: "Address",
        bankCode: "Bank Code",
        state: "State",
        city: "City",
        bank: "Bank",
        country: "Country",
        lookupdatatable : "Bank lookup data",
        generic: Generic
      },
      ar: false,
      fr: true,
      cs: false,
      sv: false,
      en: false,
      "en-us": false,
      el: false
    };
  };
  return new BankLookupLocale();
});