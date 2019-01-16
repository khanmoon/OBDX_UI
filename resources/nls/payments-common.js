define([
  "ojL10n!resources/nls/messages-payments",
  "ojL10n!resources/nls/generic"

], function(Messages, Generic) {
  "use strict";
  var TransactionLocale = function() {
    return {
      root: {
        payments: {
          common: {
            alt: "Click here to {reference}",
            title: "Click here to {reference}",
            select: "Select",
            submit: "Submit",
            add: "Add",
            cancel: "Cancel",
            confirm: "Confirm",
            remove: "Remove",
            ok: "Ok",
            pay: "Pay",
            done: "Done",
            reviewHeaderMsg: "You initiated a request for {txnName}. Please review details before you confirm!",
            reviewHeaderMsgPayNowSI : "Requests to initiate Repeat Transfer and Transfer Today have been initiated. Please review details before you confirm",
            pleaseSelect: "Please Select",
            transfer: "Transfer",
            setup: "Setup",
            search: "Search",
            reset: "Reset",
            edit: "Edit",
            save: "Save",
            update: "Update",
            today: "Today",
            issue: "Issue",
            delete: "Delete",
            success: "Successful!",
            fail : "Failed",
            verify: "Verify",
            DeliveryLocation: "Delivery Location",
            note: "Note",
            "note-review": "Note",
            review: "Review",
            completed: "Completed",
            reviewandtransfer: "Review",
            cancelConfirm: "Are you sure you want to cancel the transaction?",
            mylimits: "My Limits",
            copynsave: "Make a Copy & Save",
            resetFields: "Reset Fields",
            address: {
              branch: "Branch Near Me",
              address: "My Address"
            },
            payeeCategory: {
              INDIADOMESTIC: "Domestic",
              SEPADOMESTIC: "Domestic",
              UKDOMESTIC: "Domestic",
              INTERNATIONAL: "International",
              INTERNAL: "Internal",
              DOM: "Domestic",
              INT: "International"
            },
            frequency: {
              20: "Every day",
              30: "Every 7 days",
              40: "Every 15 days",
              50: "Every month",
              60: "Every 2 months",
              70: "Every 3 months",
              80: "Every 6 months",
              90: "Every year"
            },
            confirmScreen: {
              approvalMessages: {
                APPROVED: {
                  successmsg: "You have successfully approved the transaction",
                  statusmsg: "Completed"
                },
                PENDING_APPROVAL: {
                  successmsg: "You have successfully approved the request. It is pending for further approval.",
                  statusmsg: "Pending Approval"
                },
                REJECTED: {
                  successmsg: "You have rejected the request.",
                  statusmsg: "Rejected"
                },
                FAILED: {
                  successmsg: "Rejected by host.",
                  statusmsg: "Failed"
                }
              },
              successMessage: "Your transaction is successful!",
              failureMessage : "Your transaction is failed!",
              corpMaker: "You have successfully initiated the transaction.",
              successmsg: "You have successfully approved the transaction",
              successSI: "Your request has been accepted.",
              SI : {
                success : "Your repeat transfer request has been successfully set.",
                fail : "Your repeat transfer request has failed."
              },
              paynow : {
                success : "Your one time transfer is successful.",
                fail : "Your one time transfer has failed."
              },
              subHeader : {
                common : "Transfer Details",
                repeat : "Details for Repeat Transfer",
                today : "Details for Transfer Today"
              }
            },

            transfers: {
              domestic: "Domestic Transfer",
              international: "International Transfer",
              internal: "Internal Transfer",
              internationalDraft: "International Demand Draft",
              domesticDraft: "Domestic Demand Draft"

            },
            help: {
              multipleTransfers: "Multiple Transfers",
              adhocTransfer: "Adhoc Transfer",
              multipleTransfersText: "Click here to perform Multiple Transfers",
              adhocTransferText: "Click here for Adhoc Transfer"
            },
            placeholder: {
              pleaseSelect: "Please Select",
              holderName: "Account holder name",
              selectAccount: "Select Account",
              currency: "Currency",
              dateHintMin: "Enter a date on or after {date}",
              dateHintMax: "Enter a date on or before {date}"
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