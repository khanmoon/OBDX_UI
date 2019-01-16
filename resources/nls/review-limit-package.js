define([
  "ojL10n!resources/nls/financial-limits-common"
], function(Limits_common) {
  "use strict";
  var ReviewLimitsLocale = function() {
    return {
      root: {

        review_limit_package: {
          limit_package_id: "Limit Package ID",
          limit_package_code: "Limit Package Code",
          limit_package_desc: "Limit Package Description",
          access_point: "Touch Point",
          access_point_group: "Touch Point Group",
          role: "Role",
          transaction_id: "Transaction ID",
          transaction_name: "Transaction Name",
          transaction_group_name: "Transaction Group Name",
          transaction_limit: "Transaction Limit",
          cummulative_limit_daily: "Cumulative Limit Daily",
          cummulative_limit_monthly: "Cumulative Limit Monthly",
          cooling_limit: "Cooling Limit",
          limit_id: "Limit ID",
          limit_code: "Limit Code",
          limit_name: "Limit Name",
          description: "Description",
          view: "View",
          expired: "Expired",
          effective_date: "Effective Date",
          cancelWarning: "Warning",
          cancelMessage: "Are you sure you want to cancel the operation?",
          expiry_date: "Expiry Date",
          confirm: "Confirm",
          limitPackage: "Limit Package",
          ques1: "Are you sure you want to delete?",
          view_limit: "{id} - {name}",
          createLimitPackage: "Limit Package Creation",
          SUCCESSFUL: "Maintenance Saved successfully.",
          review: "Review",
          createNewPackage: "Limit Package Creation",
          editPackage: "Update Limit Package",
          deletePackage: "Limit Package Deletion",
          currency: "Currency",
          confirmScreenheader: "You initiated a request for Limit Package. Please review details before you confirm!"


        },
        btns: {
          reset: "Reset",
          search: "Search",
          delete: "Delete",
          cancel: "Cancel",
          clear: "Clear",
          save: "Save",
          edit: "Edit",
          clone: "Clone",
          update: "Update",
          addTrans: "Add Transaction",
          ok: "Ok",
          back: "Back",
          confirm: "Confirm",
          TransNLimits: "Transactions/Transaction Groups - Limits"
        },
        info: {
          noData: "No data to display."
        },

        pageHeader: "Limit Package Management",

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
  return new ReviewLimitsLocale();
});
