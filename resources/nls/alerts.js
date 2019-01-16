define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var AlertsOverviewLocale = function() {
    return {
      root: {
        alerts: {
          labels: {
            alerts: "Alerts",
            alertName: "Alert Name",
            alertType: "Alert Type",
            alertDescription: "Alert Description",
            eventDescription: "Event Name",
            moduleType: "Module Name",
            activityId: "Activity Name",
            eventId: "Event Name",
            alertExpiry: "Alert Expiry",
            addMessageTemplate: "Recipient Type {index}",
            addNewMessageTemplate: "Add Message Template",
            addNew: "Add",
            successMessage: "Alert Saved successfully.",
            heading: "Alert Maintenance",
            deleteAlertMsg: "Are you sure you want to delete this Alert ?",
            noRecipientSelected: "Please add alert message template at least for one recipient",
            successDeleteMessage: "Alert Deleted successfully.",
            noDeliveryTypeSelected: "Please select at least one delivery mode for every recipient",
            emailTemplate: "Email Template",
            searchResults: "Following search results found",
            deleteAlert: "Delete Alert",
            deleteRecipient: "Delete Recipient",
            cancelMessage: "Are you sure you want to cancel this operation?",
            cancelWarning: "Cancel Warning",
            landingHelpTitle: "Alerts Maintenance",
            landingDescription: "Define & maintain the parameters that drive the internal & external alerts.For a module, you can define the events for alert generation, the text of the alert & whether its mandatory or subscription based for user. These parameters can be viewed, edited & deleted as required.",
            reviewAlerts: "You initiated a request for updating Alerts Subscription. Please review details before you confirm.",
            reviewEditMessage: "You initiated a request for updating Alerts Maintenance. Please review details before you confirm.",
            reviewCreateMessage: "You initiated a request for creating Alerts Maintenance. Please review details before you confirm.",
            reviewHeader: "Review",
            confirmationMessage: "Are you sure you want to cancel this transaction ?"
          },
          alertType: {
            S: "Subscribed",
            M: "Mandatory"
          },
          recipient: {
            CUSTOMER:	"Customer",
            INITIATOR:	"Initiator",
            APPROVER:	"Approver",
            PREVIOUS_APPROVER:	"Previous Approver",
            NEXT_APPROVER:	"Next Approver",
            USER:	"User"
          },
          recipientCategory: {
            PARTY:	"Party",
            BANKER:	"Banker",
            CORPORATE:	"Corporate",
            EXTERNAL:	"External"
          },
          locale: {
            en_US: "English(United States)",
            fr: "French",
            ru: "Russian",
            en: "English"
          },
          moduleType: {
            TD: "Term Deposit",
            CH: "Savings & Current Account",
            LN: "Loan",
            OR: "Origination",
            PC: "Payments",
            AT: "Host",
            SMS: "User Management",
            BO: "Back Office",
            FU: "File Upload",
            AP: "Approvals",
            RT: "Reports"
          }
        },
        navBarDescription: "Alerts",
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
  return new AlertsOverviewLocale();
});
