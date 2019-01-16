define([], function() {
  "use strict";
  var AccountDetailsLocale = function() {
    return {
      root: {
        searchFields: {
          labels: {
            partyIdName: "Party ID Name",
            acccountNumber: "Account Number",
            referrenceNumber: "Reference Number",
            searchBy: "Search By",
            transactionType: "Transaction Type",
            timeRange: "Time Range",
            timeFrom: "Date From",
            timeTo: "Date To",
            amountFrom: "Amount From",
            amountTo: "Amount To",
            btnSearch: "Search",
            btnCancel: "Cancel",
            btnBack: "Back",
            btnReset: "Reset",
            accountDetails: "Account Details",
            creditType: "{amt} Cr",
            deditType: "{amt} Dr",
            openingBalance: "Opening Balance",
            closingBalance: "Closing Balance",
            selectAccount: "Select Account",
            toggleSearch: "Toggle search criteria",
            toggleSearchTitle: "Click for toggle search criteria",
            download: "Download",
            recentActivity: "My Recent Activity",
            selectAccountType: "Select Account Type",
            view: "View Options",
            openDiv: "Open filter",
            openDivText: "Click here to open filter",
            noData: "No Activity found for the specified period.",
            unsubscribeHeader: "Unsubscribe",
            period: "Period",
            applyFilter: "Apply Filter",
            filter: "Filter",
            date: "Date",
            description: "Description",
            reference_no: "Reference No",
            amount: "Amount",
            balance: "Balance",
            type: "Transaction Type",
            selectFormat: "Select Download Format",
            accountStatement: "Account Statement",
            statement: "Download Statement",
            statementText: "Click to Download Statement",
            estatement: "E-Statement",
            estatementText: "Click to view E-Statement",
            reqStatement: "Request Statement",
            reqStatementText: "Click to view Request Statement",
            downloadeStatement: "Pre-Generated Statement",
            downloadStatement: "Click to view Pre-Generated Statement",
            noRecord: "No Record Found",
            passCombination: "The document is password protected, it is a combination of the first 4 letters of your name (in capital letters) followed by your date of birth (in DDMM format).",
            passwordExample: "Example, if your name is Roopa Lal and date of birth is 23-12-1980, then your password is ROOP2312",
            ok: "Ok",
            passwordNotification: "Password Combination",
            pdfPwdInfo : "The document is password protected, it is a combination of the first 4 letters of your name (in capital letters) followed by your date of birth (in DDMM format).",
            pdfPwdExample:"Example, if your name is Roopa Lal and date of birth is 23-12-1980, then your password is ROOP2312"
          }
        },
        dropDownValues: {
          a: "All",
          d: "Debits Only",
          c: "Credits Only",
          CPR: "Current Month",
          PMT: "Previous Month",
          PQT: "Previous Quarter",
          SPD: "Select Date Range"
        },
        pageHeader: "Transactions",
        headerName: "View Statement"

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
  return new AccountDetailsLocale();
});
