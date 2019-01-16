define([
  "ojL10n!resources/nls/transfer-types",
  "ojL10n!resources/nls/payments-common"
], function(TransferType, Common) {
  "use strict";
  var UpcomingPaymentsLocale = function() {
    return {
      root: {
        reviewUpcomingPayments: {
          dealId:"Deal Id",
          header: "Upcoming Payment Details",
          accountNumber: "Account Number",
          amount: "Amount",
          repeatmsgmonths: "Every {n} months",
          repeatmsgdays: "Every {n} days",
          repeatmsgyears: "Ecery {n} years",
          repeatmsgmonth: "Every month",
          repeatmsgday: "Every day",
          repeatmsgyear: "Every year",
          repeatTransaction: "Repeat Transaction",
          repeatTransactionTitle: "Click here to Repeat the particular transaction",
          setSIAlt: "Set Repeat Transfer",
          setSITitle: "Click to set repeat transfer",
          favouring: "Favouring",
          alt: "Click to Cancel Upcoming Payment",
          title: "Click to Cancel Upcoming Payment",
          beneficiaryName: "Payee Name",
          accountType: "Account Type",
          draftType: "Draft Type",
          branch: "Branch",
          fromAccount: "From Account",
          transFreq: "Transfer Frequency",
          startDate: "Start Date",
          endDate: "End Date",
          transferon: "Transfer When",
          purpose: "Purpose",
          note: "Note",
          cancel: "Cancel",
          confirm: "Confirm",
          reviewHeaderMsg: "You initiated a request to Delete Upcoming Payment. Please review details before you confirm!",
          type: TransferType.payments.standinginstructions.msgtype
        },
        common: Common.payments.common,
        payments: Common.payments
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
  return new UpcomingPaymentsLocale();
});