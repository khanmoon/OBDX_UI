define([
  "ojL10n!resources/nls/messages-payments",
  "ojL10n!resources/nls/generic",
  "ojL10n!resources/nls/domestic-payee",
  "ojL10n!resources/nls/payments-common"
], function(Messages, Generic, Domestic, Common) {
  "use strict";
  var TransactionLocale = function() {
    return {
      root: {
        payments: {
          moneytransfer_header: "Make Payment",
          moneytransfer_header_retail: "Transfer Money",
          setstandinginstruction_header: "Set Repeat Transfer",
          deleteFavouriteMsg: "Are you sure you want to remove transfer to {name} for {amount} as a favorite?",
          deleteFavouriteSuccess: "{paymenttype} to {name} for {amount} has been removed from favorites",
          unfavourite: "Unfavourite",
          warningMessage: "You already have a payment instruction/s set up for this payee due within the next {X} days.",
          channel: "Channel",
          showInformation: "Select channel to view its limits",
          pleaseSelect : "Please Select",
          selfError : "Two or more accounts are required to carry out this transaction.",
          shareMessage: "{transactionName} request of {amount} has been initiated.\nTransfer To: {transferTo}\nReference number:{referenceNumber}\nValue Date:{valueDate}",

          payee: Domestic.payments.payee,
          common: Common.payments.common,

          moneytransfer: {
            status : {
              error : "Error",
              success : "Successful"
            },
            knowmore : "Know More",
            totalDebitAmount: "Total Debit Amount",
            successMessage: "Transfers initiated successfully.",
            failureMessage: "Transfers initiated successfully. Some transfers seem to have failed.",
            paynowWithSIPopupMsg : "Select this option to also initiate a one-time transfer towards the payee with the specified amount.",
            closepopup : "Close popup",
            transfertoday : "Also Transfer Today",
            paynowWithSIMsg : "By selecting this option, a transfer with today’s value date with the specified amount will also be initiated along with the request to set repeat transfers.",
            payVia:"Pay Via",
            transferondate: "Transfer Date",
            enddate: "End Date",
            initiated: "initiated",
            serviceCharge : "Service Charge",
            pendingApproval: "Pending Approval",
            existingPayee: "Existing Payee",
            newPayee: "New Payee",
            myAccounts: "My Accounts",
            now: "Now",
            later: "Later",
            accountNumber: "Account Number",
            accountName: "Account Name",
            transfertype: "Transfer Type",
            recipient: "Payee",
            addFavoriteText: "Add Favorites",
            addFavoriteTextTitle: "Click to Add Favorites",
            amount: "Amount",
            transferon: "Transfer When",
            transferfrom: "Transfer From",
            note: "Note",
            repeatTransfer: "Setup repeat transfer",
            repeatTransferText: "Click to setup repeat transfer",
            frequency: "Transfer Frequency",
            transferTo: "Transfer To",
            transferMode: "Transfer Mode",
            on: "on",
            after: "after",
            instances: "instances",
            paylater: "Paylater",
            purpose: "Purpose",
            transferpurpose: "Transfer Purpose",
            refresh: "Click here to change your Payee Selection",
            refreshText: "Click here to change your Payee Selection",
            correspondencecharges: "Correspondence Charges",
            paymentdetails: "Payment Details",
            securityCode: "Security Code",
            successmsg5: "Transaction",
            startTransfer: "Start Transferring",
            stopTransfer: "Stop Transferring",
            favadded: "It will save payment to {name} as a Favorite Transaction.",
            favsuccess: "Successfully added favorite for {name}",
            typeoftransfer: "Type of Transfer",
            oin: "Originators Identification Number",
            oinDes: "OIN Description",
            viewlimits: "View Limits",
            viewLimitsTitle: "Click here to view Limits",
            favorite: "Favorite",
            intaccountType: "Internal",
            internalHeader: "Internal Fund Transfer Details",
            internationalAccountType: "International",
            internationalHeader: "International Fund Transfer Details",
            selectpayee: "Please select a payee",
            domaccountType: "Domestic",
            domesticHeader: "Domestic Fund Transfer Details",
            invalidDescription: "Please enter valid OIN description",
            msgDetail: "Invalid Payment Details",
            viewCurExcRate: "View Current Exchange Rate",
            bookNewDeal: "Book New Deal",
            viewCurExcRateTitle: "View Current Exchange Rate",
            dealNumber: "Deal Number",
            spot: "Spot",
            forward: "Forward",
            dealType: "Deal Type",
            exchangeRate: "Exchange Rate",

            transactionMessage: {
              self: "Own Account Transfer",
              internal: "Internal Fund Transfer",
              domestic: "Domestic Fund Transfer",
              international: "International Fund Transfer"
            },
            frequencyLabel: {
              DAILY: "Daily",
              WEEKLY: "Weekly",
              FORTNIGHTLY: "Fortnightly",
              MONTHLY: "Monthly",
              "BI-MONTHLY": "Bi-Monthly",
              QUARTERLY: "Quarterly",
              "SEMI-ANNUALLY": "Semi-Annually",
              ANNUALLY: "Annually"
            }
          },

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
