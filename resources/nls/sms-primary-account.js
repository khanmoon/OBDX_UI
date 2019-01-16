define([
  "ojL10n!resources/nls/messages",
  "ojL10n!resources/nls/generic"
], function(Messages, Generic) {
  "use strict";
  var OriginationLocale = function() {
    return {
      root: {
        header:"Select Account",
        headers: {
          determinantValue: "Entity",
          accountId: "Account ID",
          userID : "User Name",
          select : "Select",
          accountTypeAndNumber: "Account Type and Number",
          partyName : "Party Name",
          nickName : "Nick Name"
        },
        successMsg : "Primary account saved successfully !!",
        tableName : "Accounts Table",
        primaryAccountNumber:"Primary Account Number",
        messages: Messages,
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
  return new OriginationLocale();
});
