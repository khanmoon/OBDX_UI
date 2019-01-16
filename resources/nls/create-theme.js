define(["ojL10n!resources/nls/generic", "ojL10n!resources/nls/theme-labels"], function (Generic, ThemeLabels) {
  "use strict";
  var CreateThemeLocale = function () {
    return {
      root: {
        update: "Update",
        fileInvalid: "No file selected for upload",
        reset: "Reset",
        fileSelection: "File selected: {fileName}",
        navBarDescription: "Color Selection Method",
        themeTransaction: "New Brand Creation",
        updateTransaction: "Brand Update",
        generic: Generic,
        heading: ThemeLabels.heading,
        labels: ThemeLabels.labels
      },
      ar: false,
      fr: false,
      en: false,
      "en-us": false
    };
  };
  return new CreateThemeLocale();
});