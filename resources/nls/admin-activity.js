define([], function() {
  "use strict";
  return new function() {
    return {
      root: {
        adminActivity: {
          labels: {
            heading: "Quick Links",
            groups: {
              OnBoarding: "Onboarding",
              Approvals: "Approvals",
              "Account Access": "Account Access",
              "File Upload": "File Upload",
              "User Management": "User Management",
              "Party Preferences": "Party Preferences",
              "Workflow Management": "Workflow Management",
              "Approval Rules": "Rules Management",
              "Party Account Access": "Party Account Access",
              "User Account Access": "User Account Access",
              "File Identifier Maintenance": "File Identifier Maintenance",
              "User File Identifier Mapping": "User File Identifier Mapping",
              "Origination Admin": "Origination Admin",
              "Workflow Configuration": "Workflow Configuration",
              Configuration: "Configuration",
              OTHERS : "Others",
              "Service Requests Info": "Request Processing",
              "Feedback": "Feedback",
              "User Help Desk": "User Help Desk"
            }
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
});
