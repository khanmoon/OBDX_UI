define([
  "ojL10n!resources/nls/messages",
  "ojL10n!resources/nls/generic"
], function(Messages, Generic) {
  "use strict";
  var LinkageSetUpLocale = function() {
    return {
      root: {
        common: {
          back: "Back",
          review: "Review",
          view: "View",
          done: "Done",
          cancelConfirm: "Are you sure you want to cancel this transaction ?",
          confirmation: "confirmation",
          transactionMessage: "Transaction completed.",
          yes: "Yes",
          no: "No",
          completed: "Completed.",
          partyID: "Party ID",
          partyName: "Party Name",
          emptyTableText: "There are no parties linked to selected parent party.",
          INITIATED: "Initiated",
          ACCEPTED: "Pending Approval",
          REJECTED: "Rejected",
          deleteIcon: "Delete selected party"
        },
        headers: {
          name: "Party To Party Linkage",
          linkparties: "Link Parties",
          linkedparties: "Linked Parties",
          create: "Create",
          reviewPartyLinkage: "Review",
          searchresults: "Search Results"
        },
        columnHeader: {
          action: "Action"
        },
        fieldname: {
          partyId: "Parent Party ID",
          partyName: "Parent Party Name",
          childpartyid: "Linked Party ID",
          childpartyname: "Linked Party Name",
          addReviewHeaderMsg: "You Initiated a request for updating the Party to Party Linkage. Please review details before you confirm!",
          addCreateReviewHeaderMsg: "You Initiated a request for creating the Party to Party Linkage. Please review details before you confirm!"
        },
        fieldvalues: {
          fullname: "{firstName} {lastName}"
        },
        buttons: {
          addMore: "Add"
        },
        errors: {
          partyAddedAlready: "Selected Party is already added as Linked Party.",
          parentPartyCheck: "Linked Party selected is same as the Parent Party.",
          partyPreferenceCheck: "Party Preference is not maintained for the selected party.",
          p2paccountsetupexists: "Linkage cannot be deleted with active Party Account and User Account Access for this linkage.",
          idnamevalidation: "Please provide Party ID or Party Name.",
          emptyPartyCheck: "No party selected for linkage, please link a party and save.",
          channelAccessCheck: "Channel Access is disabled in Party Preferences for the selected party.",
          invalidInputProvided: "The information you have provided is incorrect. Please check your details."
        },
        popupMessages: {
          backMessage: "If you go back all changes made will be lost.  Are you sure you want to go back?"
        },
        generic: Generic
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
  return new LinkageSetUpLocale();
});
