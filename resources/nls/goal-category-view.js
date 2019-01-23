define(
  [],
  function() {
    "use strict";
    var GoalLocale = function() {
      return {
        root: {
          goal: {
            interestslab: {
              title: "View Interest Rates",
              amount: "Amount",
              tenure: "Tenure",
              rate: "Rate of interest (% Per Annum)",
              caption: "Interest rate slabs",
              fromto: "{from} - {to}",
              fromtotenure: "{from} to {to}",
              years: "{years} Years",
              months: "{months} Months",
              percent: "{percent}%",
              ok: "Ok",
              andabove: "{value} & Above"
            },
            initialFunding: "Min - {minAmount}   Max - {maxAmount}",
            tenure: "Min - {minTenure} yrs   Max - {maxTenure} Yrs",
            category: {
              updateCategoryConfirm: "Transaction",
              goalCode: "Category Code",
              goalCategory: "Category Name",
              enterCode: "Enter Code",
              enterCategory: "Enter Name",
              viewTitle: "Goal Category Maintenance",
              create: "Create",
              image: "Category Image",
              code: "Code",
              productMapping: "Product Mapping",
              subCategory: "Sub Category Details",
              name: "Name",
              description: "Description",
              expiryDate: "Expiry Date",
              status: "Status",
              categoryUpdated: "Category {name} has been successfully updated",
              subFailed: "{name} has been updated but sub categories could not be updated",
              product: "Product",
              productDetails: "Product Details",
              initialFunding: "Initial Funding Limit",
              currency: "Currency",
              topUpAllowed: "Top Up Allowed",
              partialWithdrawalAllowed: "Partial Withdrawal Allowed",
              tenure: "Tenure",
              interestRate: "Interest Rate",
              topUpLimit: "Top Up Limit",
              partialWithdrawalPenalty: "Partial Withdrawal Penalty",
              interestlink: "View Interest Rates"
            },
            reviewHeaderMsg: "You initiated a request for updating existing goal category. Please review details before you confirm!"
          },
          common: {
            save: "Save",
            select: "Select",
            review: "Review",
            view: "View",
            edit: "Edit",
            remove: "Remove",
            confirm: "Confirm",
            done: "Done",
            success: "Successful!",
            cancel: "Cancel",
            back: "Back",
            add: "Add",
            uploadImage: "Please upload goal category image."
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
    return new GoalLocale();
  }
);
