define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var paymentHistory = function() {
    return {
      root: {
        generic: Generic,
        heading: {
          paymentHistory: "Payment History"
        },
        labels: {
          category: "Category",
          paymentsList: "List of Payments",
          date: "Date",
          biller: "Biller",
          billAmount: "Bill Amount",
          referenceNo: "Reference No",
          status: "Status",
          paymentsTable: "Payments",
          selectPeriod: "Select Period",
          fromDate: "From Date",
          toDate: "To Date",
          noData: "No data found matching the search criteria",
          searchFields: "Biller, Category",
          viewBills: "View Bills",
          quickRecharge: "Quick Recharge",
          downloadHistory: "Download History",
          download: "Download",
          statementText: "Click to Download Statement",
          passwordNotification: "Password Combination",
          passCombination: "On opening the PDF, you will be asked to enter a password.	Your password consists of the first 4 letters of your user name in capital case, followed by the date and month of your birth (in DDMM format)",
          passwordExample: "For example, if the user name is Roopa Lal and the date of birth is 23-12-1976, then your password will be ROOP2312."
        },
        dropDownValues: {
          CPR: "Current Period",
          L1M: "Previous Month",
          LQT: "Previous Quarter",
          SPD: "Date Range"
        },
        paymentStatus: {
          SNT: "Sent",
          COM: "Completed",
          PND: "Pending",
          TOT: "Timeout",
          ERR: "Error"
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
  return new paymentHistory();
});
