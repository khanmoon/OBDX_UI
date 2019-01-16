define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var ListCollectionLocale = function() {
    return {
      root: {
        generic: Generic,
        navLabels: {
          initiate: "Initiate Collection",
          drafts: "Drafts",
          template: "Templates",
          navBarDescription: "Collection Navigation Bar",
          initiateUsing: "Initiate using"
        },
        heading: {
          diretCollection: "Direct Collection",
          collectionInitiation: "Initiate Collection"
        },
        messages: {
          noTemplateCreated: "You have no saved templates.",
          noDraftCreated: "You have no saved drafts."
        },
        templates: {
          labels: {
            templateName: "Template Name",
            savedOn: "Saved On",
            updatedOn: "Last Updated",
            beneficiary: "Beneficiary",
            applicant: "Applicant",
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
            beneficiary: "Beneficiary",
            applicant: "Applicant",
            customerId: "Customer ID",
            create: "Create",
            listofDrafts: "Draft List Table"
          }
        }
      },
      ar: false,
      en: false,
      "en-us": false
    };
  };
  return new ListCollectionLocale();
});
