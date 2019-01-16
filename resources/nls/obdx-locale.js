define([], function() {
  "use strict";
  var OBDXLocale = function() {
    return {
      root: {
        messages: {
          ACCOUNT: "Please enter valid account number",
          NAME: "Please enter valid name",
          TENURE_MONTHS: "Please enter valid months",
          TENURE_YEARS: "Please enter valid years",
          TENURE_DAYS: "Please enter valid days",
          REFERENCE_NUMBER: "Please enter valid reference number",
          CITY: "Please enter valid city name",
          IBAN: "Please enter valid account number",
          DEBTOR_IBAN: "Please enter valid iban number",
          COMMENTS: "Invalid comments",
          PARTY_ID: "Please enter valid party ID",
          MESSAGE: "Invalid Message",
          PIN: "Invalid Pin",
          CVV: "Invalid CVV number",
          ONLY_NUMERIC: "Please enter only numeric values",
          ONLY_SPECIAL: "Please enter only special characters",
          BANK_CODE: "Invalid bank code",
          BANK_NAME: "Invalid bank Name",
          CHEQUE_NUMBER: "Invalid cheque number",
          EMAIL: "Invalid email",
          MOBILE_NO: "Invalid mobile number",
          IFSC_CODE: "Invalid ifsc code",
          ADDRESS: "Invalid Address",
          POSTAL_CODE: "Invalid postal code",
          OTP: "Invalid OTP",
          CARD_NUMBER: "Invalid Card Number",
          APPLICATION_CODE: "Only Alphanumeric values with special characters as & - # * +' , ( ) [ ] $ : . / \ ` ! $ _ [ ] | ? and length 1-20 are allowed.",
          APPLICATION_NAME: "Only Alphanumeric values with special characters as & - # * +' , ( ) [ ] $ : . / \ ` ! $ _ [ ] | ? and length 1-40 are allowed.",
          APPLICATION_DESCRIPTION: "Only Alphanumeric values with special characters as & - # * +' , ( ) [ ] $ : . / \ ` ! $ _ [ ] | ? and length 1-100 are allowed.",
          USER_ID: "Invalid User Id",
          BILLER_NAME: "Please enter a valid name",
          SSN: "Invalid SSN",
          PHONE_NO: "Invalid phone number",
          IP_ADDRESS: "Invalid IP Address",
          URL: "Invalid URL",
          PORT: "Invalid port number",
          BRANCH: "Invalid Branch Code",
          VEHICLE_MODEL: "Enter valid vehicle model",
          REGISTRATION_NO: "Enter valid registration number",
          YEAR: "Enter a valid year",
          OIN_NUMBER: "Invalid oin number",
          PAYMENT_DETAILS: "Invalid payment details",
          ATTRIBUTE_MASK: "Please enter valid attribute mask",
          LATITUDE: "Please enter valid latitude",
          LONGITUDE: "Please enter valid longitude"
        }
      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
      "en-us": false,
      el: false
    };
  };
  return new OBDXLocale();
});