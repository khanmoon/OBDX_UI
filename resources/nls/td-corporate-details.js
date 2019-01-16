define([], function() {
  "use strict";
  var AccountDetailsLocale = function() {
    return {
      root: {
        accountDetails: {
          labels: {
            selectAccount: "Select Account",
            originalPrincipalAmount: "Original Principal Amount",
            interestRate: "Interest Rate",
            currentPrincipalAmount: "Current Principal Amount",
            status: "Status",
            openTD: "Open TD",
            topUp: "Top Up",
            editMaturityInstruction: "Edit Maturity Instruction",
            moreActions: "More Actions",
            tenure: "{years} Years {months} Months {days} Days",
            redeem: "Redeem",
            requestStatement: "Request Statement",
            topUpInquiry: "Top Up Inquiry",
            redemptionInquiry: "Redemption Inquiry",
            investment: "Investment",
            currentPosition: "Current Position",
            maturity: "Maturity",
            currentPricipalAmount: "Current Principal Amount",
            pageHeader: "Deposit Details",
            currentBalance: "Current Balance",
            productName: "Product name",
            fullBranchDetails: "{name} {line1}, {line2}, {country}",
            nickname: "Nickname",
            accruedInterest: "Accrued Interest",
            lastInterestAccrualDate: "Last Interest Accrual Date"
          },
          depositDetails: {
            labels: {
              holdAmount: "Hold Amount",
              depositDate: "Deposit Date",
              valueDate: "Value Date",
              depositTerm: "Deposit Term",
              depositCertificateNumber: "Deposit Certificate Number",
              depositBranch: "Deposit Branch"
            }
          },
          maturityDetails: {
            labels: {
              maturityDate: "Maturity Date",
              maturityAmount: "Maturity Amount",
              maturityInstruction: "Maturity Instruction",
              payTo: "Pay To",
              rolloverAmount: "Rollover Amount"
            }
          },
          amountType: {
            P: "Principal",
            I: "Interest"
          },
          profit: "Profit",
          islamicInterestRate: "Profit Rate",
          maturityInstructions: {
            codes: {
              A: "Close on Maturity",
              I: "Renew Principal and {interestType}",
              P: "Renew Principal and Pay Out the {interestType}",
              S: "Renew Special Amount and Pay Out the Remaining Amount",
              T: "Renew {interestType} and Pay Out the Principal"
            }
          },
          payOutOption: {
            O: "Own Account",
            I: "Internal Account",
            E: "Domestic Bank Account"
          },
          payToMessage: "{percentage}% of {amountType} Amount",
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