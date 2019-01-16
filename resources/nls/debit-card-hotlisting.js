define(["ojL10n!resources/nls/generic",
  "ojL10n!resources/nls/messages-accounts"
], function(Generic, Messages) {
  "use strict";
  var DebitCardHotlist = function() {
    return {
      root: {
        customerName:"Customer Name",
        cardType:"Card Type",
        accountNumber:"Account Number",
        cardStatus:"Status",
        validThru:"Valid Thru",
        active:"Active",
        inactive:"Inactive",
        nameOnCard: "Name on Card",
        fullName: "{firstName} {middleName} {lastName}",
        header: {
          blockCard: "Block Card"
        },
        common: {
          DeliveryLocation: "Delivery Location",
          reason: "Specify Reason",

          submit: "Submit",
          successful: "Successful!",
          ok: "Ok",
          yes: "Yes",
          no: "No",
          serviceRequestNumber: "Service Request Number",
          review: "Review",
          cancel: "Cancel",
          block: "Block",
          confirm: "Confirm",
          done: "Done",
          reasonLabel: "Reason",
          blockType: "Type of Block"
        },
        hotlisting: {
          transactionName: "Debit Card block",
          hotlistconfirm: "Your card has been successfully blocked!",
          serviceRequestNumber: "Service Request Number is {refNo}",
          hotlistReplaceCard: "Would like to order a replacement card ?",
          hotlistReplaceCardAddress: "Where would you like your replacement card to be delivered ?",
          replaceSr: "Your request for a replacement card has been submitted!",
          hotlistverify: "Are you sure you want to block ?",
          block: "Your replacement card will be sent to desired location!",
          blockMsg: "Help us by providing few details",
          replacementCard: "Replacement Card",
          cardNo: "Card Number",
          srMessage: "{txn} Service Request Number",
          reviewHead: "You initiated a request to block Debit Card. Please review details before you confirm!"
        },
        blockType: {
          temp: "Temporary Block",
          hotlist: "Permanent Block (Hotlist)"
        },
        buttons: {
          debitCards: "Debit Cards",
          pinRequest: "Request Pin",
          limits: "View Limits",
          blockCards: "Block Card",
          yesD: "Yes, Disable",
          yesA: "Yes, Active",
          editDailyLimits: "Edit Daily Limits",
          resetPin: "Reset Pin",
          upgradeCard: "Upgrade Card",
          reissueCard: "Reissue Card",
          debitCardDetails: "Debit Card Details"
        },
        generic: Generic,
        messages: Messages
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
  return new DebitCardHotlist();
});
