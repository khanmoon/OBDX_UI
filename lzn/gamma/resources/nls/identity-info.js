define([
  "ojL10n!lzn/gamma/resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var identityInfoLocale = function() {
    return {
      root: {
        compName: "identity-info",
        ssn: "Social Security Number",
        placeOfIssue: "State of Issue",
        idType: "Type of Identification",
        idNumber: "ID Number",
        idNumberLabel: {
          DLN: "Driver's License Number",
          MCC: "ID Number",
          STI: "ID Number",
          PAS: "Passport Number",
          USM: "ID Number",
          TRI: "ID Number",
          CDL: "Driver's License Number",
          MDL: "Driver's License Number"
        },
        placeOfIssueLabel: {
          DLN: "State of Issue",
          STI: "State of Issue",
          PAS: "Country of Issue",
          USM: "State of Issue",
          TRI: "State of Issue",
          CDL: "Canadian Province of Issue",
          MDL: "Mexican State of Issue"
        },
        expiryDate: "Expiration Date",
        issueDate: "Issue Date",
        ssnformat: "xxx-xx-xxxx",
        SSNClick: "Click For Social Security Number",
        SSNClickInfo: "Click For SSN Info",
        SSNtext: "We need your Social Security Number to verify your identity and to acquire credit history to process your application.",
        messages: {
          type: "Please select an identification type",
          number: {
            DLN: "Please enter a valid Driver's License Number",
            MCC: "Please enter a valid ID Number",
            STI: "Please enter a valid ID Number",
            PAS: "Please enter a valid Passport Number",
            USM: "Please enter a valid ID Number",
            TRI: "Please enter a valid ID Number",
            CDL: "Please enter a valid Driver's License Number",
            MDL: "Please enter a valid Driver's License Number"
          },
          citizenship: "Please define your citizenship",
          ssn: "Please enter a valid social security number number",
          expiryDateError: "Expiration date cannot be greater than {expdate}",
          issueDateError: "Issue date cannot be greater than {issuedate}",
          expiryDaterange: "Enter date between",
          validExpiryDate: "Please enter a valid expiration date",
          validIssueDate: "Please enter a valid issue date",
          placeOfIssue: "Please select a place of issue",
          confirmEmail: "Please confirm your email ID",
          idNumberError: "Please enter a valid ID Number"
        },
        submitIdentity: "Click here to submit identity information",
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
  return new identityInfoLocale();
});
