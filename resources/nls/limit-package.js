define(["ojL10n!resources/nls/financial-limits-common"], function(Limits_common) {
  "use strict";
  var LimitsLocale = function() {
    return {
      root: {
        review_limit_package: {
          limit_package_code: "Limit Package Code",
          limit_package_desc: "Limit Package Description",
          role: "Role",
          transaction_id: "Transaction ID",
          transaction_name: "Transaction Name",
          transaction_group_name:"Transaction Group Name",
          transaction_limit: "Transaction Limit",
          cummulative_limit: "Cumulative Limit",
          cooling_limit: "Cooling Limit",
          effective_date: "Effective Date",
          expiry_date: "Expiry Date",
          confirm: "Confirm",
          deleted: "Deleted",
          undo: "Undo",
          added: "Added",
          expired: "Expired",
          currentlyEffective: "Currently Effective",
          unchanged: "Unchanged",
          confirmScreenheader: "You initiated a request for Limit Package. Please review details before you confirm!",
          review: "Review",
          duplicationError: "Record already exists for this Transaction and Effective Date combination. Please amend the details.",
          duplicationErrorTransactionGroup: "Record already exists for this Transaction Group and Effective Date combination. Please amend the details.",
          view_limit: "{id} - {name}",
          gapDetected: "There is no limit available in an interval between an effective and an expiry date for transaction(s). Do you want to proceed?",
          abruptEndDetected: "There is no limit available after an expiry date for transaction(s). Do you want to proceed?",
          createLimitPackage: "Limit Package Creation",
          SUCCESSFUL: "Maintenance Saved successfully.",
          createNewPackage: "Limit Package Creation",
          editPackage: "Update Limit Package",
          currency: "Currency",
          select_currency: "Select Currency",
          selectCurrency: "Please select currency",
          deletePackage: "Limit Package Deletion",
          deleteTransaction: "Delete Transaction",
          deleteTransactionGroup: "Delete Transaction Group",
          limitPackageError: "Limit Package Error",
          limitAvailability: "Limit Availability",
          cancelMessage: "Are you sure you want to cancel this operation?",
          cancelWarning: "Cancel Warning"
        },
        btns: {
          cancel: "Cancel",
          save: "Save",
          edit: "Edit",
          clone: "Clone",
          update: "Update",
          addTrans: "Add Transaction",
          addTransGroup: "Add Transaction Group",
          ok: "Ok",
          confirm: "Confirm",
          TransNLimits: "Transactions/Transaction Groups - Limits",
          yes: "Yes",
          no: "No"
        },
        limit_package: {
          cumulative_msg: "Please assign either daily or monthly cumulative limit for each Transaction/Transaction group."

        },
        access_point_limit_package_mapping:{
          "accessPoint": "Touch Points / Group",
          "actions": "Actions",
          "limitPackage" : "Package",
          "limitPackageHeader": "Limits",
          "selectLimitPackage":"Please select Limit Package",
          "refresh" : "Refresh",
          "showInformation" : "Information",
          "view_details" : "View Details",
          "internal": "Internal",
          "external": "External"
        },

        common: Limits_common
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
  return new LimitsLocale();
});
