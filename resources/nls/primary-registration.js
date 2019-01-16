define([
  "ojL10n!resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var primaryRegistrationLocale = function() {
    return {
      root: {
        infoPrivate: "Your personal information is safe at Zigbank.",
        privacyAndSecurityPolicy: "Click to view our Privacy Policy.",
        salutation: "Salutation",
        others: "Other Salutation",
        firstName: "First Name",
        middleName: "Middle Name",
        lastName: "Last Name",
        suffix: "Suffix",
        dateOfBirth: "Date of Birth",
        gender: "Gender",
        genderOptional: "Gender <br>(optional)",
        middleNameOptional: "Middle Name <br>(optional)",
        maritalStatus: "Marital Status",
        noOfDependents: "Number of Dependents",
        dependents: "Dependents",
        privacyClick: "Privacy and Security",
        privacyClickTitle: "Click For Privacy and Security",
        countryOfCitizenshipClick: "Country of Citizenship",
        nationality: "Nationality",
        countryOfCitizenshipClickTitle: "Click For country of citizenship",
        countryOfCitizenship: "Country of Citizenship",
        citizenshipRequirement: "Your nationality is required to determine product eligibility.",
        isPermanentResident: "Permanent Resident",
        countryOfResidence: "Country of Residence",
        generic: Generic,
        name: "Name",
        salFirstLast: "{salutation} {firstName} {lastName}",
        salFirstLastSuffix: "{salutation} {firstName} {lastName} {suffix}",
        salFirstMiddleLast: "{salutation} {firstName} {middleName} {lastName}",
        salFirstMiddleLastSuffix: "{salutation} {firstName} {middleName} {lastName} {suffix}",
        tncLine1: "By accepting this Agreement, we will lend you and you will borrow the amount of credit",
        tncLine2: "By signing this Agreement, you agree to repay the amount of credit and the total charge of credit by monthly repayments on the due date each month",
        tncLine3: "If any monthly repayment is not received by its due date, we may charge interest on it, until it is paid, at the rate equivalent to the Interest Rate applicable to your Personal Loan. In addition, a late payment fee (as specified in the Personal Loan Important Information Document signed by you) will apply.",
        basicInfo: {
          basicInfoTitle: "Primary Applicant",
          applicantInformation: "Applicant Information"
        },
        messages: {
          salutation: "Please select a salutation",
          others: "Please select other salutation",
          firstName: "Please enter a valid first name",
          middleName: "Please enter a valid middle name",
          lastName: "Please enter a valid last name",
          dob: "Please enter a valid date of birth",
          maritalStatus: "Please select a marital status",
          dependants: "Please select the number of dependants",
          citizenship: "Please select your country of citizenship",
          residentCountry: "Please select your country of residence",
          gender: "Please select gender"
        },
        submitPrimary: "Click here to Submit Primary Information",
        submitBasicPrimary: "Click here to Submit Applicant Information"
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
  return new primaryRegistrationLocale();
});
