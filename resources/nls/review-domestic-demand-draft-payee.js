define([
  "ojL10n!resources/nls/messages-payments",
  "ojL10n!resources/nls/generic"
], function(Messages, Generic) {
  "use strict";
  var TransactionLocale = function() {
    return {
      root: {
        payments: {
          addrecipient_header: "Add Payee",
          header: "Domestic Demand Draft Details",

          payee: {
            review: "Review",
            recipientname: "Payee Name",
            accdomestic: "Domestic",
            payeeaccesstype: "Access Type",
            domestic: {
              drafttype: "Draft Type",
              draftfavouring: "Draft Favouring",
              draftpayableatcity: "Draft Payable at City",
              draftpayableat: "Draft Payable at",
              deliverdraftto: "Deliver Draft to"
            }
          },
          msgtype: {
            myaddress: "My Address",
            branchaddress: "Branch Address"
          },
          common: {
            select: "Select",
            submit: "Submit",
            add: "Add",
            cancel: "Cancel",
            confirm: "Confirm",
            remove: "Remove",
            ok: "Ok",
            pay: "Pay",
            done: "Done",
            pleaseSelect: "Please Select",
            search: "Search",
            reset: "Reset",
            edit: "Edit",
            save: "Save",
            today: "Today",
            issue: "Issue",
            delete: "Delete",
            success: "Successful!",
            verify: "Verify",
            DeliveryLocation: "Delivery Location",
            note: "Note (Optional)",
            "note-review": "Note",
            address: {
              branch: "Branch Near Me",
              address: "My Address"
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