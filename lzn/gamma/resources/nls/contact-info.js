define([
  "ojL10n!lzn/gamma/resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var contactInfoLocale = function() {
    return {
      root: {
        compName: "contact-info",
        resAddr: "Residential Address",
        poBoxes: "We will be sending all postal mail to this address. (P.O. Boxes are not allowed)",
        poBoxes1: "(P.O. Boxes are not allowed)",
        prevResAddr: "Previous Residential Address",
        phoneType: "Phone Type",
        address: "Address",
        alternateNumber: "Alternate Phone Number",
        primaryPhoneNumber: "Primary Phone Number",
        alternatePhoneNumber: "Phone Number",
        contactInformation: "We may contact you with important information about your account on your primary phone number. If you have provided a mobile number as primary, we may also send you alerts via SMS. You may contact us at any time to change the preferences.",
        contactNumber: "Phone Number",
        reviewAddress: "{line1}, {line2}, {city} {state} {zip}",
        reviewAddress2: "{line1}, {city} {state} {zip}",
        reviewPhoneNumber: "{contactType}: {number}",
        stayingSince: "Staying Since",
        accomodationType: "Accommodation Type",
        mobile: "Mobile Number",
        phone: "Phone Number",
        landlordname: "Landlord's Full Name",
        currAddress: "Current Address",
        prevAddress: "Previous Address",
        mailingAddress: "Mailing Address",
        confirmEmail: "Confirm Email",
        reenterEmail: "Re-Enter Email Address",
        email: "Email",
        ziplabel: "(First 5 digits are required)",
        country: "Country",
        state: "State",
        city: "City",
        date: "{yyyy}-{mm}-{dd}",
        zipCode: "Zip Code",
        address1: "Address Line 1",
        address2: "Address Line 2",
        emailRequirements: "Click For Email Information",
        emailRequirementsInfo: "Click For Email Info",
        pervAddressClick: "Click For Previous Address",
        pervAddressClickInfo: "Click For Previous address Info",
        emailRequirementText: "We need your valid email address so we can communicate important information to you regarding your application.",
        previousAddressRequiredText: "To properly verify your identity, we need details of all addresses that you have resided in for the past two years.",
        copyAddress: "Default as that of Primary Applicant",
        mortgageToggleText: "Do you pay mortgage?",
        samePostalAddress: "Is your mailing address the same as your primary residence above?",
        monthlyMortgage: "Monthly Mortgage",
        monthlyRent: "Monthly Rent",
        homePhoneNumber: "Home Phone number",
        mobilePhoneNumber: "Mobile Phone number",
        messages: {
          stayingSince: "Please enter a valid date",
          accomodationType: "Please select an accomodation type",
          mobileNumber: "Please enter a valid phone number",
          phoneNumber: "Please enter a valid phone number",
          phoneType: "Please select a phone type",
          confirmEmail: "Please confirm your email address",
          email: "Please enter a valid email address",
          zipCode: "Invalid zip code",
          emailAddressMatching: "The email addresses do not match. Please try again"
        },
        submitContact:"Click here to submit contact information.",
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
  return new contactInfoLocale();
});
