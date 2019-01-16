define([
  "ojL10n!resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var contactInfoLocale = function() {
    return {
      root: {

        email: "Email",
        mobileNumber: "Please enter a valid phone number",
        phoneNumber: "Please enter a valid phone number",
        landlordNameErrorMessage: "Please enter a valid landlord name",
        confirmEmail: "Please confirm your email ID",
        resAddr: "Residential Address",
        permanentResidence: "Permanent Residence",
        postalmail: "We will be sending all postal mail to this address.",
        prevResAddr: "Previous Residential Address",
        phoneType: "Phone Type",
        ziplabel: "(First 5 digits are required)",
        alternateNumber: "Add an alternate phone number",
        additionalNumber: "Add an additional phone number?",
        primaryPhoneNumber: "Primary Phone Number",
        alternatePhoneNumber: "Alternate Phone Number",
        additionalPhoneNumber: "Additional Phone Number",
        contactInformation: "We may contact you with important information about your account on your primary phone number. If you have provided a mobile number as primary, we may also send you alerts via SMS. You may contact us at any time to change the preferences.",
        contactNumber: "Phone Number",
        country: "Country",
        state: "State",
        city: "City",
        zipCode: "Zip Code",
        address: "Address",
        address1: "Address Line 1",
        address2: "Address Line 2",
        reviewAddress: "{line1}, {line2}, {city}",
        reviewAddress2: "{line1}, {city}",
        reviewAddressStateZip: "{state} {zip}",
        reviewAddressCountryZip: "{state} {country} {zip}",
        reviewAddressCountryZipNoState: "{country} {zip}",
        reviewPhoneNumber: "{contactType}: {number}",
        reviewPhoneNumberWithCode: "{contactType}: {areaCode}-{number}",
        stayingSince: "Staying Since",
        accomodationType: "Accommodation Type",
        mobile: "Mobile Number",
        landlordname: "Landlord's Full Name",
        whyWeRequire: "Why we require this information",
        whyWeRequireText: "We require landlord details if your accommodation type is rented or leased.",
        currAddress: "Current Address",
        prevAddress: "Previous Residential Address",
        landlordDtls: "Landlord Details",
        prevlandlordDtls: "Previous Landlord Details",
        coAppFillDetails: "Let the co-applicant fill his details",
        landlordAddress: "Landlord Address",
        previousAddressRequiredText: "We need your previous residential details for identity verification purpose.",
        emailRequirementText: "It is required so that we can contact you for important information related to your application.",
        previousAdressInfo: "Click For Previous Address Information",
        emailInfo: "Email Information",
        emailInfoTitle: "Click For Email Information",
        applicationInfo: "Applicant Information",
        applicationInfoTitle: "Click For Applicant Information",
        copyAddress: "Default as that of Primary Applicant",
        mortgageToggleText: "Do you pay mortgage?",
        monthlyMortgage: "Monthly Mortgage",
        monthlyRent: "Monthly Rent",
        samePostalAddress: "Is your mailing address the same as your primary residence above?",
        sameAsAbove: "Is your mailing address the same as above?",
        mailingAddress: "Mailing Address",
        messages: {
          email: "Please enter a valid email ID",
          stayingSince: "Please enter a valid date",
          accomodationType: "Please select an accommodation type",
          phoneType: "Please select a phone type",
          mobileNumber: "Please enter a valid phone number",
          emailAddressMatching: "The email addresses do not match. Please try again"

        },
        submitContact: "Click here to Submit Contact information",
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
  return new contactInfoLocale();
});