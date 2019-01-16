define(["ojL10n!resources/nls/generic"], function(Generic) {
  "use strict";
  var ConfirmScreenLocale = function() {
    return {
      root: {
        confirm: {
          completed: "Completed",
          feedback: "Feedback",
          transactionID: "Transaction ID",
          reason: "Reason",
          referenceNo: "Reference Number",
          hostReferenceID: "Host Reference Number",
          transactionStatus: "Click the status link to view the status of each transfer.",
          sweepInTransactionStatus: "Click the status link to view the status of each Sweep-in request.",
          sweepInTransactionTitle: "Click the status link to view the status of each Sweep-in request.",
          clickHere: "Click Here",
          paymentStatus: "Status",
          confirmation: "{txnName} Confirmation",
          confirmText: "Confirmation",
          errorText: "Error",
          defaultSuccessMessage: "{txnName} submitted successfully.",
          DEFAULT_TXN_NAME: "Transaction",
          RETAIL_SUCCESS_MESSAGE: "Request submitted successfully.",
          eReceipt: "e-Receipt",
          downloadEreceipt: "Click to download E Receipt",
          downloadEreceiptAlt: "Download E Receipt",
          screenImage: "Confirmation Icon",
          screenImageTitle: "Confirmation Icon",
          statusWord: "Status",
          shareAlt: "Click here to share",
          share: "Share",
          status: {
            FINAL_LEVEL_APPROVED: "Completed",
            MID_LEVEL_APPROVED: "Approved",
            REJECT_BY_HOST: "Rejected by Host",
            REJECT: "Rejected",
            INITIATED: "Pending for Approval",
            AUTO_AUTH: "Completed"
          },
          staticMessages: {
            ADMIN: {
              FINAL_LEVEL_APPROVED: "Maintenance approved and completed successfully.",
              MID_LEVEL_APPROVED: "Maintenance approved. Awaiting further approval.",
              REJECT_BY_HOST: "Maintenance rejected.",
              REJECT: "Maintenance rejected",
              INITIATED: "Maintenance submitted for approval.",
              AUTO_AUTH: "Maintenance completed successfully."
            },
            CORPADMIN: {
              FINAL_LEVEL_APPROVED: "Maintenance approved and completed successfully.",
              MID_LEVEL_APPROVED: "Maintenance approved. Awaiting further approval.",
              REJECT_BY_HOST: "Maintenance rejected.",
              REJECT: "Maintenance rejected",
              INITIATED: "Maintenance submitted for approval.",
              AUTO_AUTH: "Maintenance completed successfully."
            }
          },
          actions: {
            message: "Go to Home",
            logout: "Home",
            clickHere: "Click here to {details}",
            nextAction: "What would you like to do next?",
            clickheregoToAccountDetails: "Click here to go to Account Details",
            goToAccountDetails: "Go To Account Details",
            moreAlertOptions: "More Alert Options",
            moreSecuritySetting: "More Security Setting",
            clickheregoToDashboard: "Click here to go to Dashboard",
            goToDashboard: "Go To Dashboard",
            viewStatement: "View Statement",
            favorite: "Add Favorite",
            pay: "Pay Now",
            repeat: "Set Repeat Transfer",
            p2pPayee: "Add Payee",
            existingp2ppayee: "Existing Payee",
            newp2ppayee: "New Payee",
            morePaymentOptions: "More Payment Options",
            setPayeeLimits: "Set up Payee Limits",
            listGoals: "Goals List",
            debtor: "Manage Debtors",
            adhocPayee: "Add as Payee?",
            payBills: "Pay Bills",
            addBiller: "Add More Billers",
            viewBills: "View Bills",
            addAnotherNominee: "Go To Manage Nominee",
            bookAnotherForex: "Book Another Forex Deal",
            payAnotherBill: "Pay Another Bill",
            ManageAnotherAccount: "Manage Another Account",
            createSweepIn: "Create Sweep-in",
            registerBiller: "Add Biller"
          },
          serviceRequestUpdateSuccessMessage: "Request Updated Successfully",
          serviceRequestSuccessMessage: "{txnName} service request raised successfully",
          serviceRequestNumber: "Service Request Number",
          favoriteComfirmMsg: "Are you sure you want to mark the transaction as favorite?",
          favoriteSuccess: "Transaction marked as favorite successfully.",
          wheretoadd: "Add to an Existing Payee or create a New Payee?",
          payee: "Payee",
          pleaseSelect: "Please Select"
        },
        generic: Generic
      },
      ar: false,
      fr: true,
      cs: false,
      sv: false,
      en: false,
      "en-us": false,
      el: false
    };
  };
  return new ConfirmScreenLocale();
});
