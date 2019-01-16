define([
  "ojL10n!lzn/alpha/resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var cardAddonLocale = function() {
    return {
      root: {
        heading: "Add-On Card Holders",
        heading2: "You may add up to {noOfAddOns} additional card holders.",
        heading3: "The primary card holder will be responsible for all transactions including interest and fees changes.",
        choice: "Add an Add-On Card Holder",
        isAddressSameAsPrimary: "Address is same as primary applicant’s",
        addOn: "Add-On Card Holder {index}",
        addAnotherCard: "Add another Add-On Card Holder",
        reviewAddress: "{line1}, {line2}, {city} {state} {country} {zip}",
        reviewAddress2: "{line1}, {city} {state} {country} {zip}",
        salutation: "Salutation",
        name: "Name",
        middleNameOptional: "Middle Name <br>(optional)",
        optional: "(optional)",
        salFirstLast: "{salutation} {firstName} {lastName}",
        salFirstMiddleLast: "{salutation} {firstName} {middleName} {lastName}",
        salFirstMiddleLastSuffix: "{salutation} {firstName} {middleName} {lastName} {suffix}",
        salFirstLastSuffix: "{salutation} {firstName} {lastName} {suffix}",
        firstName: "First Name",
        middleName: "Middle Name",
        lastName: "Last Name",
        dateOfBirth: "Date of Birth",
        gender: "Gender",
        maritalStatus: "Marital Status",
        noOfDependents: "Number of Dependents",
        accomodationType: "Accommodation Type",
        email: "Email",
        stayingSince: "Staying Since",
        address: "Address",
        resAddr: "Residential Address",
        previousAddress: "Previous Address",
        suffix: "Suffix",
        countryOfCitizenship: "Citizenship",
        citizenshipRequirement: "We need your citizenship information to determine eligibility for our products and also to comply with the USA PATRIOT Act.",
        countryClick: "Country",
        countryClickTitle: "Click For Country",
        isPermanentResident: "Permanent Resident",
        permanentRes: "Permanent Resident",
        countryOfResidence: "Country of Residence",
        countryOfCitizenshipClick: "Click For Citizenship",
        removeCardClickTitle: "Click To Remove Card",
        removeCardClick: "Remove Card",
        poBoxes: "(P.O. Boxes are not allowed)",
        prevResAddr: "Previous Residential Address",
        generic: Generic,
        messages: {
          salutation: "Please select a salutation",
          maritalStatus: "Please select a marital status",
          dependants: "Please select the number of dependants",
          firstName: "Please enter a valid first name",
          lastName: "Please enter a valid last name",
          name: "Please enter a valid name",
          dob: "Please enter a valid date of birth",
          accomodationType: "Please select an accommodation type",
          stayingSince: "Please enter a valid date",
          citizenship: "Please select your country of citizenship",
          residentCountry: "Please select your country of residence"
        }
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
  return new cardAddonLocale();
});