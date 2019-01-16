define([
  "ojL10n!resources/nls/messages",
  "ojL10n!resources/nls/generic"
], function(Messages, Generic) {
  "use strict";
  var StandardWorkWindowLocale = function() {
    return {
      root: {
        pageTitle: {
          title: "Transaction Working Window"
        },
        common: {
          allTransactions: "All Transactions",
          ACCEPTED: "Pending Approval",
          administrator: "administrator",
          back: "Back",
          CLOSED: "Closed All Day",
          confirmation: "Confirmation",
          corporate: "Corporate",
          corporateuser: "Corporate",
          currentTransaction: "Current Transactions",
          currentTransactionWindow: "Current Transaction Window",
          days: "Day Of Week",
          delete: "Delete",
          fromTime: "From Time",
          futureTransaction: "Future Transactions",
          futureTransactionWindow: "Future Transaction Window",
          LIMITED: "Limited Time",
          noRecords: "No records found.",
          OPEN: "Open All Day",
          otherDetails: "Other Details",
          processingType: "Treatment Outside Normal Window",
          retail: "Retail",
          retailuser: "Retail",
          roleType: "{role1}, {role2}",
          toTime: "To Time",
          overlapMsg: "Overlapping time slots detected!",
          error: "Error",
          transaction: "Transaction",
          transactionWindow: "Window Type",
          windowType: "Window Type",
          successfullyInitiated: "Pending Approval"
        },
        workingWindow: {
          createHeading: "Create",
          deleteWorkingWindow: "Delete Working Window",
          cancelMsg: "Are you sure you want to cancel this transaction?",
          deleteMessage: "Are you sure you want to delete this Working Window Maintenance?",
          details: "Transaction Details",
          effectiveDate: "Effective Date",
          futureEffectiveDate: "Effective Date",
          othersHeading: "Other Details",
          pleaseSelect: "Select",
          retail: "Retail",
          review: "Review",
          selectDate: "Select Date",
          selectTransaction: "Select Transaction",
          selectUserType: "Select User Type",
          standardWorkingWindow: "Normal Window",
          successDeleteMessage: "Successfully Deleted Working Window",
          successMessage: "Maintenance Saved successfully.",
          tanks: "Process on Next Value Date",
          transactionRejected: "Reject Transaction",
          transactionWorkingWindow: "Transaction Working Window",
          userType: "User Type",
          workingWindowTable: "List For Standard Working Window",
          fileUploadErrorMsg: "Treatment outside normal window other than Reject for File Upload transactions is not supported."
        },
        labels: {
          dateRange: "Date Range",
          standardWorkWindow: "Normal Window",
          exceptionWindow: "Exception Window",
          exceptions: "Exceptions"
        },
        days: {
          MON: "Monday",
          TUE: "Tuesday",
          WED: "Wednesday",
          THU: "Thursday",
          FRI: "Friday",
          SAT: "Saturday",
          SUN: "Sunday"
        },
        messages: Messages,
        generic: Generic,
        info: {
          noData: "No data to display.",
          landingHelpTitle: "Transaction Working Window",
          landingHelpDescription: "Use this feature to define the daily working window for financial transactions and also to specify the handling of transactions processed outside of the working window. You can also define an exception working window that will be considered over and above the regular working window maintenance. Additionally, you can search for existing working window maintenances to view and edit or delete, as per requirements. Click on Create to set a working window maintenance.",
          createHelpTitle: "Transaction Working Window",
          createHelpDescription: "Use this feature to define the daily working window for financial transactions and also to specify the handling of transactions processed outside of the working window. You can also define an exception working window that will be considered over and above the regular working window maintenance. Additionally, you can search for existing working window maintenances to view and edit or delete, as per requirements.",
          reviewMessage: "You have initiated a request for Normal Working Window. Please review details before you confirm!"
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
  return new StandardWorkWindowLocale();
});
