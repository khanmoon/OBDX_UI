define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var OutwardRemittance = function() {
    return {
      root: {
        outwardRemittance: {
          header: "Outward Remittance Inquiry",
          headerDetail: "Outward Remittance Inquiry",
          accountNumber: "Account Number",
          transDate: "Transaction Date",
          fromDate: "From Date",
          toDate: "To Date",
          fromAmount: "From Amount",
          toAmount: "To Amount",
          transAmount: "Transaction Amount",
          transCurr: "Transaction Currency",
          search: "Search",
          refNumber: "Reference Number",
          debitAccountDetails: "Debit Account Details",
          reset: "Reset",
          back: "Back",
          selectAccount: "Account Number",
          allAccounts: "All",
          ok: "Ok",
          noCASAAccount: "No Account(s) available",
          advice: "Download Advice",
          debitAmount: "Debit Amount",
          payeeDetails: "Payee Details",
          remittedAmount: "Remitted Amount",
          debitAccountNumber: "Debit Account Number",
          debitAccountName: "Debit Account Name",
          debitAccountBranch: "Debit Account Branch",
          transactionDetails: "Transaction Details",
          remitterDetails: "Remitter Details",
          details: "Outward Remittance Details List",
          bankCharges: "Bank Charges",
          purpose: "Purpose of Remittance",
          description: "Description",
          payeeName: "Payee Name",
          address: "Address",
          bankDetails: "Bank Details",
          cancel: "Cancel",
          amountValidation: "Invalid Amount",
          toAmountValidation: "To amount cannot be less than from amount",
          fromAmountValidation: "From amount cannot be greater than to amount",
          linkDetails: "Click to see details for {reference}",
          linkDescription:"Click to see details for {reference}",
          tableHeader: "Outward remittance Details"
        },
        generic: Generic.generic,
        formats: Generic.formats,
        validationMessages: Generic.validationMessages
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
  return new OutwardRemittance();
});