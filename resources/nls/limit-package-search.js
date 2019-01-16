define([], function() {
  "use strict";
  var LimitsLocale = function() {
    return {
      root: {
        limit_package_search: {
          create: "Create",
          code_search: "Package Code",
          desc_search: "Package Description",
          access_point_search: "Touch Point",
          access_point_group_search: "Touch Point Group",
          roles: "Roles",
          showMoreOptions: "More Search Options",
          please_select:"Please Select",
          select_roles: "Select Roles",
          role: "Role",
          showLessOptions: "Less Search Options",
          access_point:"Touch Point/ Group",
          currency: "Currency",
          code: "Limit Package Code",
          name: "Name",
          desc: "Limit Package Description",
          count: "No. of Transactions Mapped",
          search_result: "Search result",
          fromDate: "From Date",
          toDate: "To Date",
          lastUpdatedOn:"Updated On",
          updationDate:"Updation Date"
        },
        btns: {
          reset: "Reset",
          search: "Search",
          delete: "Delete",
          cancel: "Cancel",
          clear: "Clear",
          create: "Create",
          ok: "Ok",
          back: "Back"
        },
        info: {
          noData: "No data to display."
        },

        pageHeader: "Limit Package Management"
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
