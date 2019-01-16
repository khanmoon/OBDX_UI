define([], function(Formats, Messages) {
  "use strict";
  var ConfigLocale = function() {
    return {
      root: {
        configuration: {
          categories: {
            header: "System Configuration",
            filterButton: "Filter",
            resetButton: "Reset",
            selectCategory: "You must select a Category",
            subCategory: "Sub-Category"

          }
        },
        backButton: "Back",
        formats: Formats,
        messages: Messages,
        INDIRECTION_description: "Indirected Values for sensitive data such as account numbers, Customer ID etc.",
        ERROR_description: "Error code and Error message configuration based on user locale.",
        INFORMATIONMESSAGES_description: "Provides Information messages property based on user locale.",
        WEBSERVICES_description: "Properties related to Outbound Web Services configuration parameter.",
        VARIABLE_description: "Enables Configuration property for different application environment.",
        DMS_description: "Property for dynamic monitoring interpreter to monitor host adapter calls.",
        BASE_description: "Properties for different categories such as adapter, repositories, masking, extension etc."
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
  return new ConfigLocale();
});
