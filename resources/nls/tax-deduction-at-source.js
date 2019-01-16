define([], function() {
  "use strict";
  var Menu = function() {
    return {
      root: {
        title: "TDS",
        requiredFor: "Required for Financial Year",
        pleaseSelect: "Please Select",
        labels: {
          "selectFinancialYear": "Select Financial Year"
        },
        fromDate: "From Date",
        toDate: "To Date",
        view: "View",
        back: "Back",
        download: "Download",
        interestCertificateTable: "Interest Certificate Table",
        financialYear: "Financial Year",
        year: "{fromYear}-{toYear}",
        duration: "Duration",
        tableHeading: {
          "accountNo": "Deposit Account Number",
          "interestEarned": "Interest Earned",
          "taxDeducted": "Tax Deducted"
        },
        passCombination: "On opening the PDF, you will be asked to enter a password.  Your password consists of the first 4 letters of your user name in capital case, followed by the date and month of your birth (in DDMM format)",
        passwordExample: "For example, if the user name is Roopa Lal and the date of birth is 23-12-1976, then your password will be ROOP2312.",
        ok: "Ok",
        passwordNotification: "Password Combination",
        tdsHeading: "TDS For Financial Year {year} was {amount}",
        tableCaption: "Interest Certificate",
        backToDashboard: "Back to Dashboard",
        patternVisiblity: "Pattern Visibility",
        alt: "Image for Note"
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
  return new Menu();
});
