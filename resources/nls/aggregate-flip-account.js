define([], function() {
  "use strict";
  var paymentsQuickLinks = function() {
    return {
      root: {
        accountTypeLabel: "Account Type",
        tdSubText: "Maturing {maturityDate} | {accountType}",
        ddSubText: "{product} | {accountType}",
        activeAccounts: "Active",
        inactiveAccounts: "Inactive / Closed",
        turnCard: "Click here to close and go to Accounts",
        myAccount: "My Accounts. Flip To View Account Details",
        openMenu: "Click to View account type",
        heading: {
          TRD: "Term Deposits",
          CSA: "Current & Savings",
          LON: "Loans and Finances",
          CCA: "Credit Cards",
          RD: "Recurring Deposits"
        },
        accountType: {
          CON: "Conventional",
          ISL: "Islamic"
        },
        status: {
          ACTIVE: "Active",
          DORMANT: "Dormant",
          CLOSED: "Inactive",
          ACT: "Active",
          IAT: "Inactive",
          HTL: "Hotlisted",
          CLD: "Cancelled"
        },
        accountNumber: "{accountNumber} | {status}",
        accountNumberWithNickName: "{accountNumber} - {nickName} | {status}",
        subHeading: "{count} Accounts",
        transactions: {
          "demand-deposit-details": "Account Details",
          "account-transactions": "View Statement",
          "cheque-book-request": "Cheque Book Request",
          "cheque-status-inquiry": "Cheque Status Inquiry",
          "cheque-stop-unblock": "Stop/Unblock Cheque",
          "debit-card-list": "Debit Cards",
          "td-details": "Deposit Details",
          "td-topup": "Top Up",
          "td-redeem": "Redemption",
          "rd-details" : "Deposit Details",
          "rd-redeem" : "Redemption",
          "statement-request" : "Request Statement",
          "loan-details": "Loan and Finance Details",
          "loan-repayment": "Repayment",
          "loan-disbursement": "Disbursement Inquiry",
          "loan-schedule": "Schedule Inquiry",
          "card-details": "Credit Card Details",
          "card-statement": "View Statement",
          "card-pay": "Card Payment",
          "request-pin": "Request PIN",
          "block-card": "Block/Cancel Card",
          "auto-pay": "Auto Pay",
          "reset-pin": "Reset PIN",
          "add-on-card": "Add-On Card"
        },
        linksLabel: {
          "forex-calculator": "Forex Calculator",
          "td-open": "New  Deposit",
          "savings-calculator": "Deposit Calculator",
          "td-calculator": "Deposit Calculator",
          "loan-eligibility-calculator": "Eligibility Calculator",
          "loan-calculator": "Installment Calculator",
          "card-pay": "Make Payments",
          "create-rd" : "New Recurring Deposit",
          "block-card": "Block Card"
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
  return new paymentsQuickLinks();
});
