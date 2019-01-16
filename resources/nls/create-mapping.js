define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var CreateMappingLocale = function() {
    return {
      root: {
        generic: Generic,
        heading: {
          create: "Create Mapping",
          colors: "Colors"
        },
        update: "Update",
        labels: {
          mappingType: "Mapping Type",
          mappingValue: "Mapping Value",
          brand: "Brand"
        },
        entities: {
          USER: "User",
          PARTY: "Party",
          ROLE: "Role",
          BANK: "Entity"
        },
        navBarDescription: "Color Selection Method",
        brandList: "{brandName} - {brandId}",
        mappingTransaction: "Brand Mapping",
        updateTransaction: "Brand Update",
        selectMapping: "Select Mapping Type",
        selectBrand: "Select Brand",
        partySearch: "Party Search",
        userWarning:"Invalid User"
      },
      ar: false,
      en: false,
      "en-us": false
    };
  };
  return new CreateMappingLocale();
});