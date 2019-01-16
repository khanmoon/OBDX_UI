define([
  "ojL10n!resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var orientationLocale = function() {
    return {
      root: {

        asset: "Asset {index}",
        primaryAsset: "Primary Asset",
        additionalAsset: "Additional Asset",
        addAsset: "Add an Asset",
        addAnotherAsset: "Add another Asset",
        assetType: "Type of Asset",
        asssetValue: "Value (Currency)",
        ownership: "Share of Asset (%)",
        coAppFillDetails: "Let the co-applicant fill his details",
        allAssets: "Assets",
        deleteAssetInfoClick: "Delete Asset information",
        deleteAssetInfoClickTitle: "Click For Delete Asset information",
        editAssetInfoClick: "Click For Edit Asset Information",
        addAssetInfoClick: "Click For Adding Asset Information",
        addAnotherAssetInfoClick: "Click For Adding Asset Another Information",
        noAssets: "No Assets added",
        assetValue: "Value",
        messages: {
          assetType: "Please select a valid asset type",
          ownership: "Please provide a valid share of asset %",
          ownershipMinError: "Please enter a percentage greater than {min}",
          ownershipMaxError: "Please enter a percentage less than {max}"
        },

        generic: Generic
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
  return new orientationLocale();
});