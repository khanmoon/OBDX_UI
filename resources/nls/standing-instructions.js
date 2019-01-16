define([
  "ojL10n!resources/nls/messages-payments",
  "ojL10n!resources/nls/transfer-types",
  "ojL10n!resources/nls/generic",
  "ojL10n!resources/nls/payments-common"
], function(Messages, TransferType, Generic, Common) {
  "use strict";
  var TransactionLocale = function() {
    return {
      root: {
        payments: {
          standinginstructions: {
            pendingApproval: "Pending Approval",
            beneficiaryName: "Payee Account Name",
            accountType: "Account Type",
            accountNumber: "Account Number",
            accountName: "Account Name",
            branch: "Branch",
            fromAccount: "From Account",
            remarks: "Remarks",
            transFreq: "Transfer Frequency",
            confirm: "Confirm",
            frequency: "Frequency",
            startDate: "Start Date",
            endDate: "Stop Date",
            create: "Add New",
            accNumber: "Account Number",
            done: "Done",
            standinginstruction_header: "Repeat Transfers",
            stopRepeatTransfer: "Stop Repeat Transfer",
            referenceNumber: "Reference Number",
            transferFrom: "Transfer From",
            transferTo: "Transfer To",
            repeat: "Repeat",
            transferFrequency: "Transfer Frequency",
            note: "Note",
            stopTransfermsg: "After {instances} instances",
            nextPayment: "Next Payment",
            successmessage: "You have stopped Repeat Transfer to {name}",
            stopSImessage: "Are you sure you want to stop Repeat Transfer?",
            back: "Back",
            amount: "Amount",
            cancel: "Cancel",
            setuprepeattransfer: "Setup Repeat Transfer",
            sucessful: "Successful!",
            stopTransfer: "Stop Transfer",
            instances: "instances",
            REC: "Repeat Transfer",
            NONREC: "Transfer",
            canceltransfer: "Cancel Transfer",
            "cancel-si-message": "Are you sure you want to cancel {transfer} to {name}?",
            "cancel-si-success": "You have cancelled {transfer} to {name}.",
            view: "Stop Repeat Transfer",
            purpose: "Purpose",
            tableheader: "Repeat Transfer List",
            confirmCancelSI: "Stop Repeat Transfer",
            verifyCancelSI: "Stop Standing Instruction",
            stop: "Stop",
            action: "Action",
            transfertype: "Transfer Type",
            searchBy: "Nickname",
            viewdetails: "View Repeat Transfer",
            moreOptions: "More Options",
            options: "More Options",
            common: Common.payments.common,
            msgtype: TransferType.payments.standinginstructions.msgtype,
            frequencymsg: {
              everyday: "Every day",
              everymonth: "Every month",
              everyyear: "Every year",
              everyndays: "Every {d} days",
              everynmonths: "Every {m} months",
              everynyears: "Every {y} years",
              everynyearsnmonths: "Every {y} years {m} months",
              everynyearsndays: "Every {y} years {d} days",
              everynmonthsndays: "Every {m} months {d} days",
              everynyearsnmonthsndays: "Every {y} years {m} months {d} days"
            }
          },
          label: {
            view: "View",
            stop: "Stop"
          },
          common: Common.payments.common,

          messages: Messages,

          generic: Generic
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
  return new TransactionLocale();
});