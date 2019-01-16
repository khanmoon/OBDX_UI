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
            international: {
              drafttype: "Draft Type",
              draftfavouring: "Draft Favouring",
              branch: "Branch Near Me",
              postorcourier: "My Address",
              draftpayableatcity: "Draft Payable at City",
              draftpayableat: "Draft Payable at",
              draftpayableatcountry: "Draft Payable at Country",
              draftcountry: "Country",
              draftcity: "City",
              reviewHeaderInternational: "You initiated a request for International Demand Draft Payee. Please review details before you confirm!",
              deliverdraftto: "Deliver Draft to",
              header: "International Draft Details",
              payableCountry: "Payable Country",
              payableCity: "Payable City",
              msgtype: {
                myaddress: "My Address",
                branchaddress: "Branch Address"
              }
            },
            review: "Review"
          },
          common: {
            select: "Select",
            submit: "Submit",
            add: "Add",
            cancel: "Cancel",
            confirm: "Confirm",
            remove: "Remove",
            ok: "Ok",
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