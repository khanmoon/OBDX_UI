define([], function() {
  "use strict";
  var AccountDetailsLocale = function() {
    return {
      root: {
        loanDetails: {
          labels: {
            selectAccount: "Select Account",
            openingDate: "Opening Date",
            maturityDate: "Maturity Date",
            status: "Status",
            interestRate: "Interest Rate",
            branch: "Branch",
            loanSchedule: "Loan Schedule",
            loanRepayment: "Loan Repayment",
            loanDisbursement: "Loan Disbursement",
            loanDetails: "Loan Details",
            productName: "Product Name",
            nickname: "Nickname"
          },
          amountDetails: {
            labels: {
              header: "Amount Details",
              sanctionedLoanAmount: "Sanctioned Loan Amount",
              amountDisbursed: "Amount Disbursed",
              amountPrepaid: "Amount Prepaid",
              outstandingAmount: "Outstanding Amount",
              latePaymentPenality: "Late Payment Penalty",
              prePaymentPenality: "Pre Payment Penalty"
            }
          },
          installments: {
            labels: {
              header: "Installments",
              loanTenure: "Loan Tenure",
              totalInstallments: "Total Installments",
              nextInstallmentDate: "Next Installment Date",
              nextInstallmentAmount: "Next Installment Amount"
            }
          },
          borrowing: {
            labels: {
              header: "Borrowing",
              sanctionedAmount: "Sanctioned Amount",
              openingDate: "Opening Date",
              maturityDate: "Maturity Date",
              interestRate: "Interest Rate",
              disbursedAmount: "Disbursed Amount",
              loanBranch: "Loan Branch",
              accountStatus: "Account Status",
              facilityId: "Facility ID"
            }
          },
          arrears: {
            labels: {
              header: "Arrears",
              amountPrepaid: "Amount Prepaid",
              outstandingAmount: "Outstanding Amount",
              principalArrears: "Principal Arrears",
              interestArrears: "Interest Arrears",
              latePaymentCharges: "Late Payment Charges",
              fees: "Fees"
            }
          },
          repayments: {
            labels: {
              header: "Repayments",
              loanTerm: "Loan Term",
              totalInstallments: "Total Installments",
              remainingInstallments: "Remaining Installments",
              nextInstallmentDate: "Next Installment Date",
              nextInstallmentAmount: "Next Installment Amount",
              latePaymentPenalty: "Late Payment Penalty",
              prePaymentPenalty: "Pre Payment Penalty"
            }
          },
          dataLabels: {
            loanTenure: "{months} Months {days} Days"
          },
          status: {
            labels: {
              ACTIVE: "Active",
              CLOSE: "Close"
            }
          }
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
  return new AccountDetailsLocale();
});