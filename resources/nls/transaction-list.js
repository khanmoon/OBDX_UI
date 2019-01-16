define(
  [],
  function() {
    "use strict";
    var TransactionList = function() {
      return {
        root: {

          tableHeaders: {
            date: "Date",
            categoryNsubcategory: "Category & Sub Category",
            transaction: "Transaction",
            amount: "Amount",
            action: "Action",
            caption: "caption",
            header: "Transaction list"
          },

          filter: {
            all: "All Transactions",
            allaccounts: "All Accounts",
            l30days: "Last 30 Days",
            l60days: "Last 60 Days",
            l90days: "Last 90 Days",
            reset: "Reset",
            filter: "Refine Your Results",
            filterText: "Change filter options",
            accounts: "Accounts",
            resetAlt: "Reset",
            duration: "Duration",
            durationText: "Change duration period",
            thisMonth: "This Month",
            filterToolbar: "Filtering Toolbar"
          },

          alt: {
            filter: "Filter",
            filterText: "Click to Filter Your Search",
            edit: "Recategorize",
            editTitle: "Click to Edit details",
            split: "Split",
            splitTitle: "Click to Split details",
            refresh: "Reset",
            refreshText: "Click to Reset content"
          },

          image: {
            recategorize: "Recategorize Transaction",
            split: "Split Transaction"
          },

          recategorize: {
            header: {
              large: "Recategorize Transaction",
              small: "Recategorize"
            },
            category: "Category",
            subcategory: "Sub Category",
            placeholder: "Please Select",
            successMsg: "Transaction recategorized successfully.",
            addnewcategorymsg: "Want to Add New Category and Sub Category?",
            addnewcategorymsgTitle: "Click to Add new Category",
            validationmsg: "Alphanumeric values with space and special characters as $ & , . _ : between length 1-40 are allowed.",
            cancel: "Cancel",
            save: "Save"
          },
          split: {
            header: "Split Transaction",
            category: "Category",
            subcategory: "Sub Category",
            amount: "Amount",
            deleteimagealt: "Remove",
            placeholder: "Please Select",
            add: "Add",
            successMsg: "Transaction split successfully.",
            splitmsg: "Total amount should be equal to  {amount}",
            remove: "Delete"
          },
          title: "My Spends",
          subtitle: "You can View and Modify Your Spends",
          managecategory: "Manage My Categories",
          back: "Back",
          uncategorized: "Uncategorized",
          other: "Other",
          backToDashboard: "Back to dashboard",
          backToDashboardTitle: "Back to dashboard"

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
    return new TransactionList();
  }
);