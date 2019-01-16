define([
  "ojL10n!resources/nls/messages",
  "ojL10n!resources/nls/generic"
], function(Messages, Generic) {
  "use strict";
  var ApprovalsLocale = function() {
    return {
      root: {
        pageTitle: {
          approvals: "Transaction Blackout"
        },
        moduleName: {
          approvals: "Approvals"
        },
        common: {
          ACCEPTED: "Pending Approval",
          apply: "Apply",
          cancel: "Cancel",
          date: "Date",
          confirm: "Confirm",
          search: "Search",
          create: "Create",
          reset: "Reset",
          save: "Save",
          delete: "Delete",
          back: "Back",
          edit: "Edit",
          view: "View",
          review: "Review",
          no: "No",
          yes: "Yes",
          addTime: "Add Time Range",
          add: "Add",
          dateRange: "Date Range",
          currentTransaction: "Current Transactions",
          futureTransaction: "Future Transactions",
          processingType: "Processing Type",
          transactionWindow: "Transaction Type",
          userType: "User Type",
          selectDate: "Select date",
          linkDetails: "Click to see details of {transactionName} for date {date}",
          successfullyInitiated: "Pending Approval"
        },
        datetime: {
          startOn: "Start On",
          endOn: "End On",
          startDate: "Start Date",
          startTime: "Start Time",
          endDate: "End Date",
          endTime: "End Time",
          dateRange: "Date Range",
          time: "Time Range",
          from: "From",
          to: "To"
        },
        transaction: {
          transactionType: "Transaction Type",
          inquiry: "Inquiries",
          financialTransaction: "Financial",
          nonFinancialTransaction: "Non Financial",
          admin_maintenance: "Administration",
          maintenance: "Maintenances",
          adminValue: "Administration",
          inquiryValue: "Inquiry",
          maintenanceValue: "Maintenance",
          statusType: "Status",
          transactionName: "Transaction",
          blackoutType: "Blackout Type",
          full: "Full",
          recurring: "Daily",
          blackout: "Transaction Blackout",
          deleteBlackoutTitle: "Delete Transaction Blackout",
          deleteBlackoutMsg: "Are you sure you want to delete this transaction blackout?",
          status: "Status",
          deleteBlackoutOnMsg: "This Transaction is currently on blackout. Are you sure you want to end this blackout?",
          NoRecord: "No Record Found.",
          Overlapping: "Overlapping time slots detected!",
          pleaseEnter: "Please enter either Date, Transaction Type or User Type.",
          prospectValue: "anonymous-role",
          prospect: "Prospect",
          confirmMsg: "Are you sure you want to cancel this transaction?",
          blackoutTable: "Searched List for Transaction Blackouts",
          frequency: {
            DAILY: "Daily",
            FULL: "Full",
            SCHEDULED: "Scheduled",
            ONGOING: "Ongoing",
            COMPLETED: "Completed"
          }
        },
        workingWindow: {
          pleaseSelect: "Select"
        },

        messages: Messages,
        generic: Generic,
        info: {
          noData: "No data to display.",
          landingHelpTitle: "Transaction Blackout",
          landingHelpDescription: "Make transactions inaccessible to customers for periods when maintenance is planned by setting up transaction blackout. Search for an existing blackout to view and edit or delete the maintenance. Click on the Create option provided to the setup a new transaction blackout maintenance.",
          createHelpTitle: "Transaction Blackout",
          createHelpDescription: "Make transactions inaccessible to customers for periods when maintenance is planned by setting up transaction blackout.",
          viewHelpTitle: "Transaction Blackout",
          viewHelpDescription: "Make transactions inaccessible to customers for periods when maintenance is planned by setting up transaction blackout. Click on Edit button to update the existing blackout. In case you want to delete the blackout, click on Delete button",
          reviewMessage: "You have initiated a request for Transaction Blackout. Please review details before you confirm!"
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
  return new ApprovalsLocale();
});
