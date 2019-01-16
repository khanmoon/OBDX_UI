define(
  [],
  function() {
    "use strict";
    var GoalLocale = function() {
      return {
        root: {
          goal: {
            calculator: {
              goalAmount: "Your Goal Amount",
              header: "Goal Calculator",
              initialAmount: "Have you already saved something for it?",
              remainingAmount: "The Remaining Amount",
              title1: "Let's understand how you can achieve it...",
              timeAchieve: "In how much time do you want to achieve this Goal?",
              title: "Superb! You are one step closer in chasing your dream - {name}!",
              paymentSchedule: "How frequently do you plan to set aside money for this Goal?",
              interestRate: "Interest Rate",
              monthlyInvestment: "Your Monthly Contribution",
              weeklyInvestment: "Your Weekly Contribution",
              quarterlyInvestment: "Your Quarterly Contribution",
              helpAchieve: "How are we helping you achieve it?",
              graphTitle: "Your contribution is {youPay}% and our contribution is {wePay}%",
              quarterly: "Quarterly",
              backToDashboard: "Back To Dashboard",
              cancel: "Cancel",
              monthly: "Monthly",
              weekly: "Weekly",
              amountError1: "Enter a valid amount",
              amountError2: "Enter a amount between {minAmount} and {maxAmount}",
              amountError3: "Initial amount cannot be greater than Goal Amount",
              tenureError1: "Enter a valid tenure",
              tenureError2: "Period cannot be greater than {maxYear} years",
              tenureError3: "Period cannot be greater than {maxMonth} months",
              tenureError:"Please specify goal Tenure",
              setGoal: "Set your goal now!",
              modifyGoal: "Modify Goal",
              years: "Years",
              months: "Months",
              graphSideText: "(Great! You save {ourContribution}%)",
              amountRange: "Amount should be between {minAmount} & {maxAmount}",
              graphtextyoupay: "You Pay {yourContribution}%",
              graphtextwepay: "We Pay {ourContribution}%",
              graphtext: "Your Contribution : {yourContribution}% , Our Contribution : {ourContribution}%",
              disclaimer: "All calculations are of approximate values"
            }
          },
          common: {
            create: "Create",
            cancel: "Cancel",
            clear: "Clear",
            search: "Search"
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