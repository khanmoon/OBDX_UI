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
          managerecipients_header: "Manage Payees",
          payeeDeleteWithGroup: "Delete Payee",
          payeeDelete: "Delete Payee",
          editPayee: "Edit Payee",
          payee: {

            notset: "Not Set",
            view: "View",
            payees: "Payee Details",
            delete: "Delete",
            pendingApproval: "Pending Approval",
            initiated: "initiated",
            edit: "Edit",
            review: "Review",
            SHARED: "Public",
            newAccount: "New Account",
            newAccountText: "Click to create a New Account",
            NONSHARED: "Private",
            payeeData: "Payee Data",
            payeeDataText: "Viewing Payee Data",
            deleteaccount: "Are you sure you want to delete {name} Account?",
            deletelastaccount: "Are you sure you want to delete {name} Account along with {group} Payee?",
            deletesuccess: "{name} Account was deleted.",
            deletelastpayeesuccess: "{payeeName} Account was deleted along with {groupName} Payee.",
            editpayeesuccess: "Payee Updated",
            recipientname: "Payee Name",
            accounttype: "Account Type",
            accountnumber: "Account Number",
            accountname: "Account Name",
            payvia: "Pay Via",
            branch: "Branch",
            bankdetails: "Bank Details",
            accountnickname: "Nickname",
            drafttype: "Draft Type",
            draftfavouring: "Draft Favouring",
            payAtCity: "Pay At City",
            payAtCountry: "Pay At Country",
            draftpayableat: "Draft Payable at",
            deliverdraftto: "Deliver Draft to",
            payeeaccesstype: "Access Type",
            dailylimit: "Daily Limit",
            demanddraft: "Demand Draft",
            bankaccount: "Bank Account",
            accpeertopeer: "Peer To Peer",
            RES: "Residence",
            PST: "Postal",
            WRK: "Work",
            changestoday: "Changes have been made today",
            selection: "Select an option",
            viewmore: "View",
            viewmoreTitle: "Click to view more details",
            effectivetomorrow: "The changes you made today will be effective from tomorrow",
            oneType: "Choose only one type",
            transferMode: "Transfer Mode",

            confirmScreen: {
              successMessage: "Payee has been deleted.",
              updateSuccessMessage: "Payee details updated successfully.",
              corpMaker: "Your request has been initiated successfully.",
              pendingApproval: "Pending Approval"
            },

            type: {
              INTERNAL: "Internal",
              INTERNATIONAL: "International",
              DEMANDDRAFT: "Demand Draft",
              DOMESTIC: "Domestic",
              INT: "International",
              DOM: "Domestic",
              MAI: "My Address",
              BRN: "Branch Near Me"
            }

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