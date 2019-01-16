define([], function() {
  "use strict";
  var errormessagesLocale = function() {
    return {
      root: {
        categoryHeading: "Category Id : {categoryId}",
        addLabel: "Save",
        userLocaleLabel: "User Locale",
        errorCodeLabel: "Error Code",
        errorMsgLabel: "Error Message",
        noErrorMsgFound: "No Error messages found",
        errorDialogLabel: "Are you sure you want to delete the error code?",
        factoryFlagLabel: "Factory Shipped flag",
        invalidFlag: "Enter either Y or N",
        summaryLabel: "Summary Text",
        ok: "Ok",
        filterPlaceholderForError: "Enter Error Code",
        filterButton: "Filter",
        resetButton: "Reset",
        searching: "Searching...",
        editLabel: "Edit",
        deleteLabel: "Delete",
        updateLabel: "Save Changes",
        cancelLabel: "Cancel",
        resetLabel: "Reset",
        backButton: "Back",
        hidePropAlt: "Property details hidden",
        hidePropTitle: "Click to hide Property details",
        showPropAlt: "Property details shown",
        showPropTitle: "Click to view Property details",
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
  return new errormessagesLocale();
});
