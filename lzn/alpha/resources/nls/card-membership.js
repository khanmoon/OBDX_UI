define([
  "ojL10n!lzn/alpha/resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var cardMembershipLocale = function() {
    return {
      root: {
        membershipNumber: "Membership Number : {membershipNumber}",
        membershipName: "Membership Name : {membershipName}",
        memberName: "Membership Name",
        memberNumber: "Membership Number",
        continue: "Continue",
        yes: "Yes",
        no: "No",
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
  return new cardMembershipLocale();
});