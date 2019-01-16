define(["ojL10n!resources/nls/generic",
  "ojL10n!resources/nls/payments-common"

], function(Generic, Common) {
  "use strict";
  var BillPaymentLocal = function() {
    return {
      root: {
        billPayment: {
          shareMessage: "Amount {amount} payed to biller {biller} from account {account}",
          invalidBillNumbrMsg: "Bill number should be alphanumeric.",
          mylimits: "My Limits",
          viewlimits: "View Limits",
          viewlimitsTitle: "View Limits",
          billPayment: "Bill Payment",
          confirmPaymentSuccess: "Transaction",
          DeleteFavourites: "Delete Favorite",
          pendingApproval: "Pending Approval",
          cancel: "Cancel",
          pay: "Pay",
          remove: "Remove",
          done: "Done",
          ok: "Ok",
          delete: "Delete",
          deleteTitle: "Click here to Delete",
          favorite: "Favorite",
          unfavourite: "Unfavourite",
          noteReview: "Note",
          dateHintMax: "Enter a date on or before {date}",
          note: "Note",
          pleaseSelect: "Please Select",
          setBiller: "Click to set Biller",
          payto: "Pay to",
          billerName: "Biller Name",
          biller: "Biller",
          relationshipNumber: "Relationship No.",
          amount: "Amount",
          save: "Save",
          edit: "Edit",
          editTitle: "Click here to edit Bill Payment Details",
          copynsave: "Make a copy & save",
          resetFields: "Reset Fields",
          transferFrom: "Pay From",
          billNumber: "Bill Number",
          billDate: "Bill Date",
          sucessfull: "Successful!",
          referenceNumber: "Reference Number {referenceNumber}",
          selectRelationShipNumber: "Please select Relationship Number",
          billpaymentsuccessmsg: "Your {name} bill dated {date} for {amount} has been paid.",
          confirm: "Confirm",
          title: "Bill Payment",
          titleRetail: "Pay Bills",
          addfavorite: "Add Favorite",
          successMessage: "Your transaction is successful.",
          addfavoriteTitle: "Click to add Favorite",
          favsuccess: "Successfully added favorite for {name}",
          favadded: "It will save payment to {name} as a favorite transaction.",
          deleteFavouriteMsg: "Are you sure you want to remove transfer to {name} for {amount} as a favorite?",
          cancelConfirm: "Are you sure you want to cancel the operation?",
          deleteFavouriteSuccess: "{paymenttype} to {name} for {amount} has been removed from favorites",
          multipleBillPayments: "Multiple Bill Payments",
          multipleBillPaymentsText: "Click here to perform Multiple Bill Payment",
          channel: "Channel",
          showInformation: "Select channel to view its limits"
        },
        generic: Generic,
        common: Common.payments.common
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
  return new BillPaymentLocal();
});
