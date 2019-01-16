define([
  "ojL10n!lzn/beta/resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var accountHolderLocale = function() {
    return {
      root: {
        compName: "address",
        ziplabel: "(First 5 digits are required)",
        reviewAddress: "{line1}, {line2}, {city} {state} {zip}",
        reviewAddress2: "{line1}, {city} {state} {zip}",
        reviewPhoneNumber: "{contactType}: {number}",
        country: "Country",
        state: "State",
        city: "City",
        zipCode: "Zip Code <br>(First 5 digits are required)",
        address1: "Address Line 1",
        address2: "Address Line 2 <br>(optional)",
        stayingSince: "Staying Since",
        optional: "(optional)",
        streetAddress: "Street Address",
        aptNo: "Apartment/Suite Number",
        aptNoPattern: "[a-zA-Z0-9\- \#\.\,]*",
        messages: {
          country: "Please select a country",
          state: "Please select a state",
          invalidCity: "Please enter a valid city",
          city: "Please enter a valid city",
          zipcode: "Please enter a valid zipcode",
          address: "Please enter valid address details"
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
  return new accountHolderLocale();
});