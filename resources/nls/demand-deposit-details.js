define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var DemandDepositDetails = function() {
    return {
      root: {
        status: "Status",
        selectedAccount: "Select Account",
        demandDepositDetails: {
          header: "Account Details",
          basics: "Basics",
          customerId: "Customer ID",
          accountType: "Account Type",
          jointAccHolder: "Joint Account Holder",
          mode: "Mode of Operation",
          HoldingPattern: "Holding Pattern",
          Branch: "Branch",
          BalNLimits: "Balance Details",
          availableBalance: "Available Balance",
          Amounthold: "Amount on Hold",
          netBalance: "Net Balance",
          Unclearfunds: "Unclear Funds",
          averageBalance: "Average Balance",
          nomination: "Nomination",
          sweepIn: "Sweep-in Provider",
          sweepInFlags: {
            active: "Yes",
            inactive: "No"
          },
          nomineeStatus: {
            true: "Registered",
            false: "Not Registered"
          },
          Overdraft: {
            CON: "Overdraft Limit",
            ISL: "Financing Limits"
          },
          Advance: "Advance Against Unclear Funds Limit",
          back: "Back",
          status: {
            SINGLE: "Single",
            ACTIVE: "Active",
            CLOSED: "Closed",
            DORMANT: "Dormant"
          },
          holdingPattern: {
            DORMANT: "Dormant",
            JOINT: "Joint",
            SINGLE: "Single",
            JOINTLY: "Jointly"
          },
          modeOfOperation: {
            MAH: "Mandate Holder",
            SIN: "Single",
            EAS: "Either Anyone Or Survivor",
            FOS: "Former Or Survivor"
          },
          averageQuarterlyBalance: "Average Quarterly Balance",
          averageMonthlyBalance: "Average Monthly Balance",
          lienAmount: "Lien Amount",
          sweepInAmount: "Sweep-in Amount"
        },
        buttons: {
          debitCards: "Debit Cards",
          pinRequest: "Request PIN",
          limits: "View Limits",
          statement: "View Statement",
          blockCards: "Block Card",
          stopRequest: "Stop/Unblock Cheque",
          chequeRequest: "Request Cheque Book",
          status: "Cheque Status Enquiry"
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
  return new DemandDepositDetails();
});
