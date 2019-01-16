define([], function() {
  "use strict";
  var CumulativeLimitsLocale = function() {
    return {
      root: {
        cummulative_limit: {
          limit_section_daily: "Cumulative Limit Daily",
          limit_section_monthly: "Cumulative Limit Monthly",
          limit_id: "Limit ID",
          limit_name: "Limit Name",
          transaction_limit: "Transaction Limit",
          limit_desc: "Limit Description",
          id: "ID",
          code: "Code",
          name: "Name",
          description: "Description",
          transaction_limit_search: "{id} - {name}",
          select_limit: "Select Limit"

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
  return new CumulativeLimitsLocale();
});