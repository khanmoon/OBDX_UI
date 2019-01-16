define([
    "ojL10n!lzn/alpha/resources/nls/origination-generic"
  ],
  function(Origination) {
    "use strict";
    var identityInfoLocale = function() {
      return {
        root: {
          ssn: "Social Security Number",
          placeOfIssue: "Place of Issue",
          countryOfIssue: "Country of Issue",
          idType: "Type of Identification",
          idNumber: "ID Number",
          passportNumber: "Passport Number",
          expiryDate: "Expiration Date",
          dateOfIssue: "Date of Issue",
          ssnformat: "xxx-xx-xxxx",
          taxIdType: "Tax Identification Type",
          taxFileNumber: "Tax File Number",
          taxExemptionCode: "Tax Exemption Code",
          addAnotherIdentification: "Add Another Identification",
          identifications: "Identifications",
          add: "Add",
          primaryIdentification: "Primary Identification",
          additionalIdentification: "Additional Identification",
          noA: "Not Available",
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
            countryOfIssue: "Please select a country  of Issue",
            taxIdType: "Please select a tax identification type",
            taxFileNumber: "Please enter a valid tax file number",
            taxExemptionCode: "Please select a taxt exemption code",
            tFNLength: "Please enter 9 digit number",
            validTFN: "Please enter a valid Tax File Number"
          },
          alt: {
            addAnotherIdentification: "Click here to add another identification",
            deleteIdentityClick: "Click here to delete identity",
            editIdentityClick: "Click here to edit identity"
          },
          title: {
            addAnotherIdentification: "Click here to add another identification",
            deleteIdentityClick: "Click here to delete identity",
            editIdentityClick: "Click here to edit identity"
          },
          ariaLabel: {
            identifications: "Identifications"
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
