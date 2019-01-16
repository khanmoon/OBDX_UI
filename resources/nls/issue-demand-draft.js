define([
  "ojL10n!resources/nls/messages-payments",
  "ojL10n!resources/nls/generic",
  "ojL10n!resources/nls/payments-common"
], function(Messages, Generic, Common) {
  "use strict";
  var TransactionLocale = function() {
    return {
      root: {
        payments: {
          demanddraft_header: "Issue Demand Draft",
          demanddraft_header_retail: "Demand Draft",
          ddHeader: "Demand Draft Details",
          confirm: "Transaction",
          linkAlt: "Click here to change your payee selection",
          linkTitle: "Click here to change your payee selection",
          domddheader: "Domestic Demand Draft",
          domddinheader: "Domestic Demand Draft Instruction",
          intddheader: "International Demand Draft",
          intddinheader: "International Demand Draft Instruction",

          cancelConfirm: "Are you sure you want to cancel the operation?",
          favorite: {
            unfavorite: "Unfavourite",
            header: "Favorite",
            deleteFavouriteMsg: "Are you sure you want to remove transfer to {name} for {amount} as a favorite?",
            deleteFavouriteSuccess: "{paymenttype} to {name} for {amount} has been removed from favorites",
            favadded: "It will save payment to {name} as a favorite transaction.",
            favsuccess: "Successfully added favorite for {name}"
          },
          payee: {
            displayName: "{group} - {payee}",
            domestic: {
              modeofdelivery: "Mode of Delivery"
            }

          },
          demanddraft: {
            selectpayee: "Please select a payee.",
            viewlimits: "View Limits",
            viewlimitsTitle: "View Limits",
            channel: "Channel",
            showInformation: "Select channel to view its limits",
            pleaseSelect : "Please Select",
            pendingApproval: "Pending Approval",
            infavourof: "Favouring",
            transferondate: "Transfer On Date",
            DOM: "Domestic Draft",
            INT: "International Draft",
            transferon: "Transfer On",
            addeditpayee: "Add/edit Payees",
            addpayee: "Add Payee",
            name: "Name",
            address: "Address",
            country: "Country",
            city: "City",
            postalcode: "Postal Code",
            now: "Now",
            later: "Later",
            deliverymode: "Delivery Mode",
            scheduledon: "Scheduled On",
            amount: "Amount",
            favouring: "Favouring",
            description: "Description",
            payableat: "Payable At",
            transferfrom: "Transfer From",
            reviewdemanddraft: "Review",
            balance: "Balance",
            confirmationMessageLine1: "Demand Draft of {amount} has been issued to {name}, {address}",
            confirmationMessageLine2: "Reference Number {referenceNumber}",
            verification: "Verification",
            verificationmsg: "A verification code has been sent to your registered mobile number.\nPlease enter that code below to complete the process",
            verificationcode: "Verification code",
            resendcode: "Resend Code",
            resendcodemsg: "Didn't get the code?",
            invalidcode: "Wrong verification code. Try again",
            note: "Note",
            BRN: "Branch Near Me",
            MAI: "My Address"

          },
          common: Common.payments.common,
          messages: Messages,
          generic: Generic
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
  return new TransactionLocale();
});
