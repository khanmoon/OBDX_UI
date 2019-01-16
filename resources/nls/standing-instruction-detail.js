define([
  "ojL10n!resources/nls/generic",
  "ojL10n!resources/nls/payments-common"
], function(Generic, Common) {
  "use strict";
  var SIDetailsLocale = function() {
    return {
      root: {
        payments: {
          labels: {
            standinginstruction_header1: "Repeat Transfer - {paymentType} {externalReferenceNumber}",
            standinginstruction_header2: "Execution Details",
            standinginstruction_header3: "Payments History",
            standinginstruction_header: "Repeat Transfers",
            transferTo: "Transfer To",
            transferFrom: "Transfer From",
            nextPayment: "Next Payment",
            amount: "Amount",
            purpose: "Purpose",
            reference: "Note",
            startDate: "Start Date",
            endDate: "End Date",
            frequency: "Frequency",
            stop: "Stop",
            cancel: "Cancel",
            stopSIWarning: "Are you sure you want to Stop Repeat Transfer?",
            yes: "Yes",
            no: "No",
            stopSIHeader: "Stop Repeat Transfer",
            transferToValue: "{payeeNickName} {creditAccountId}",
            headerName: "View Repeat Transfer"

          },
          details: {
            slNo: "Sr No.",
            executionDate: "Execution Date",
            status: "Status",
            failureReason: "Reason for Failure"
          },
          types: {
            INT: "Initiated",
            PVN: "Pending Verification",
            VER: "Verified",
            SNT: "Sent",
            COM: "Completed",
            TOT: "Time out",
            ERR: "Transaction Failure"
          },
          paymentTypes: {
            INDIADOMESTICFT_SI: "Domestic",
            SELFFT_SI: "Self",
            INTERNALFT_SI: "Internal"
          },
          generic: Generic,
          common: Common.payments.common
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
  return new SIDetailsLocale();
});