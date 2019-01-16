define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var LoanScheduleModel = function() {
    return {
      root: {
        loanDetails: {
          customerId: "Customer ID",
          openingDate: "Opening Date",
          maturityDate: "Maturity Date",
          status: "Status",
          interestRate: "Interest Rate",
          facilityId: "Facility ID",
          branch: "Branch",
          sanctionedAmount: "Sanctioned Loan Amount",
          totalAmountDisbursed: "Total Amount Disbursed",
          amountRepaidTillDate: "Amount Re-paid Till Date",
          outstandingAmt: "Outstanding Amount",
          interestRepaymentFreq: "Interest Frequency",
          principalRepFreq: "Principal Frequency",
          repaymentModeLabel: "Repayment Mode",
          latePaymentPenalty: "Late Payment Penalty",
          prepaymentPenalty: "Prepayment Penalty",
          advPayAmt: "Advance Payment Amount",
          loanTenure: "Loan Tenure",
          noOfInst: "Total Installments",
          paidInst: "Installments Paid",
          remInst: "Remaining Installments",
          nextInstDate: "Next Installment Date",
          nextInstAmt: "Next Installment Amount",
          principalArrears: "Principal Arrears",
          interestArrears: "Interest Arrears",
          latePaymentCharges: "Late Payment Charges",
          otherCharges: "Other Fees",
          linkedMurabhaBill: "Linked Murabha bill",
          custProfitShare: "Customer profit Share",
          leaseType: "Lease Type",
          leasePaymntMode: "Lease Payment Mode",
          bankShare: "Bank Share",
          custShare: "Customer Share",
          profitRate: "Profit Rate",
          bnkProfitShare: "Bank Profit Share",
          arrears: "Arrears",
          financePurpose: "Purpose Of Financing",
          outstandingFin: "Outstanding Finances",
          installArrears: "Installment Arrears",
          backProfitDue: "Bank Profit Due",
          finTenure: "Financing Tenure",
          financeHeading: "Financing Details",
          financedAmt: "Financed Amount",
          financedAmtDis: "Financed Amount Disbursed",
          custGracePeriod: "Customer Grace Period And Frequency",
          suplGracePeriod: "Supplier Grace Period And Frequency",
          installments: "Installments",
          loanAmountHeading: "Loan Amounts",
          account: "Account Details",
          tenureText: "{months} months {days} days",
          loanSchButton: "Schedule",
          viewDetails: "Loan and Finance Details",
          finAmount: "Financed Amount",
          finAmountDisbursed: "Financed Amount Disbursed",
          loanDis: "Disbursement Details",
          financeRepaymentFreq: "Finance Payment Frequency",
          prepaymentProfit: "Profit Rate for Advance Payment",
          latePaymentProfit: "Profit Rate for Late Payment",
          repaymentHeading: "Repayment",
          loanRepayButton: "Repay",
          bankDetails: "{branchName} {branchCode}",
          statusLevel: {
            ACTIVE: "Active",
            CLOSED: "Closed",
            DORMANT: "Dormant"
          },
          frequency: {
            Monthly: "Monthly",
            Weekly: "Weekly",
            Quarterly: "Quaterly",
            SEMI_ANUALLY: "Semi Annually",
            BI_MONTHLY: "Bi Monthly",
            ONE_TIME_PAYMENT: "One Time Payment",
            Annually: "Annually"
          },
          repaymentMode: {
            CCD: "Credit Card",
            CLG: "Clearing",
            DCD: "Debit Card",
            EAC: "External Account",
            EPO: "Electronic Pay Order",
            GIR: "GIRO",
            ICK: "Internal Cheque",
            INS: "Instrument",
            TLR: "Cash/Teller",
            PDC: "Post Dated Cheque",
            ACC: "Account"
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
  return new LoanScheduleModel();
});