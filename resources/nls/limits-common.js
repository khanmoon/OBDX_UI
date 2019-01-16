define([], function() {
  "use strict";
  var OriginationLocale = function() {
    return {
      root: {
        apply: "Apply",
        cancel: "Cancel",
        ok: "Ok",
        done: "Done",
        submit: "Submit",
        confirm: "Confirm",
        edit: "Edit",
        save: "Save",
        currency: "Currency",
        minTxn: "Minimum Transaction Amount",
        maxTxn: "Maximum Transaction Amount",
        cTxn: "Cumulative Transaction Amount",
        limitType: "Limit Type",
        durationType: "Duration Type",
        DUR: "Duration",
        TRAN: "Transaction",
        DAY: "Daily",
        yes: "Yes",
        no: "No",
        value1: "Any Value 1"
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
  return new OriginationLocale();
});