define([
  "ojL10n!resources/nls/messages-payments",
  "ojL10n!resources/nls/generic"
], function(Messages, Generic) {
  "use strict";
  var TransactionLocale = function() {
    return {
      root: {
        payments: {
          managerecipients_header: "Manage Payees",
          payee: {
            accountnumber: "Account Number",
            accountname: "Account Name",
            review: "Review",
            internal: {
              internalaccount: "Internal Account",
              accountnumber: "Account Number",
              accountname: "Account Name",
              branch: "Branch",
              accountnickname: "Nickname",
              review: "Review",
              bankdetails: "Bank Details",
              header: "Internal Payee Details",
              reviewHeader: "You initiated a request for Internal Bank Account Payee. Please review details before you confirm!"

            }
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
            delete: "Delete",
            success: "Successful!",
            verify: "Verify",
            DeliveryLocation: "Delivery Location",
            note: "Note (Optional)",
            "note-review": "Note",
            comment: "Comment",
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