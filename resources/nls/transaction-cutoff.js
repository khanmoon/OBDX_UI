define([
  "ojL10n!resources/nls/messages",
  "ojL10n!resources/nls/generic"
], function(Messages, Generic) {
  "use strict";
  var ExceptionLocale = function() {
    return {
      root: {
        pageTitle: {
          title: "Transaction Working Window"
        },
        moduleName: {
          exception: "Exception"
        },
        navBarDescription: "Transaction cut-off",
        common: {
          deleteWorkingWindow: "Delete Working Window",
          administrator: "administrator",
          corporateuser: "Corporate",
          retailuser: "Retail",
          INITIATED: "Initiated",
          ACCEPTED: "Pending Approval",
          SUCCESSFUL: "Completed",
          back: "Back",
          confirmation: "Confirmation",
          userTypes: "{firstUser}, {secondUser}",
          noRecord: "No records found.",
          next: "Next",
          delete: "Delete",
          deleteExceptionMsg: "Are you sure you want to delete this Exception?",
          selectMessage: "Select one option",
          selectedDateRange: "{startDate} ({startDay}) - {endDate} ({endDay})"
        },
        labels: {
          corporate: "Corporate",
          CLOSED: "Closed All Day",
          current: "Currently set",
          dateRange: "Date Range",
          transactionType: "Transaction Type",
          testPartyHeading: "Test party details",
          details: "Transaction Details",
          effectiveDate: "Effective Date",
          exception: "Exception",
          exceptions: "Exceptions",
          exceptionWindow: "Exception Window",
          exceptionDate: "Exception Date",
          exceptionName: "Exception Name",
          fixedDate: "Fixed Date",
          from: "From",
          LIMITED: "Limited Time",
          OPEN: "Open All Day",
          remark: "Remarks",
          retail: "Retail",
          select: "Select",
          selectDate: "Select Date",
          selectTransaction: "Select Transaction",
          selectUserType: "Select User Type",
          specificDate: "Specific Date",
          standardWorkingWindow: "Normal Window",
          timeRange: "Time Range (hh:mm)",
          to: "To",
          toTime: "To Time",
          fromTime: "From Time",
          transaction: "Transaction",
          transactionWindow: "Transaction Window",
          userType: "User Type",
          windowType: "Window Type",
          view: "View",
          review: "Review",
          cutoffTable: "Cutoff Table"
        },
        messages: Messages,
        generic: Generic,
        info: {
          noData: "No data to display.",
          landingHelpTitle: "Transaction Working Window",
          landingHelpDescription: "Use this feature to define the daily working window for financial transactions and also to specify the handling of transactions processed outside of the working window. You can also define an exception working window that will be considered over and above the regular working window maintenance. Additionally, you can search for existing working window maintenances to view and edit or delete, as per requirements. Click on Create to set a working window maintenance.",
          createHelpTitle: "Transaction Working Window",
          createHelpDescription: "Use this feature to define the daily working window for financial transactions and also to specify the handling of transactions processed outside of the working window. You can also define an exception working window that will be considered over and above the regular working window maintenance. Additionally, you can search for existing working window maintenances to view and edit or delete, as per requirements.",
          viewHelpTitle: "Transaction Working Window",
          viewHelpDescription: "Use this feature to define the daily working window for financial transactions and also to specify the handling of transactions processed outside of the working window. You can also define an exception working window that will be considered over and above the regular working window maintenance. Additionally, you can search for existing working window maintenances to view and edit or delete, as per requirements.",
          reviewMessage: "You have initiated a request for Exception Working Window. Please review details before you confirm!"
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
  return new ExceptionLocale();
});
