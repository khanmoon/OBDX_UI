define([], function() {
  "use strict";
  var ConsolidatedListingLocale = function() {
    return {
      root: {
        eStatement: {
          msg: "View Statement",
          selectNote: "Select a period to download your pre-generated Statements.",
          search: "Search",
          statementNo: "Statement Number",
          fromDate: "From",
          toDate: "To",
          download: "Download",
          unsubscribe: "Unsubscribe",
          main: "Activity",
          unsubscribeText: "You will stop receiving monthly statements for your account {accountNumber} on email {emailID}",
          subscribeText: "You will receive monthly statements for your account {accountNumber} by email at {emailID}",
          unsubscribeCCText: "You will stop receiving monthly statements for your credit card {cardId} by email at {emailID}",
          subscribeCCText: "You will receive monthly statements for your credit card {cardId} by email at {emailID}",
          unsubscribeCCConfirmText: "You have chosen to unsubscribe for the E-Statements. You will not receive monthly statements for your credit card {cardId} by email at {emailID}",
          subscribeCCConfirmText: "You have chosen to subscribe for the E-Statements. You will receive monthly statements for your credit card {cardId} by email at {emailID}",
          subscribedText: "You are Subscribed!",
          estatementHeading: "E-Statement",
          prodceedEstatement: "Proceed",
          searchResult: "Search Results",
          Statement: "Request Statement",
          subscribe: "Subscribe",
          confirm: "Confirm",
          cancel: "Cancel",
          done: "Done",
          all: "All",
          Debit: "Debits Only",
          Credit: "Credits Only",
          openingBalance: "Opening Balance:",
          closingBalance: "Closing Balance:",
          save: "Download",
          estatement: "Subscribe to E-Statement",
          estatementUnsub: "Unsubscribe to E-Statement",
          reqStatement: "Request Statement",
          year: "Year",
          month: "Month",
          allMonths: "All Months",
          typePDF: "pdf",
          tableHeading: "List Statement",
          tableRow: "Table Row",
          tableName: "Pre Generated Statement List",
          noSubscriptionData: "There is no subscription data available",
          ok: "Ok",
          successMessage: {
            physicalStatementRequest: "Your request for a statement has been submitted.",
            refNo: "Reference number {refNo}",
            eStatement: "E-Statement",
            unsubscribeEStatement: "Request for eStatement unsubscription"
          }
        },
        common: {
          successful: "Successful!",
          select: "Select"
        }

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
  return new ConsolidatedListingLocale();
});
