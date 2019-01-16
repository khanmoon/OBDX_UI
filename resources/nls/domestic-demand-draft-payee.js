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
          payee: {
            domestic: {
              drafttype: "Draft Type",
              postorcourier: "Post/Courier",
              branch: "Branch",
              mailtoremitter: "Mail to Remitter",
              mailtobeneficiary: "Mail to Beneficiary",
              draftfavouring: "Draft Favouring",
              draftpayableatcity: "Draft Payable at City",
              draftpayableat: "Draft Payable at",
              deliverdraftto: "Deliver Draft to",
              header: "Domestic Draft Details",
              reviewHeaderDomestic: "You initiated a request for Domestic Demand Draft Payee. Please review details before you confirm!",
              msgtype: {
                myaddress: "My Address",
                branchaddress: "Branch Address"
              }
            },
            review: "Review",
            accesstype: "Access Type"
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
            setup: "Setup",
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