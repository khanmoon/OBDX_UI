define([], function() {
  "use strict";
  var AccountDetailsLocale = function() {
    return {
      root: {
        accountDetails: {
          labels: {
            accountType: "Account Type",
            accountCurrency: "Account Currency",
            productName: "Product Name",
            currency: "Currency",
            holdingPattern: "Holding Pattern",
            branch: "Branch",
            status: "Status",
            accountBranch: "Account Branch",
            accountStatus: "Account Status",
            selectAccount: "Select Account",
            moreActions: "More Actions",
            statementRequest: "Request Statement",
            requestChequeBook: "Request Cheque Book",
            chequeStatusInquiry: "Cheque Status Enquiry",
            stopUnblockCheque: "Stop/Unblock Cheque",
            currentBalance: "Current Balance",
            dates: "Dates",
            amount: "Amount",
            accountDetails: "Account Details",
            basic: "Account Info",
            balances: "Balances",
            limits: "Limits",
            trends: "Trends",
            fullBranchDetails: "{name} {line1}, {line2}, {country}",
            nickname: "Nickname"

          },
          balances: {
            labels: {
              totAvlBalance: "Available Balance",
              currentBalance: "Current Balance",
              amtOnHold: "Amount On Hold",
              unclearedFunds: "Uncleared Balance",
              netBalance: "Net Balance",
              averageBalance: "Average Balance"
            }
          },
          limits: {
            labels: {
              overdraft: "Overdraft Limit",
              minBalReqd: "Minimum Balance Required",
              eligibleAgainstUncleared: "Eligible Against Uncleared",
              dailyAtmWithdrawal: "Daily ATM Withdrawal",
              aufLimit: "AUF Limit"
            }
          },
          facilities: {
            labels: {
              chequeBook: "Cheque Book",
              sweepOut: "Sweep Out",
              sweepIn: "Sweep In"
            }
          },
          status: {
            labels: {
              ACTIVE: "Active",
              CLOSE: "Close",
              DORMANT:"Dormant"
            }
          }
        }
      },
      ar:true,
      fr:true,
      cs:true,
      sv:true,
      en:false,
      "en-us":false,
      el:true
    };
  };
  return new AccountDetailsLocale();
});
