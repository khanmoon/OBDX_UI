define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var QuickLinks = function() {
    return {
      root: {
        widgetHeading: "Quick Links",

        quickLinks: {
          actionCardClick: "Action Card",
          actionCardClickTitle: "Click For Action Card",
          clickHere: "Click for {name}",
          casa: {
            stopUnblock: "Stop/Unblock Cheque",
            chequeStatus: "Cheque Status Inquiry",
            requestCheque: "Cheque Book Request",
            statementRequest: "Request Statement"
          },
          td: {
            openTD: "New Deposit",
            topUp: "Top Up",
            partFull: "Redemption",
            statementRequest: "Request Statement",
            redemptionInquiry: "Redemption Inquiry",
            topUpInquiry: "Top Up Inquiry",
            editMaturity: "Edit Maturity Instruction"
          },
          loans: {
            schedule: "Schedule Inquiry",
            repayment: "Repayment",
            disbursement: "Disbursement Inquiry",
            statementRequest: "Request Statement"
          },

          makers: {
            ownAccountTransfer: "Own Account Transfer",
            payments: "Funds Transfer",
            utilityBills: "Utility Bills",
            addPayee: "Add Payee",
            bulkFileUpload: "File Upload",
            openTD: "Open TD",
            issueDemandDraft: "Issue Draft",
            adhocPayments: "Adhoc Payment",
            bulkFileView: "Uploaded Files Inquiry",
            billPayment: "Bill Payments",
            billerList: "Manage Billers",
            payeeList: "Manage Payees",
            billPaymentTitle: "Click to Pay Bills",
            billerListTitle: "Click to Manage Billers",
            payeeListTitle: "Click to Manage Payees",
            paymentsTitle: "Click to Transfer Funds"
          },
          labels: {
            quickHeading: "Choose from our range of products",
            SAVINGSH1: "Savings",
            CHECKINGH1: "Checking",
            TERMDEPOSITH1: "Term Deposits",
            CREDITCARDH1: "Credit Cards",
            AUTOLOANH1: "Auto Loans",
            PERSONALLOANH1: "Personal Loans",
            MORTGAGELOANIPAH1: "In Principle Approval",
            MORTGAGELOANH1: "Mortgage Loans",
            PAYDAYLOANH2: "Payday",
            AUTOLOANH2: "Auto Loans",
            SAVINGSH3: "Savings",
            CHECKINGH3: "Current Account",
            AUTOLOANH3: "Auto Loans",
            PERSONALLOANH3: "Personal Loans",
            products: "Products",
            toolsAndCalculators: "Tools & Calculators",
            contactUs: "Contact Us",
            ATMAndBranch: "ATM & Branch",
            goBack: "Go Back",
            goHome: "Return to Home Page"
          }

        },
        clickHere: "Click for {name}",
        generic: Generic
      },
      ar: true,
      fr: true,
      cs: true,
      sv: true,
      en: false,
      "en-us": false,
      el: false
    };
  };
  return new QuickLinks();
});
