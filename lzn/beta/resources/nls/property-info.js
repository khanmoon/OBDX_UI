define([
  "ojL10n!lzn/beta/resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var propertyInfoLocale = function() {
    return {
      root: {
        propertyInfo: "Property Information",
        propertyDetails: "Property Details",
        ownershipType: "Ownership Type",
        single: "Single",
        joint: "Joint",
        ownersOfTheProperty: "Owners of the Property",
        typeOfTheProperty: "Type of Property",
        subTypeOfTheProperty: "Sub-Type",
        purchasePrice: "Purchase Price",
        addressOfTheProperty: "Address of the Property",
        primaryPlaceOfResidence: "Is this your primary place of residence?",
        reviewAddress: "{line1}, {line2}, {city}",
        reviewAddress2: "{line1}, {city}",
        reviewAddressStateZip: "{state} {zip}",
        reviewAddressCountryZip: "{state} {country} {zip}",
        reviewPhoneNumber: "{contactType}: {number}",
        propertyInfoSubmit: "Click here to submit Property information",
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
  return new propertyInfoLocale();
});