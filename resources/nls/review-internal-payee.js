define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var ReviewInternalPayee = function() {
    return {
      root: {
        internalPayee: {
          header: "Internal Payee Details",
          recipientname: "Payee Name",
          accounttype: "Account Type",
          accountnumber: "Account Number",
          accountname: "Account Name",
          branch: "Branch",
          nickName: "Nickname",
          Branchcoderesponse: "Branch",
          accinternal: "Internal",
          accountnickname: "Nickname",
          payeeaccesstype: "Access Type",
          payeeshared: "Payee Shared"
        },
        generic: Generic
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
  return new ReviewInternalPayee();
});