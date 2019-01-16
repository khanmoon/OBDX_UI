define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var LoanScheduleModel = function() {
    return {
      root: {
        schedule: {
          loanSch: "Schedule Inquiry",
          firstInstallment: "First Installment",
          lastInstallment: "Last Installment",
          installmentsPaid: "Installments Paid",
          amountPaidTillDate: "Amount Paid Till Date",
          dateRange: "Date Range",
          date: "Due Date",
          principal: "Principal",
          int: "Interest",
          profit: "Profit",
          charge: "Charges",
          instAmt: "Installment",
          updInsAmt: "Unpaid Installment",
          approvedAmount: "Amount Financed",
          loanSchName: "Name",
          loansChartInterest: "Interest Paid",
          islamicloansChartInterest: "Profit Paid",
          loansChartPrincipal: "Principal Paid",
          loansChartOutstanding: "Outstanding Amount",
          selectAccount: "Select Account",
          noOfInst: "Total Installments",
          srNo: "Sr No.",
          fromDate: "From Date",
          toDate: "To Date",
          pdfClick: "Click here to download PDF",
          pdfClickTitle: "Download PDF",
          tableLabel: "Loan Schedule Table"
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
  return new LoanScheduleModel();
});