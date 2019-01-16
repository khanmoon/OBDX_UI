define([], function() {
  "use strict";
  var statementsLocale = function() {
    return {
      root: {
        statements: {
          UBT: "Unbilled Transactions",
          BT: "Billed Transactions",
          amount: "Amount",
          date: "Date",
          description: "Description",
          card_title: "Statement",
          card_viewall: "View All",
          cardHeading: "Card Statement",
          displayContent: "{displayValue} {nickname}",
          miniStatement: "Mini Statement",
          moreDetails: "More Details",
          transactions: "Transactions",
          transactionList: "Transaction List",
          cardNumber: "Card Number",
          view: "View Options",
          estatementText: "Click to view E-Statement",
          estatement: "E-Statement",
          downloadPre: "Pre-Generated Statement",
          downloadstatementHeading: "Download-Pregenerated Statement",
          statement: "Download Statement",
          statementText: "Click to Download Statement",
          amountDue: "Total Amount Due:",
          availCredit: "Available Credit:",
          dueDate: "Due Date:",
          estatementHeading: "E-Statement",
          creditCardNumber: "Credit Card Number",
          creditCardStatement: "Credit Card Statement",
          txnView: "Transaction type",
          fromDate: "From Date",
          toDate: "To Date",
          cr: "Cr",
          dr: "Dr"
        },
        cardLinks: {
          viewStatement: "View Statement",
          cardPayment: "Card Payment",
          requestPin: "Request PIN",
          blockCard: "Block/Cancel Card",
          autoPay: "Auto Pay",
          resetPin: "Reset PIN",
          addOnCard: "Add-On Card"
        }
      }
    };
  };
  return new statementsLocale();
});
