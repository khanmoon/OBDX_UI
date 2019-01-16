define(["ojL10n!resources/nls/generic", "ojL10n!resources/nls/theme-labels"], function (Generic, ThemeLabels) {
  "use strict";
  var ReviewThemeLocale = function () {
    return {
      root: {
        generic: Generic,
        heading: ThemeLabels.heading,
        labels: ThemeLabels.labels,
        btns: {
          applyTheme: "Apply Brand",
          update: "Update"
        },
        themeTransaction: "New Brand Create",
        deleteThemeTransaction: "Brand Delete",
        deleteConfirmationMessage: "Are you sure you want to delete an active brand?<br/>Deleting an active brand will revert the application to factory theme.",
        headerName: "Brand Details"
      },
      ar: true,
      fr: true,
      en: false,
      "en-us": false
    };
  };
  return new ReviewThemeLocale();
});