define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var ManageAccountsLocale = function() {
    return {
      root: {
        header: "Manage Accounts",
        navBarDescription: "Navigation Bar to select action",
        selectAccount: "Select Account",
        requestForAccount: "Please select the account for which you want to perform the action for",
        backToDashboard: "Back to Dashboard",
        tabs: {
          "demand-deposits": {
            "demand-deposit-details": "Account Details",
            "account-transactions": "View Statement",
            "cheque-book-request": "Cheque Book Request",
            "cheque-status-inquiry": "Cheque Status Inquiry",
            "cheque-stop-unblock": "Stop/Unblock Cheque",
            "debit-card-list": "Debit Cards",
            "statement-request": "Request Statement",
            "sweep-in-instruction":"Sweep-in"
          },
          "term-deposits": {
            "td-details": "Deposit Details",
            "account-transactions": "View Statement",
            "td-topup": "Top Up",
            "td-redeem": "Redemption",
            "statement-request": "Request Statement",
            "td-amend": "Edit Maturity Instruction"
          },
          "recurring-deposit": {
            "rd-details": "Deposit Details",
            "rd-redeem": "Redemption",
            "account-transactions": "View Statement",
            "rd-amend":"Edit Maturity Instruction",
            "statement-request": "Request Statement"
          },
          "debit-card": {
            "debit-card-details": "Debit Card Limits",
            "debit-card-pin-request": "Request PIN",
            "debit-card-hotlisting": "Block/Hotlist Card",
            "upgrade-card": "Upgrade Card",
            "reset-pin": "Reset PIN",
            "reissue-card": "Reissue Card"
          },
          "billPayments": {
            "bill-payments-favorites": "Favorites",
            "manage-bill-payments": "Bills",
            "register-biller": "Add Biller",
            "modify-biller": "Manage Billers",
            "quick-bill-payment": "Quick Bill Pay",
            "quick-recharge": "Quick Recharge",
            "payment-history": "Payment History"
          },
          payments: {
            "bill-payments": "Pay Bills",
            favorites: "Favorites",
            "payments-money-transfer": "Transfer Money",
            "issue-demand-draft": "Issue Demand Drafts",
            "scheduled-payments": "Upcoming Payments",
            "manage-payees-billers": "Manage Payees & Billers",
            "adhoc-payments": "Adhoc Transfer",
            "multiple-payments": "Multiple Transfers",
            "multiple-bill-payments": "Multiple Bill Payments"
          },
          "nominee":{
            "casa-nominee-list" : "Current and Savings",
            "td-nominee-list" : "Term Deposits",
            "rd-nominee-list" : "Recurring Deposits"
          },
          "standing-instructions": {
            "standing-instructions-landing": "View Repeat Transfers",
            "payments-money-transfer": "Set Repeat Transfers"
          },
          debtor: {
            "debtor-group-list": "Manage Debtors",
            "debtor-money-request": "Request Money"
          },
          payee: {
            "bank-account-payee": "Bank Account",
            "demand-draft-payee": "Demand Draft"
          },
          loans: {
            "loan-details": "Loan and Finance Details",
            "account-transactions": "View Statement",
            "loan-repayment": "Repayment",
            "loan-disbursement": "Disbursement Inquiry",
            "loan-schedule": "Schedule Inquiry"
          },
          creditcard: {
            "card-details": "Credit Card Details",
            "card-statement": "View Statement",
            "card-pay": "Card Payment",
            "request-pin": "Request PIN",
            "block-card": "Block/Cancel Card",
            "auto-pay": "Auto Pay",
            "reset-pin": "Reset PIN",
            "add-on-card": "Add-On Card"
          },
          "loan-calculator": {
            "loan-calculator": "Installment Calculator",
            "loan-eligibility-calculator": "Eligibility Calculator"

          },
          alerts: {
            "alerts-profile": "Profile",
            "alerts-casa": "Saving & Current",
            "alerts-td": "Term Deposits",
            "alerts-loans": "Loans",
            "alerts-payments": "Payments"
          },
          "interest-certificates":{
            "interest-certificate-casa":"Current and Savings",
            "interest-certificate-td":"Deposits",
            "interest-certificate-loans":"Loans"
          }
        },
        generic: Generic
      },
      ar: false,
      fr: true,
      cs: false,
      sv: false,
      en: false,
      "en-us": false,
      el: false
    };
  };
  return new ManageAccountsLocale();
});
