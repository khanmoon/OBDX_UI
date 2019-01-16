define([], function() {
  "use strict";
  var dmsLocale = function() {
    return {
      root: {
        classLabel: "Class Name",
        methodLabel: "Method Name",
        interpreterLabel: "Interpreter",
        monitorLabel: "Monitor",
        invalidFlag: "Enter either Y or N",
        nestingLabel: "Nesting",
        ofTypeLabel: "Of Type",
        filterPlaceholder: "Enter Property Id",
        filterButton: "Filter",
        resetButton: "Reset",
        searching: "Searching...",
        propValueLabel: "Property Value",
        propIdLabel: "Property Id",
        headerLabel: "Property Details",
        editLabel: "Edit",
        ok: "Ok",
        deleteLabel: "Delete",
        updateLabel: "Save Changes",
        cancelLabel: "Cancel",
        resetLabel: "Reset",
        backButton: "Back",
        dialogLabel: "Are you sure you want to delete the property?",
        addLabel: "Save",
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
  return new dmsLocale();
});
