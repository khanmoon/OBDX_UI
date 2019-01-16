define([], function() {
  "use strict";
  var RecentActivityLocale = function() {
    return {
      root: {
        CSA: "Savings",
        TRD: "Term Deposit",
        LON: "Loan",
        myBankName: "Zig Bank Limited.",
        recentActivity: "Recent Activity",
        selectAccountType: "Select Account Type",
        selectAccountNo: "Select Account",
        creditType: "{amt} Cr",
        debitType: "{amt} Dr",
        moreDetailsAlt: "View Recent Activity Details",
        moreDetails: "View More",
        viewStatement: "View Statement",
        viewStatementText: "Click to View Statement",
        moreDetailsTitle: "Click To View More Details",
        netWorthAlt: "Net Worth Graph",
        netWorthTitle: "Viewing Net Worth Graph",
        spendsAlt: "Spends Graph",
        spendsTitle: "Viewing Spends Graph",
        nodata: "No Transactions Available",
        transactionDetails: "Account Transaction Details",
        accountActivity: "My Account Activity",
        filter: "Apply",
        filterText: "Click to Apply",
        Period: "Period",
        type: "Type",
        Dr: "Dr",
        Cr: "Cr",
        bal: "Balance"
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
  return new RecentActivityLocale();
});
