define([], function() {
  "use strict";
  var informationmessagesLocale = function() {
    return {
      root: {
        userLocaleLabel: "User Locale",
        infoCodeLabel: "Info Code",
        infoMsgLabel: "Info Message",
        factoryFlagLabel: "Factory Shipped flag",
        invalidFlag: "Enter either Y or N",
        summaryLabel: "Summary Text",
        addLabel: "Save",
        infoFilterPlaceholder: "Enter Message code",
        filterButton: "Filter",
        resetButton: "Reset",
        searching: "Searching...",
        ok: "Ok",

        editLabel: "Edit",
        backLabel: "Back",
        deleteLabel: "Delete",
        updateLabel: "Save Changes",
        cancelLabel: "Cancel",
        resetLabel: "Reset",
        infoDialogLabel: "Are you sure you want to delete the Info code?",
        confirm: "Confirm",
        confirmation: "Confirmation"

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
  return new informationmessagesLocale();
});
