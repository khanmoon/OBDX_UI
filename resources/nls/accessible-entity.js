define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var AccessibleEntity = function() {
    return {
      root: {
        accessibleEntity: {
          entityName: "Entity Name",
          limit: "Limits",
          role: "Roles",
          accessibleEntities: "Accessible Entity Details",
          addAccessibleEntities: "Add Accessible Entity",
          noLimitAssigned: "No Limit attached to the user",
          selectAccessPoints : "Select Touch Points"
        },
        placeholder: {
          pleaseSelect: "Please Select",
          holderName: "Account Holder Name",
          selectAccount: "Select Account",
          currency: "Currency"
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
  return new AccessibleEntity();
});
