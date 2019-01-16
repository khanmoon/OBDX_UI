define(["ojL10n!resources/nls/origination-generic"], function(Generic) {
  "use strict";

  var LocationSearchLocale = function() {
    return {
      root: {
        continue: "Continue",
        isMultientity: "Does your setup has Multi Entity",
        isDomainSharing: "Does your setup has data sharing",
        entityId: "Entity Id",
        entityName: "Entity Name",
        timeZone: "Time Zone",
        openDiscPopup: "Multi Entity Setup",
        openDiscPopupTitle: "Multi Entity Setup",
        selectTimeZone: "Select Time Zone",
        propCommentsTimeZone: "Entity specific Time Zone",
        editalt: "Click to edit entity",
        saveAlt: "Click to save entity",
        editTitle: "Click to edit entity",
        saveTitle: "Click to save entity",
        deleteTitle: "Click to delete entity",
        deleteAlt: "Click to delete entity",
        systemConfiguration: "System Configuration",
        multiEntityTooltip: "Multi Entity is a capability of the system wherein multiple entities/brands of the same bank can run on the same platform",
        fieldname: {
          selectHost: "Select Host"

        },
        buttons: {
          addEntity: "Add entity",
          cancel: "Cancel"
        },
        generic: Generic
      },
      ar: false,
      en: false,
      "en-us": false
    };
  };
  return new LocationSearchLocale();
});
