define([], function() {
  "use strict";
  var CorpProfileLocale = function() {
    return {
      root: {
        lastLoginTime: "Last Login Time",
        email: "Email",
        phone: "Phone Number",
        dob: "Date of Birth",
        address: "Address",
        ok: "Ok",
        panCard:"Pan Card",
        aadharCard:"Aadhar Card",
        heading: "My Profile",
        profile: "Profile Image",
        personalInformation : "Personal Information",
        contactInformation : "Contact Information",
        addressDetails : "Address Details",
        name: "{firstName} {lastName}",
        download: "Download",
        downloadFile: "Download Profile"
      },
      ar: false,
      fr: true,
      cs: false,
      sv: false,
      en: false,
      "en-us": false,
      el: true
    };
  };
  return new CorpProfileLocale();
});
