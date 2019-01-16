define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var InwardRemittance = function() {
    return {
      root: {
        inwardRemittance: {
          header: "Inward Remittance Inquiry",
          headerDetail: "Inward Remittance Inquiry",
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
          remitAmount: "Remittance Amount",
          creditAccountDetails: "Credit Account Details",
          advice: "Download Advice",
          creditAmount: "Credit Amount",
          remitName: "Remitter Name",
          receiverDetails: "Receiver Details",
          transactionDetails: "Transaction Details",
          remitterDetails: "Remitter Details",
          details: "Inward Remittance Details List",
          creditAccountNumber: "Credit Account Number",
          creditAccountName: "Credit Account Name",
          creditAccountBranch: "Credit Account Branch",
          creditedOn: "Credited On",
          purpose: "Purpose of Remittance",
          description: "Description",
          address: "Address",
          bankDetails: "Bank Details",
          reset: "Reset",
          back: "Back",
          selectAccount: "Account Number",
          allAccounts: "All",
          ok: "Ok",
          noCASAAccount: "No Account(s) available",
          cancel: "Cancel",
          amountValidation: "Invalid Amount",
          toAmountValidation: "To amount cannot be less than from amount",
          fromAmountValidation: "From amount cannot be greater than to amount",
          linkDetails: "Click to see details for {reference}",
          linkDescription:"Click to see details for {reference}",
          tableHeader: "Inward Remittance details"
        },
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
  return new InwardRemittance();
});