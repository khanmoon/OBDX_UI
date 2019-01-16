define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var AlertSubscriptionLocale = function() {
    return {
      root: {
        subscription: {
          title: "Alerts Subscription",
          emailNotAvailable: "Email Id not available. Please update Email Id to receive alert via Email",
          smsNotAvailable: "Mobile No not available. Please update Mobile No to receive alert via SMS",
          success: "Successful",
          success_message: "Alert Subscription changes are saved.",
          recipient: "Customer",
          recipientCategory: "Party",
          createSubscription: "Create Subscription",
          modifySubscription: "Modify Subscription",
          onScreen: "On screen",
          savingAccount: "Savings Account",
          currentAccount: "Current Account",
          accountNumber: "Account Number {accountNumber}",

          common: {
            INITIATED: "Initiated",
            ACCEPTED: "Pending Approval",
            REJECTED: "Rejected",
            confirmation: "Confirmation",
            ok: "Ok",
            done: "Done",
            confirm: "Confirm",
            serverError: "Could not connect to server. Please try again later."

          },
          alertslist: {
            alertDescription: "Alert description",
            subscription: "Subscription",
            deliveryChannels: "Delivery channels",
            selectToSubscribe: "(Select to subscribe)",
            active: "Active",
            inactive: "Inactive",
            saveChanges: "Save",
            numberError: "Please Enter only numbers",
            transactionLimit: "Transaction Limit",
            alertNotAvailable: "Alerts for this category are sent by default. No subscription required",
            fetchingAlerts: "Fetching Alerts...",
            alertType: "Alert Type",
            sendAlertVia: "Send Alert Via",
            ariaLabel: "List of Alerts"
          },
          headers: {
            VIEW: "View",
            EDIT: "Edit",
            CREATE: "Create",
            REVIEW: "Review",
            SUCCESS: "Success",
            subscriptionHeading: "Alerts Subscription"
          },

          genericAlert: Generic.common
        },
        emailAlert: "Email Alert",
        smsAlert: "SMS Alert",
        onScreenAlert: "On Screen Alert",
        pushAlert: "Push Notification Alert"

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
  return new AlertSubscriptionLocale();
});