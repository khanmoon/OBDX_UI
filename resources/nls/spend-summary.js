define(
  [],
  function() {
    "use strict";
    var PFMdashboard = function() {
      return {
        root: {

          spend: {
            viewalltxn: "View All Transactions",
            category: "Categories",
            title: "My Spends",
            subCategory: "Category wise Representation of Your Spends",
            period: "Period",
            caption: "caption",
            chart: "Spends Data Visualization : Chart",
            totalspend: "Total Spends",
            topspends: "Top Spends",
            topSpentCategory: "Top Spent Category",
            viewDetails: "View Details",
            viewDetailsText: "Click here to view your Spend details",
            allcategories: "All Categories",
            uncategorized: "Uncategorized",
            other: "Other",
            nodata: "No data to display",
            refresh: "Refresh",
            amount: "Amount",
            linkTitle: "Click to View all the Transactions",
            clickToViewDetail: "Click here to view your Spend details",
            last30Days: "Last 30 days",
            nospend: "You have no spends in last 30 days",
            noSpendMsg: "There are no spends in this period!!",
            viewAllSpends : "View All"
          },
          filter: {
            l30days: "Last 30 Days",
            l60days: "Last 60 Days",
            l90days: "Last 90 Days",
            thisMonth: "This Month"

          },
          tooltip: {
            title: "Category Details",
            categoryTitle: "Category : {value}",
            subCategoryTitle: "Sub Category : {value}",
            amountTitle: "Amount : {value}"
          },
          resetalt: "Reset",
          resetaltText: "Click to Reset"

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
    return new PFMdashboard();
  }
);
