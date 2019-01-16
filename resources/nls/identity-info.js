define([
    "ojL10n!resources/nls/origination-generic"
  ],
  function(Origination) {
    "use strict";
    var identityInfoLocale = function() {
      return {
        root: {
          ssn: "Social Security Number",
          placeOfIssue: "State of Issue",
          countryOfIssue: "Country of Issue",
          idType: "Type of Identification",
          idNumber: "ID Number",
          passportNumber: "Passport Number",
          expiryDate: "Expiration Date",
          dateOfIssue: "Date of Issue",
          ssnformat: "xxx-xx-xxxx",
          messages: {
            type: "Please select an identification type",
            number: "Please enter a valid identification number",
            citizenship: "Please define your citizenship",
            ssn: "Please enter a valid social security number",
            expiryDateError: "Expiration date cannot be greater than {expdate}",
            expiryDaterange: "Enter date between {startDate} and {endDate}",
            validExpiryDate: "Please enter a valid expiration date",
            dateOfIssue: "Please enter a valid date of Issue",
            placeOfIssue: "Please select a place of issue",
            countryOfIssue: "Please select a country  of Issue"
          },
          submitIdentity: "Submit Identity Information",
          origination: Origination
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
    return new identityInfoLocale();
  });