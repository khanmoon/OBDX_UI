define([
  "ojL10n!resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var cardPreferencesLocale = function() {
    return {
      root: {
        cardTypePrimary: "Primary Card",
        customizeCard: "Customize your card to reflect you personality and interests",
        salFirstLast: "{salutation} {firstName} {lastName}",
        salFirstMiddleLast: "{salutation} {firstName} {middleName} {lastName}",
        salFirstMiddleLastSuffix: "{salutation} {firstName} {middleName} {lastName} {suffix}",
        salFirstLastSuffix: "{salutation} {firstName} {lastName} {suffix}",
        addOnClick: "Click to edit holder preferences",
        addOnClickTitle: "Click to edit holder preferences",
        addOn: "Authorized User Card",
        selectAddOn: "Select a card holder to customize their card",
        deleteAddOnPref: "Click to delete preferences",
        editAddOnPref: "Click to edit preferences",
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
  return new cardPreferencesLocale();
});