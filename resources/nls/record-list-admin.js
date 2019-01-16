define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var RecordListAdminLocale = function() {
    return {
      root: {
        recordListAdmin: {
          search: "Search",
          clear: "Clear",
          cancel: "Cancel",
          back: "Back",
          action: "Action",
          selectRStatus: "Select Record Status",
          debitAccNo: "Debit Account No",
          debitAcctNo: "Debit Account Number : {debitAccNo}",
          creditAccNo: "Credit Account No",
          creditAccDetails: "Credit Account Details",
          creditAcctNo: "Credit Account Number : {creditAccNo}",
          fromDate: "From Value Date",
          toDate: "To Value Date",
          transactionType: "Transaction Type",
          details: "Admin Biller Record List",
          type: "Type",
          paymentType: "Payment Type",
          recordList: "Record List",
          fromAmount: "From Amount",
          toAmount: "To Amount",
          amt: "Amount",
          amount: "Amount : {amt}",
          currencyLabel: "Currency",
          currency: "Currency : {currency}",
          selectCurrency: "Select Currency",
          rStatus: "Record Status",
          valueDt: "Value Date",
          valueDate: "Value Date : {valueDt}",
          noData: "No data to display. Please modify your search inputs.",
          currencyErrorMsg: "Please provide currency for the amount.",
          recordViewErrorMsg: "Please provide search inputs.",
          dateSelectErrorMsg: "Please specify both start and end date.",
          amountSelectErrorMsg: "Please provide both from and to amount.",
          recordsNotAvailable: "The record details will be available once the file has been verified.",
          recordsUnAvailable: "The record details are not available since the uploaded file had errors.",
          searchEnable: "Enable Search",
          searchEnableText: "Click to Enable Search",
          downloadReceipt: "Download e-Receipt",
          downloadReceiptText: "Click to download e-Receipt",
          eReceipt: "E-Receipt",
          beneName: "Payee Name",
          billerName: "Biller Name",
          billerCategory: "Biller Category",
          billerType: "Biller Type",
          billerLocation: "Biller Location"
        },
        generic: Generic
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
  return new RecordListAdminLocale();
});
