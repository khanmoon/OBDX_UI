define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var templateListLocale = function() {
    return {
      root: {
        generic: Generic,
        navLabels: {
          initiateLC: "Initiate LC",
          drafts: "Drafts",
          template: "Templates",
          initiateUsing: "Initiate using",
          navBarDescription: "Trade Finance Navigation Bar"
        },
        heading: {
          initiateLC: "Initiate Letter Of Credit"
        },
        messages: {
          noTemplateCreated: "You have no saved templates.",
          noDraftCreated: "You have no saved drafts."
        },
        templates: {
          labels: {
            templateName: "Template Name",
            updatedOn: "Last Updated",
            beneficiary: "Beneficiary",
            access_type: "Access Type",
            createdBy: "Created By",
            product: "Product",
            listofTemplates: "Template List Table"
          }
        },
        drafts: {
          labels: {
            draftName: "Draft Name",
            savedOn: "Saved On",
            listofDrafts: "Draft List Table"
          }
        }
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
  return new templateListLocale();
});