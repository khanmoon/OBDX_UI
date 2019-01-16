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
          viewlimits: "View Limits",
          viewlimitsTitle: "View Limits",
          bankaccount: "Bank Account",
          addNewrecipientmsg: "You will first add the bank account details of the recipient and then continue to transfer",
          addbankaccount: "Add Bank Account",
          successmsg2: "Transfer of {amount} has been made to {payee}",
          successmsg3: "Reference Number {referenceNumber}",
          securityCode: "Security Code",
          verifyP2PPayment: "Peer To Peer Payment",
          confirmP2PPayment: "Peer To Peer Payment",
          reviewandtransfer: "Review",
          shareMessage: "{transactionName} request of {amount} has been initiated.\nTransfer To: {transferTo}\nReference number:{referenceNumber}\nValue Date:{valueDate}",
          peertopeer: {
            transferValue: "Email/Mobile",
            confirmTransferValue: "Confirm Email/Mobile",
            p2pMessage:"Input email/mobile field first",
            transferValuemsg:"Email/Mobile values do not match",
            transferMode: "Transfer Via",
            transferfrom: "Transfer From",
            transferto: "Transfer To",
            channel: "Channel",
            showInformation: "Select channel to view its limits",
            pleaseSelect : "Please Select",
            addp2pPayeemsg: "Save {payee} to your Payee list?",
            existingPayee: "Existing Payee",
            newPayee: "New Payee",
            amount: "Amount",
            note: "Note",
            p2ptransfer: "Peer to peer transfer",
            facebookPayment: "Facebook",
            twitterPayment: "Twitter",
            contactListHeader: "Select Contact",
            noFriendsFound: "No friend in your friend list have authorized for this type of transaction",
            facebookContactsHelp: "Facebook contacts who have provided permission to Zigbank are present in the list",
            payToContacts: "Pay to Contacts"
          }
        },
        common: Common.payments.common,
        messages: Messages,
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
  return new TransactionLocale();
});
