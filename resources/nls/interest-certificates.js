define([], function() {
  "use strict";
  var SecurityMenu = function() {
    return {
      root: {
        title: "Interest Certificates",
        labels: {
          "interest-certificate-casa": "Current and Savings",
          "interest-certificate-td": "Deposits",
          "interest-certificate-loans": "Loans",
          "selectFinancialYear": "Select Financial Year",
          "depositLabel": "Deposit"
        },
        specificDeposit: "Specific Account",
        allDeposits: "All Accounts",
        interestHeading: "Interest for your Account/Deposit with us for selected period is as following",
        tableCaption: "Interest Certificate",
        customerId: "Customer ID",
        pleaseSelect: "Please Select",
        fromDate: "From Date",
        toDate: "To Date",
        view: "View",
        year: "{fromYear}-{toYear}",
        back: "Back",
        download: "Download",
        interestCertificateTable: "Interest Certificate Table",
        financialYear: "Financial Year",
        duration: "Duration",
        termDeposits: "Term Deposits",
        selectFor: "Select Interest Certificate for",
        tableHeading: {
          "accountNo": "Account Number",
          "productType": "Product Type",
          "interestCredited": "Interest Credited",
          "interestPaid": "Interest Paid",
          "date": "Date"
        },
        passCombination: "On opening the PDF, you will be asked to enter a password.  Your password consists of the first 4 letters of your user name in capital case, followed by the date and month of your birth (in DDMM format)",
        passwordExample: "For example, if the user name is Roopa Lal and the date of birth is 23-12-1976, then your password will be ROOP2312.",
        ok: "Ok",
        passwordNotification: "Password Combination",
        recurringDeposits: "Recurring Deposits",
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
  return new SecurityMenu();
});
