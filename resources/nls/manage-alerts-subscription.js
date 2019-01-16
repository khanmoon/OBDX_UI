define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";
  var AlertsSubscriptionLocale = function() {
    return {
      root: {
        subscription: {
          accountNumber: "Account Number {accountNumber}",
          heading: "Alert Maintenance",
          alertType: "Alert Type",
          sendAlertVia: "Send Alert Via",
          mobileNumber: "Mobile Number",
          emailAddress: "Email",
          userName: "User Name",
          userType: "User Type",
          success: "Successful",
          confirmation: "Confirmation",
          createSubscription: "Create Subscription",
          modifySubscription: "Modify Subscription",
          successMessage: "Alert Subscription saved successfully.",
          addNew: "Add",
          INITIATED: "Initiated",
          ACCEPTED: "Pending Approval",
          REJECTED: "Rejected",
          partyName: "Party Name",
          partyId: "Party ID",
          emptyAlertList: "Alerts for this category are sent by default. No subscription required",
          emptyAccountList: "No Accounts Found.",
          noSelectionMade: "Please select at least one alert for subscription.",
          reviewAlerts: "You initiated a request for updating Alerts Subscription. Please review details before you confirm.",
          reviewHeader: "Review",
          cancelMessage: "Are you sure you want to cancel this operation?",
          cancelWarning: "Cancel Warning",
          accounts: "Current and Savings",
          td: "Term Deposits",
          loans: "Loans",
          profile: "Profile",
          payments: "Payments"
        },
        headers: {
          VIEW: "View",
          EDIT: "Edit",
          CREATE: "Create",
          REVIEW: "Review",
          SUCCESS: "Success",
          subscriptionHeading: "Alerts Subscription",
          actionHeaderheading: "Alerts Subscription",
          update: "Update Subscription"
        },
        common: Generic.common
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
  return new AlertsSubscriptionLocale();
});
