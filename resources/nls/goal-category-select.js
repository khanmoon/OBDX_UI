define(
  [],
  function() {
    "use strict";
    var GoalLocale = function() {
      return {
        root: {
          goal: {
            calculator: {
              categoryTitle1: "Let's begin! </br> Choose your dream Goal",
              categoryTitle2: "We will help you achieve it",
              categoryTitleError: "No categories found!",
              subTitle: "Now choose what category of {categoryName} would you aspire for!",
              amountTitle1: "Great Going!",
              amountSubTitle: "{categoryName} >  {subCategoryName}",
              amountTitle2: "You have chosen: {categoryName}",
              amountTitle3: "To achieve this Goal you need to set a Goal Amount!",
              enterAmount: "Enter Goal Amount",
              proceed: "Proceed",
              backToDashboard: "Back To dashboard",
              cancel: "Cancel",
              amountError1: "Enter a valid amount",
              amountError2: "Enter a amount between {minAmount} and {maxAmount}",
              minAmount: "Min Amount: {minAmount}",
              maxAmount: "Max Amount: {maxAmount}",
              amountRange: "Amount should be between {minAmount} & {maxAmount}",
              categoryCaptions: {
                house: "There’s no place like home",
                car: "Find best available rates",
                vacation: "Relax and unwind",
                celebration: "Make new memories"
              }
            },
            category_title: "Goal Category",
            amount_title: "Set Goal Amount"
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