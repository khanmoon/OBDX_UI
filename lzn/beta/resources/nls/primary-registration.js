define([
  "ojL10n!lzn/beta/resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var primaryRegistrationLocale = function() {
    return {
      root: {
        compName: "primary-registeraion",
        priSec: "All your details are",
        yourInfo: "Your information is",
        privacyAndSecurityPolicy: "private and secure.",
        salutation: "Salutation",
        others: "Other Salutation",
        firstName: "First Name",
        lastName: "Last Name",
        middleName: "Middle Name",
        middleNameOptional: "Middle Name <br>(optional)",
        suffix: "Suffix",
        suffixOptional: "Suffix <br>(optional)",
        dateOfBirth: "Date of Birth",
        optional: "(optional)",
        isPermanentResident: "Permanent Resident",
        permanentRes: "Permanent Resident",
        countryOfResidence: "Country of Residence",
        countryOfCitizenship: "Citizenship",
        privacyAndSecurityPolicyClick: "Click For privacy and security",
        privacyAndSecurityPolicyClickInfo: "Click For Pivacy and Security Info",
        countryClick: "Click For Country",
        countryClickInfo: "Click For Country Info",
        countryOfCitizenshipClick: "Click For Citizenship",
        countryOfCitizenshipClickInfo: "Click For Citizenship Info",
        citizenship: "Us",
        hearAboutUs: "How did you hear about us?",
        citizenshipRequirement: "We need your citizenship information to determine eligibility for our products and also to comply with the USA PATRIOT Act.",
        tncLine1: "By accepting this Agreement, we will lend you and you will borrow the amount of credit",
        tncLine2: "By signing this Agreement, you agree to repay the amount of credit and the total charge of credit by monthly repayments on the due date each month",
        tncLine3: "If any monthly repayment is not received by its due date, we may charge interest on it, until it is paid, at the rate equivalent to the Interest Rate applicable to your Personal Loan. In addition, a late payment fee (as specified in the Personal Loan Important Information Document signed by you) will apply.",
        name: "Name",
        FirstLast: "{firstName} {lastName}",
        FirstMiddleLast: "{firstName} {middleName} {lastName}",
        salFirstLast: "{salutation} {firstName} {lastName}",
        salFirstMiddleLast: "{salutation} {firstName} {middleName} {lastName}",
        salFirstMiddleLastSuffix: "{salutation} {firstName} {middleName} {lastName} {suffix}",
        salFirstLastSuffix: "{salutation} {firstName} {lastName} {suffix}",
        FirstMiddleLastSuffix: "{firstName} {middleName} {lastName} {suffix}",
        FirstLastSuffix: "{firstName} {lastName} {suffix}",
        armedForcesMember: "Active Duty Armed Forces Member / Dependent",
        citizenshipStatus: "Citizenship Status",
        residentAlien: "Resident Alien",
        nonResidentAlien: "Non Resident Alien",
        scraDate: "SCRA Effective Date",
        scraRefNo: "SCRA Reference No.",
        militaryDisclosure: "Military Disclosure Federal law provides protections to active duty members of the Armed Forces and their dependents. To ensure that these protections are provided to eligible applicants, we require you to check one of the options as applicable.",
        basicInfo: {
          basicInfoTitle: "Basic Information",
          title: "Title"
        },
        messages: {
          salutation: "Please select a salutation",
          others: "Please select other salutation",
          firstName: "Please enter a valid first name",
          middleName: "Please enter a valid middle name",
          lastName: "Please enter a valid last name",
          dob: "Please enter a valid date of birth",
          citizenship: "Please select your country of citizenship",
          residentCountry: "Please select your country of residence",
          citizenshipStatus: "Please select your citizenship status",
          successText: "You have been successfully registered. Please Login to continue",
          validOption: "Please select a valid option",
          scraDate: "Please enter a valid SCRA effective date",
          scraRefNo: "Plesae enter a valid SCRA Reference number"
        },
        submitPrimary: "Click here to submit primary information",
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
  return new primaryRegistrationLocale();
});
