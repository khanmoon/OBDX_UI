define([], function() {
  "use strict";
  var GuaranteeListLocale = function() {
    return {
      root: {
        navLabels: {
          initiate: "Initiate Outward Guarantee",
          drafts: "Drafts",
          template: "Templates",
          navBarDescription: "Guarantee Navigation Bar",
          initiateUsing: "Initiate using"
        },
        heading: {
          initiateGuarantee: "Initiate Outward Guarantee"
        },
        templates: {
          labels: {
            PRIVATE: "Private",
            PUBLIC: "Public",
            templateName: "Template Name",
            savedOn: "Saved On",
            updatedOn: "Last Updated",
            beneficiary: "Beneficiary",
            applicant: "Applicant",
            access_type: "Access Type",
            createdBy: "Created By",
            product: "Product",
            templatesTable: "List of Templates",
            cancel: "Cancel"
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
            draftsTable: "List of Drafts"
          }
        },
        messages: {
          noTemplateCreated: "You have no saved templates.",
          noDraftCreated: "You have no saved drafts."
        }
      },
      ar: false,
      en: false,
      "en-us": false
    };
  };
  return new GuaranteeListLocale();
});
