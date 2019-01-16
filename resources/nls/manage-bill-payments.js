define(["ojL10n!resources/nls/generic", "ojL10n!resources/nls/register-biller"], function(Generic, RegisterBiller) {
  "use strict";
  var billPaymentsLocale = function() {
    return {
      root: {
        generic: Generic,
        registerBiller: RegisterBiller,
        heading: {
          bills: "Bills",
          deleteBiller: "Delete Biller",
          billPayment: "Bill Payment"
        },
        labels: {
          searchBy: "Search by",
          searchFields: "Biller Nickname, Category",
          registerBiller: "Add Biller",
          manage: "Manage",
          manageBiller: "Manage Biller",
          deleteBiller: "Delete Biller",
          openmenualt: "Click here for more options",
          openmenutitle: "Click here for more options",
          alt: "Click here to {reference}",
          title: "Click here to {reference}",
          quickBillPay: "Quick Bill Pay",
          paymentHistory: "Payment History",
          billerList: "Biller List",
          dueBy: "Due by",
          pay: "Pay",
          SCHEDULEDPAY: "Scheduled Pay",
          AUTOPAY: "Auto Pay",
          pastDue: "Past Due",
          noBillDue: "No Bills Due",
          continue : "Continue",
          detailedBill: "Detailed Bill",
          billNumber : "Bill Number",
          billPeriod : "Bill Period",
          billDate : "Bill Date",
          billDueDate : "Bill Due Date",
          billAmount : "Bill Amount",
          earlyPayDate: "Early Pay Date",
          earlyPayDiscount: "Early Pay Discount",
          earlyPayBillAmount: "Early Pay Bill Amount",
          latePayCharges : "Late Pay Charges",
          latePayBillAmount: "Late Pay Bill Amount",
          description: "Description"
        },
        billerTypeHeadings: {
          "PRESENTMENT": "Here are your bills presented",
          "PAYMENT": "Here are your billers, you can pay any time",
          "RECHARGE": "Here are your billers for recharge"
        },
        messages: {
          PENDING: "Approval Pending",
          REJECTED: "Rejected by bank",
          SUSPENDED: "Suspended by bank",
          "editBillerPendingStatus": "Your previous details are yet to be approved by bank. Please contact your bank for futher details.",
          "deleteBiller": "Are you sure you want to delete this biller?",
          "deleteBillerError": " Please close the auto pay/scheduled pay currently set up for this biller before deleting.",
          "deleteSuccessMessage": "Biller deleted successfully.",
          "pendingApproval": "Pending Approval",
          "sucessfull": "Successfull",
          "corpMaker": "You have successfully initiated the transaction.",
          "noSearchRecord": "No matches found. Please make sure you have entered the correct biller nickname or biller category.",
          "noBillerRegistered": "You have not yet added any billers for making bill payments. To get started click on Add Biller.",
          "PRESENTMENT": "You have not yet added any billers who present bills. To get started click on Add Biller.",
          "PAYMENT": "You have not yet added any billers for making bill payments. To get started click on Add Biller.",
          "RECHARGE": "You have not yet added any billers for recharge. To get started click on Add Biller.",
          "autoPayBiller": "An autopay has been already setup for this biller, would you still like to continue?",
          "scheduledPay": "A schedule pay has been already setup, would you still like to continue?",
          "paymentNotAllowed": "Last Date of Bill Payment has Passed. Late Payment not allowed by Biller!"
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
  return new billPaymentsLocale();
});
