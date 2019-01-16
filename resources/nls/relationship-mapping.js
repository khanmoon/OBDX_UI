define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";
  var RelationshipMappingLoacal = function() {
    return {
      root: {
        relationshipMappingMaintenance: "Relationship Mapping Maintenance",
        reviewHeader: "You initiated a request for Relationship Mapping. Please review details before you confirm!",
        reviewHeader1: "Review",
        relationshipMappingDescription: "{relationshipDescrip} ({relationshipId})",
        help: {
          alt: "Image for Relationship Mapping"
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
  return new RelationshipMappingLoacal();
});
