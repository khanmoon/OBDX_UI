define([
  "ojL10n!lzn/beta/resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var customizeCardLocale = function() {
    return {
      root: {
        compName: "certifications",
        certifications: "Certifications",
        certInfo1: "I certify that I have read and agree to all the pricing, terms and conditions applicable on the credit card offer.",
        certInfo2: "I agree that I am the person named in the application and all the information including information of authorized users, if any, in the application is, to the best of my knowledge, correct. I also acknowledge that I have the consent of all the authorized users I have added and that if the bank finds any information fraudulent or that the authorized users did not give their consent, the bank can close this account.",
        certInfo3: "I authorize Model Bank to obtain a credit report or any other report or account information from credit or information services agencies to help verify my information provided in this application.",
        certInfo4: "Model Bank has the permission to contact me with information regarding my application as well as any information pertaining to my accounts on my phone numbers provided. My consent allows the bank to contact me via SMS, artificial or prerecorded voice messages and automatic dialing technology.",
        certInfo5: "All correspondence, including credit cards, statements and notifications will be sent to the address of the primary card holder. I understand that I will be held responsible for all the repayment of all balances on this account including that of the authorized users. Authorized users will have the same privileges as I do but will not be financially responsible.",
        certInfo6: "I agree that balance transfers, if any, will be sent to my payee(s) within a few days of my new credit card being mailed.",
        certInfo7: "I agree to be bound by the terms and conditions of the Account Agreement that will be sent to me and understand that the terms and conditions of my account may change at any time, subject to applicable law.",
        certCheckbox: "I have read and agree to the above statements.",
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
  return new customizeCardLocale();
});