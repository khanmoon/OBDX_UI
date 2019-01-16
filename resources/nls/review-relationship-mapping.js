define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";
  var ReviewRelationshipMappingLoacal = function() {
    return {
      root: {
        confirmRelationship: "Confirm",
        cancelRelationship:"Cancel",
        relationshipId:"Relationship Name and ID",
        relationshipDescription:"Relationship Description",
        mapRelationship:"Map Relationship",
        relationsipMappingTable:"Relationship Mapping Maintainance Table",
        backRelationship:"Back",
        editRelationship:"Edit",
        confirmationMessage:"Relationship Mapping Maintenance",
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
  return new ReviewRelationshipMappingLoacal();
});
