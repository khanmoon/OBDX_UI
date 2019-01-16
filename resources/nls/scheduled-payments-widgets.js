define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";
  var UpcomingPaymentsLocale = function() {
    return {
      root: {
        upcomingTnPDetails: {
          labels: {
            header: "Upcoming Transfers & Payments",
            todayCount: "Today ({count})",
            thisWeekCount: "This Week({count})",
            thisMonthCount: "This Month ({count})"
          }
        },
        upcomingPayments: {
          viewsi: "View Standing Instructions",
          viewsititle: "View Standing Instructions",
          createsititle: "Create Standing Instructions",
          smalltitle: "Upcoming Payments",
          title: "Upcoming Payments Inquiry",
          allAccounts: "All",
          week: "This Week",
          month: "This Month",
          titleDelete: "Delete Upcoming Payment",
          pendingApproval: "Pending Approval",
          repeatmsgmonths: "Every {n} months",
          repeatmsgdays: "Every {n} days",
          repeatmsgyears: "Every {n} years",
          repeatmsgmonth: "Every month",
          repeatmsgday: "Every day",
          repeatmsgyear: "Every year",
          noupcomingpayments: "No Upcoming Payments",
          viewall: "View All",
          viewallText: "View All Upcoming Payments",
          viewallTitle: "Click To View All Upcoming Payments",
          setSI: "Set Repeat Transfers",
          setSITitle: "Click To Set Repeat Transfers",
          repeat: "Repeat",
          onetime: "One Time",
          date: "Date",
          amount: "Amount",
          description: "Description",
          transferType: "Type",
          favouring: "Favouring",
          transferto: "Transfer To",
          transferfrom: "Transfer From",
          cancelTitle: "Cancel Transfer",
          selectAccount: "Account Number",
          noCASAAccount: "No Account(s) available",
          beneficiaryName: "Payee Name",
          transType: "Transaction Type",
          accountDetails: "Account Details",
          paymentType: "Payment Type",
          action: "Action",
          header: "Upcoming Payment Details",
          confirmDelete: "Cancel Instruction",
          cancelSuccess: "You have cancelled transfer to {name}.",
          noupcomingmsg: "Relax! You currently do not have any Upcoming Payments",

          type: {
            REC: "Repeat Transfer",
            NONREC: "Scheduled Single Payment",
            INTERNALFT_PAYLATER: "Internal",
            INTERNATIONALFT_PAYLATER: "International",
            DOMESTICFT_PAYLATER: "Domestic",
            SELFFT_PAYLATER: "Self",
            INTERNALFT_SI: "Internal",
            SELFFT_SI: "Self",
            INDIADOMESTICFT_PAYLATER: "Domestic",
            UKPAYMENTS_PAYLATER: "Domestic",
            SEPADIRECTDEBIT_PAYLATER: "Domestic",
            SEPACREDITTRANSFER_PAYLATER: "Domestic",
            SEPACARDPAYMENT_PAYLATER: "Domestic",
            INDIADOMESTICFT_SI: "Domestic",
            UKPAYMENTS_SI: "Domestic",
            SEPACARDPAYMENTS_SI: "Domestic",
            SEPADIRECTDEBIT_SI: "Domestic",
            SEPACREDITTRANSFER_SI: "Domestic",
            INTERNATIONALDRAFT_PAYLATER: "International",
            DOMESTICDRAFT_PAYLATER: "Domestic",
            table: {
              INTERNATIONALDRAFT_PAYLATER: "International Draft",
              DOMESTICDRAFT_PAYLATER: "Domestic Draft",
              INTERNALFT_PAYLATER: "Internal Transfer",
              INTERNATIONALFT_PAYLATER: "International Transfer",
              DOMESTICFT_PAYLATER: "Domestic Transfer",
              SELFFT_PAYLATER: "Self Transfer",
              INTERNALFT_SI: "Internal Transfer",
              SELFFT_SI: "Self Transfer",
              INDIADOMESTICFT_PAYLATER: "Domestic Transfer",
              UKPAYMENTS_PAYLATER: "Domestic Transfer",
              SEPADIRECTDEBIT_PAYLATER: "Domestic Transfer",
              SEPACREDITTRANSFER_PAYLATER: "Domestic Transfer",
              SEPACARDPAYMENT_PAYLATER: "Domestic Transfer",
              INDIADOMESTICFT_SI: "Domestic Transfer",
              UKPAYMENTS_SI: "Domestic Transfer",
              SEPACARDPAYMENTS_SI: "Domestic Transfer",
              SEPADIRECTDEBIT_SI: "Domestic Transfer",
              SEPACREDITTRANSFER_SI: "Domestic Transfer"
            }
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
      el: true
    };
  };
  return new UpcomingPaymentsLocale();
});