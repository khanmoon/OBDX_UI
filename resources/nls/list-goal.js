define(
  [],
  function() {
    "use strict";
    var PFMlanding = function() {
      return {
        root: {

          common: {
            header: "My Goals",
            back: "Back",
            closedheader: "Closed Goals"
          },

          pfm: {
            timeLeft: "Target Date: {date}",
            timeLeftYear: "{year} Years",
            timeLeftMonth: "{month} Months",
            timeLeftDay: "{day} Days",
            achieved: "{percent}% Achieved",
            menuImgAlt: "Menu",
            menuImgTitle: "Menu",
            modify: "View Details",
            modifyText: "Click to View Details",
            planningToSave: "Planning to save money for buying {categoryNamee}?",
            viewClosedGoals: "View Closed Goals",
            goalcategoryImgAlt: "Goal Category",
            goalcategoryImg: "Goal Category Image",
            calciImgAlt: "Goal Calculator",
            calciImgTitle: "Goal Calculator",
            goalcalculator: "Goal Calculator",
            goalAmount: "Goal Amount: {goalAmountt}",
            creategoalImgAlt: "Create Goal",
            creategoalImgTitle: "Create Goal",
            creategoal: "Create Goal",
            closedgoal: "View Closed Goals",
            closedGoalText: "Click to view goals Closed",
            closedgoalSubtitle: "Viewing the list of all your goals which are in closed status.",
            TargetAmount: "Final Amount: {finalAmountRedeemed}",
            closingDate: "Closing Date: {date}",
            TargetAmountForCard: "Final Amount",
            closingDateForCard: "Closing Date",
            pageTitle: "You can Create, View and Modify Your Goals",
            noGoals: "There are no goals available",
            backToDashboard: "Back To Dashboard"
          },
          goals: {
            quatation: "\"All your dreams can come true,  if we have the courage to pursue them\" - Walt Disney.",
            suggestion: "Set your Goals & we will help you achieve them -",
            needAnyAssitance: "Need any assistance? click here -",
            creategoal: "Create Goal",
            createGoalText: "Click to set a Goal",
            calculategoal: "Calculate Goal",
            goalCalculator: "Goal Calculator",
            goalcalculatorText: "Click to calculate your goal amounts",
            achievedTitle: "Achieved : {value}",
            closedHeader: "Closed goals details"
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
    return new PFMlanding();
  }
);