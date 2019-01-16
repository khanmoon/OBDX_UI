define([
  "ojL10n!lzn/gamma/resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var orientationLocale = function() {
    return {
      root: {
        compName: "asset-info",
        asset: "Asset {index}",
        primaryAsset: "Primary Asset",
        additionalAsset: "Additional Asset",
        addAsset: "Add an Asset",
        addAnotherAsset: "Add another Asset",
        assetType: "Type of Asset",
        assetValue: "Value",
        ownership: "Share of Asset (%)",
        coAppFillDetails: "Let the co-applicant fill his details",
        allAssets: "Assets",
        noAssets: "No Assets added",
        assetOwnership: "Share of Asset (%)",
        messages: {
          assetType: "Please select a valid asset type",
          ownership: "Please provide a valid share of asset %",
          ownershipMinError: "Please enter a percentage greater than {min}",
          ownershipMaxError: "Please enter a percentage less than {max}"
        },

        generic: Generic
      },
      "ar": true,
      "fr": true,
      "cs": true,
      "sv": true,
      "en": false,
      "en-us": false,
      "el": true
    };
  };
  return new orientationLocale();
});
