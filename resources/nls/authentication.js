define([
  "ojL10n!resources/nls/generic"
], function(Generic) {
  "use strict";
  var ActivityLogLocale = function() {
    return {
      root: {
        authentication: {
          labels: {
            userSegments: "User Segment",
            notMaintained: "2 Factor Authentication for this user segment has not been set up yet",
            setUpNow: "Set Up Now",
            transactionType: "Transaction Type",
            level1: "Level 1",
            level2: "Level 2",
            securityQuestion: "Security Question",
            randomSoftToken: "Random Number based Soft Token",
            timeSoftToken: "Time based Soft Token",
            hardToken: "Hard Token",
            applyToAll: "Apply to all",
            NO_OF_SEC_QUES: "No of Security Questions:",
            corporateuser: "Corporate",
            retailuser: "Retail",
            administrator: "Administrator",
            HRDT: "Hard Token",
            level1Null: "First level authentication cannot be none if Second level is not none.",
            None: "-",
            TOKEN: "Token",
            ariaLabel: "Authentication",
            OTP: "One Time Password",
            SEC_QUE: "Security Question",
            HARD_TOKEN: "Hard Token",
            SOFT_TOKEN: "Soft Token",
            level: "Level {levelNumber}"
          },
          headers: {
            authentication: "Authentication",
            VIEW: "View",
            EDIT: "Edit",
            CREATE: "Create",
            REVIEW: "Review",
            CONFIRM: "Confirm"
          },
          status: {
            PENDING_APPROVAL: "In Progress",
            REJECTED: "Rejected",
            APPROVED: "Processed",
            INITIATED: "Initiated",
            COMPLETED: "Processed",
            EXPIRED: "Expired",
            MODIFICATION_REQUESTED: "Modification Requested",
              cancelConfirm: "Are you sure you want to cancel this transaction ?"
          },
          messages: {
            pleaseSelect: "Please select",
            required: "Required",
            invalidQuestionNumber: "Invalid number of Security Questions",
            reviewHeader: "Review",
            reviewHeader1: "You initiated a request for Authentication.Please review details before you confirm!"

          }
        },
        common: Generic.common
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
  return new ActivityLogLocale();
});