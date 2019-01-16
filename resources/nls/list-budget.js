define(
  ["ojL10n!resources/nls/generic",
    "ojL10n!resources/nls/payments-common"
  ],
  function(Generic, Common) {
    "use strict";
    var budgetList = function() {
      return {
        root: {
          budget: {
            subheader: "You can Create, View and Modify Your Budgets",
            title: "My Budgets",
            categoryName: "Category Name",
            quotation: "\"Beware of little expenses. A small leak will sink a great ship\"- Benjamin Franklin.",
            suggestion: "Want to Control your expenses?",
            controlYourExpenses: "Set your budget",
            createbudget: "Set Your Budget",
            createBudgetTitle: "Click to Create Your Budget",
            imgalt: "View and Modify Options",
            alt: "Launcher",
            imgTitle: "Click to View/Modify",
            menulabel: "Menu",
            budgetset: "Budget Set: {amount}",
            consumed: "{percentage}% Consumed",
            exceeded: "{percentage}% Exceeded",
            consumedtitletooltip: "Consumed : {value}",
            nobudget: "No Budgets Exist",
            backToDashboard: "Back to Dashboard",
            msg: "Budgets are already created for all the categories.",
            menu: {
              update: "View/Modify",
              delete: "Delete"
            },
            create: {
              header: "Set Budget",
              choosecategory: "Choose a Category",
              setbudgetamount: "Set Budget Amount",
              frequency: "Frequency",
              periodicity: "Periodicity",
              monthly: "Monthly",
              weekly: "Weekly",
              quarterly: "Quarterly",
              thismonth: "This Month",
              recurring: "Recurring",
              specific: "Specific Duration",
              successMsg: "Budget created successfully.",
              to: "To",
              placeholder: "Select",
              fromDateMonth: "From Date",
              fromDateYear: "Select the Year you want to start from",
              toDateMonth: "To Date",
              toDateYear: "Select the Year you wish to end"
            },
            update: {
              header: {
                large: "View/Modify Budget",
                small: "View/Modify"
              },
              successMsg: "Budget updated successfully."
            },
            delete: {
              header: "Delete Budget",
              verifyMsg: "Are you sure you want to delete this budget- {categoryName}? If you proceed with this action, this data will be lost and cannot be retrieved!",
              successMsg: "Budget deleted successfully.",
              proceed: "Proceed",
              doNotProceed: "Don't proceed"
            }
          },
          common: Common.payments.common,
          generic: Generic
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
    return new budgetList();
  });
