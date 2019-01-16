define([
  "ojL10n!lzn/alpha/resources/nls/origination-generic"
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
        assetValue: "Value",
        ownership: "Share of Asset (%)",
        coAppFillDetails: "Let the co-applicant fill his details",
        allAssets: "Assets",
        noAssets: "No Assets added",
        assetOwnership: "Share of Asset (%)",
        employmentFinancialInfo: "Employment Profile Information",
        employmentFinancialInfoTitle: "Click For Employment Profile Information",
        editAssetInfo: "Click For Editing Assets Information",
        addAssetInfo: "Click For Adding Asset Information",
        addAnotherAssetInfo: "Click For Adding Another Assets Information",
        assetInfoDisclaimer1: "Identify your share of all the assets you hold.",
        assetLabel: "Asset",
        limitExceeded: "You can only add upto {limit} asset records.",
        messages: {
          assetType: "Please select a valid asset type",
          ownership: "Please provide a valid share of asset %",
          ownershipMinError: "Please enter a percentage greater than {min}",
          ownershipMaxError: "Please enter a percentage less than {max}"
        },
        submitAssets: "Click here to Submit Assets Information",
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