define(["ojL10n!resources/nls/generic"], function (Generic) {
  "use strict";
  var TermDepositAmend = function () {
    return {
      root: {
        termDepositDetails: {
          customerDetails: {
            holdingPattern: "Holding Pattern",
            jointAccHolder: "Joint Account Holder {count}"
          },
          holdingPattern: {
            SINGLE: "Single",
            JOINT: "Joint"
          },
          nomination: "Nomination",
          nomineeStatus: {
            true: "Registered",
            false: "Not Registered"
          },
          islamicInterestRate: "Profit Rate",
          depositDetails: "Deposit Details",
          sourceAccount: "Source Account",
          depositAmount: "Deposit Amount",
          maturityDate: "Maturity Date",
          closedDate:"Closed Date",
          interestRate: "Rate of Interest",
          maturityAmount: "Maturity Amount",
          netCreditAmount: "Net Credit Amount",
          originalPrincipal: "Original Principal Amount",
          currentPrincipal: "Current Principal Amount",
          depositDate: "Deposit Date",
          valueDate: "Value Date",
          depositTerm: "Deposit Term",
          holdAmount: "Hold Amount",
          certificateNumber: "Deposit Certificate Number",
          viewDepositRates: "View Rates",
          holdingDetails: "Holding Details",
          accountDetails: "Account Details",
          interestDetails: "Interest Details",
          accruedInterest: "Accrued Interest",
          islamicAccruedInterest: "Accrued Profit",
          lastInterestAccrualDate: "Last Interest Accrual Date",
          maturityDetails: "Maturity Details",
          status: "Status",
          products: "Select Product",
          selectAccount: "Select Account",
          depositName: "Deposit Name",
          maturityPeriod: "Maturity Period",
          depositTenure: "Deposit Tenure",
          date: "Date",
          revisedPrincipal: "Revised Principal Amount",
          revisedMaturity: "Revised Maturity Amount",
          revisedInterest: "Revised Interest Amount",
          depositBranch: "Deposit Branch",
          customerId: "Customer ID",
          sweepIn: "Sweep-in Provider",
          sweepInFlags: {
            active: "Yes",
            inactive: "No"
          },
          cardStatus: {
            ACTIVE: "Active",
            CLOSED: "Closed"
          },
          currency: "Currency",
          balance: "Balance",
          tdProduct: "Term Deposit Product",
          payToMessage: "{percentage}% of {amountType} Amount",
          amountType: {
            P: "Principal",
            I: "Interest"
          },
          profit: "Profit",
          productTenureMessage: "Minimum allowed is {minTenure} and Maximum allowed is {maxTenure}",
          productAmountMessage: "Amount should be between {minAmount} and {maxAmount}",
          charges: "Charges",
          redeem: "Redeem",
          topUp: "Top Up",
          maturityInstructions: {
            maturityInstruction: "Maturity Instruction",
            A: "Close on Maturity",
            I: "Renew Principal and {interestType}",
            P: "Renew Principal and Pay Out the {interestType}",
            S: "Renew Special Amount and Pay Out the Remaining Amount",
            T: "Renew {interestType} and Pay Out the Principal",
            redemptionInstruction: "Redemption Instructions",
            transferToAccount: "Complete transfer to account",
            additionalInfo: "Additional Information",
            N: "No Instruction set",
            editMaturityDetails: "Edit Maturity Details",
            calculateMaturity: "Calculate Maturity",
            revisedMaturityInstruction: "Revised Maturity Instruction",
            maturityInstructionsMessage: {
              A: "Entire maturity and interest amount will be transferred to the specified account",
              I: "Entire maturity and interest amount will be renewed again into a fresh term deposit",
              P: "Principal amount will be renewed into a fresh term deposit, whereas the interest amount will be paid out to the specified account",
              S: "Specified amount will be renewed into a fresh term deposit, whereas the balance amount will be paid out"
            }
          },
          payOutOption: {
            O: "Own Account",
            I: "Internal Account",
            E: "Domestic Bank Account"
          },
          payoutInstructions: {
            paidTo: "Paid to",
            payTo: "Pay To",
            transfer: "Transfer",
            renewAmount: "Rollover Amount"
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
  return new TermDepositAmend();
});
