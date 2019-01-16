define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";
  var CreateRelationshipMappingLoacal = function() {
    return {
      root: {
        saveRelationship: "Save",
        cancelRelationship: "Cancel",
        relationshipId: "Relationship Name and ID",
        relationshipDescription: "Relationship Description",
        mapRelationship: "Map Relationship",
        relationsipMappingTable: "Relationship Mapping Maintainance Table",
        backRelationship: "Back",
        errorMessage: {
          hostCode: "Enter a valid host relationship code"
        },
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
  return new CreateRelationshipMappingLoacal();
});
