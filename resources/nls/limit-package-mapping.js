define([], function() {
  "use strict";
  var LimitPackageMappingLocale = function() {
    return {
      root: {
        limits: {
          effective_date: "Effective Date",
          expiry_date: "Expiry Date",
          transaction_id: "Transaction ID",
          transaction_name: "Transaction Name",
          transaction_group_name:"Transaction Group Name",
          select_task: "Select Task",
          select_transaction_group: "Select Transaction Group",
          select_transaction: "Select Transaction",
          view_details: "View Details",
          no_view_details: "No supported transactions found",
          ok:"Ok"

        },
        pageHeader: "Limits Management"
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
  return new LimitPackageMappingLocale();
});
