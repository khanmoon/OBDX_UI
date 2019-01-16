define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var QuickLinks = function() {
    return {
      root: {
        widgetHeading: "Quick Links",
        quickLinks: {
          casa: {
            stopUnblock: "Stop/Unblock Cheque",
            chequeStatus: "Cheque Status Inquiry",
            requestCheque: "Cheque Book Request",
            statementRequest: "Statement Request",
            stopUnblockTitle: "Click to Stop/Unblock Cheque",
            chequeStatusTitle: "Click to Enquire Cheque Status",
            requestChequeTitle: "Click to Request for Cheque Book",
            statementRequestTitle: "Click to Request for Statement"
          },
          td: {
            openTD: "New Deposit",
            topUp: "Top Up",
            partFull: "Redemption",
            statementRequest: "Statement Request",
            redemptionInquiry: "Redemption Inquiry",
            topUpInquiry: "Top Up Inquiry",
            editMaturity: "Edit Maturity Instruction",
            openTDTitle: "Click to initiate a new Deposit",
            topUpTitle: "Click to Top Up",
            partFullTitle: "Click to Redeem",
            editMaturityTitle: "Click to Edit Maturity Instruction"
          },
          loans: {
            schedule: "Schedule Inquiry",
            repayment: "Repayment",
            disbursement: "Disbursement Inquiry",
            statementRequest: "Statement Request",
            disbursementTitle: "Click for disbursement of Loan",
            scheduleTitle: "Click to schedule Your Loan payment",
            repaymentTitle: "Click to Repay Your Loan"
          },

          creditcards: {
            requestPin: "Request Pin",
            blockCard: "Block Card",
            miniStatement: "Mini Statement",
            serviceRequest: "Service Request",
            cancelCard: "Cancel Card"
          }
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
  return new QuickLinks();
});