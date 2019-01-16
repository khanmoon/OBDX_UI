define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";
  var dashboardLocale = function() {
    return {
      root: {
        class: "{productClass}{index}",
        subClass: "{productClass}_{productSubClass}{index}",
        CASA_SAVINGS1: "A high-yield savings account may help you reach your goals.",
        CASA_SAVINGS: "A Traditional Savings Account that earns Interest.",
        CASA_CHECKING1: "Gives you full access to Online and Mobile Banking, a suite of powerful tools and apps that make it easy to track your spending, pay bills, send money, deposit checks and more.",
        CASA_CHECKING: "Our most popular bank account to help manage your everyday banking needs. Multiple ways to access funds, whether here or overseas.",
        TERM_DEPOSITS1: "Now you can get an even better return for your savings. Lock-in a competitive interest rate with our Term Deposits and watch your savings grow. The fixed rate of return means you’ll always know what your investment’s worth and can plan how to use the interest earned.",
        TERM_DEPOSITS: "Make your money work harder. Enjoy fixed returns, competitive interest rates and a choice of terms.",
        CREDIT_CARD1: "A card with a Rewards Program earning Points on every new, net card purchase. Earn unlimited Points with no earnings cap or Point expirations and enjoy the flexibility to choose cash back, gift cards, merchandise or travel rewards.",
        CREDIT_CARD: "Take off sooner with our fastest way to earn Velocity Frequent Flyer Points, with all the added benefits of complimentary insurances and Personal Concierge.",
        LOANS_PERSONAL_LOAN1: "Stay in control with a fixed interest rate Know exactly what your repayments will be for the life of the loan.",
        LOANS_PERSONAL_LOAN: "A convenient, reusable, unsecured personal loan that works like a line of credit offering choice and flexibility.",
        LOANS_AUTOMOBILE1: "Unlock the value of your car for a reduced interest rate. Interest is fixed so you know what your repayments will be for the life of the loan.",
        LOANS_AUTOMOBILE: "Getting that leather interior just got much more tempting. Fair competitive rates and timely credit decisions may have you cozying up to your new vehicle sooner than you thought.",
        LOANS_LOANS1: "Unlock the value of your home for a reduced interest rate. Interest is fixed so you know what your repayments will be for the life of the loan.",
        LOANS_LOANS: "Getting that fancy interior just got much more tempting. Fair competitive rates and timely credit decisions may have you cozying up to your new home sooner than you thought.",
        proceed: "Proceed",
        applyButton: "Apply for {productGroup}",

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
  return new dashboardLocale();
});