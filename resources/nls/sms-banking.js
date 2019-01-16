define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var SMSBankingOverviewLocale = function() {
    return {
      root: {
        events: {
          labels: {

            smsHeading: "SMS Banking",
            missedCallHeading: "Missed Call",
            smsTabHeading: "SMS",
            eventDescription: "Event Name",
            events : "Event",
            locale : "Locale",
            response : "Response",
            attributeMask: "Attribute Mask",
            dataAttribute : "Data Attributes",
            setAttributeMask : "Attribute Mask",
            input : "Input",
            pinRequired : "Pin Required",
            add : "Add",
            addNew : "Add New",
            contactNumber: "Contact Number",
            successMessage: "success",
            addRequestAttribute: "Request Attribute",
            addAttribute: "Add Data Attribute",
            addDataAttribute: "Add Data Attribute",
            deleteAttribute: "Delete Attribute",
            missedCallConfirmScreen:"Missed Call Maintenance",
            smsConfirmScreen: "SMS Maintenance",
            editReviewMessageSMS:"You initiated changes for SMS Banking. Please review details before you confirm!",
            editReviewMessageMissedCall:"You initiated changes for Missed Call Banking. Please review details before you confirm!",
            reviewHeading:"Review"
          },
          locale: {
            en_US: "English(United States)",
            fr: "French",
            ru: "Russian",
            en: "English"
          }

        },
        navBarDescription: "SMS Banking",
        genericAlert: Generic.common,
        common: {
          addNew: "Add",
          confirmation: "Confirmation",
          INITIATED: "Initiated",
          ACCEPTED: "Pending Approval",
          REJECTED: "Rejected"
        },
        headers: {
          VIEW: "View",
          EDIT: "Edit",
          CREATE: "Create",
          REVIEW: "Review",
          SUCCESS: "Success",
          SEARCH: "Search",
          MESSAGESETTINGS: "Message Settings",
          MESSAGEDETAILS: "Message Details"
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
  return new SMSBankingOverviewLocale();
});
