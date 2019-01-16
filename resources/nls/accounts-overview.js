define([], function() {
  "use strict";
  var CasaAccountOverviewLocale = function() {
    return {
      root: {
        balanceLabel: {
          "term-deposits": "Net Balance",
          "demand-deposits": "Net Balance",
          loans: "Outstanding Balance"
        },
        accountDetails: {
          labels: {
            accountType: "Account Type",
            noOfAccount: "Number of Accounts",
            amount: "Amount",
            holdingPattern: "Holding Pattern",
            savingsAccount: "Savings Account",
            currentAccount: "Current Account",
            savingsAccountLegend: "Savings Account ({number})  {currencyCode}",
            currentAccountLegend: "Current Account ({number})  {currencyCode}",
            savingsAccountNumberLabel: "Savings {accountNo}",
            currentAccountNumberLabel: "Current {accountNo}",
            savingsAccountLabel: "Savings",
            currentAccountLabel: "Current",
            accountsOverview: "Accounts Overview",
            totalAccountsLabel: "Total = Savings + Current",
            creditLineHeader: "Credit Line Usage",
            utilizedAmount: "Utilized Amount ({currency})",
            remainingAmount: "Remaining Amount ({currency})",
            title: "Current & Savings",
            noOfAccounts: "Total Accounts",
            netBalance: "Net Balance",
            partyDropDown: "Currently displaying data for",
            all: "All Parties",
            viewDetails: "View Details",
            noCASAAccount: "You do not have any Savings and Current Account with us",
            noTdAccount: "You do not have any term deposit with us",
            noLoan: "Relax.. You do not have any loans to pay"
          },
          balances: {
            labels: {
              totAvlBalance: "Total Available Balance",
              currentBalance: "Current Balance",
              amtOnHold: "Amount On Hold",
              unclearedFunds: "Uncleared Funds"
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
  return new CasaAccountOverviewLocale();
});