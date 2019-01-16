define([
  "ojL10n!resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var applicationsummaryLocale = function() {
    return {
      root: {
        loanAmount: "Loan Amount",
        requestedTenure: "Tenure",
        submittedOn: "Submitted On",
        applicationId: "Application Id",
        applicantName: "Applicant Name",
        accountId: "Account Number",
        tenure: "{years} year(s) {months} month(s)",
        requestedAmount: "Requested Amount",
        accountCreated: "Account Created",
        status: "Status",
        creditLimit: "Credit Limit",
        creditLimitAmt: "Credit Limit: {limit}",
        firstLastSuffix: "{name} {suffix}",
        productClass: {
          PAYDAY: "Payday",
          AUTOLOANFLL: "Auto Loan",
          PERSONAL_LOAN: "Personal Loans",
          SAVINGS: "Savings",
          SAVIN: "Savings",
          CACCR: "Current Accounts",
          UPL1: "Personal Loans",
          AUTOLOANS: "Auto Loan"
        },
        submissionStatus: {
          SUBMISSION_INCOMPLETE: "Submission Incomplete",
          SUBMISSION_IN_PROGRESS: "Submission In Progress",
          SUBMISSION_SUBMITTED: "Submission Submitted",
          SUBMISSION_WITHDRAWN: "Submission Withdrawn",
          SUBMISSION_EXPIRED: "Submission Expired",
          SUBMISSION_CANCELLED: "Submission Cancelled",
          SUBMISSION_PREASSESSMENT_COMPLETED: "Submission Pre-Assessment Completed",
          SUBMISSION_COMPLETED: "Submission Completed",
          SUBMISSION_COMPLETED_JOINT_PENDING: "Joint Applicant Pending",
          MARKED_FOR_WITHDRAW: "Submission marked for withdraw",
          MARKED_FOR_EDIT: "Submission marked for edit",
          MARKED_FOR_EDIT_SAVED: "Submission marked for edit saved",
          MARKED_FOR_EXPIRY: "Submission marked for expiry",
          MARKED_FOR_MANUAL_CREDIT_DECISION: "Submission marked for Manual Credit Decision",
          PRELIMINARY_ASSESSMENT_FAILED: "Preliminary Assessment Failed",
          PRELIMINARY_DECISION_APPROVED: "Preliminary Decision Approved",
          PRELIMINARY_DECISION_CONDITIONALLY_APPROVED: "Preliminary Decision Conditionally Approved",
          PRELIMINARY_DECISION_DECLINED: "Preliminary Decision Declined",
          PRELIMINARY_DECISION_REFERRED: "Preliminary Decision Referred",
          AUTO_DUE_DILIGENCE_APPROVED: "Auto Due Diligence Approved",
          AUTO_DUE_DILIGENCE_REFERRED: "Auto Due Diligence Referred",
          IPA_TERM_SHEET_DISPATCHED: "Ipa Term Sheet Dispatched",
          UNDEFINED: "Undefined",
          PRESCREEN: "Pre-Screen",
          PRESCREEN_APPROVED: "Pre-Screen Approved",
          PRESCREEN_REJECTED: "Pre-Screen Rejected",
          PREQUALIFY: "Pre-Qualify",
          NEW: "New",
          APPROVED: "Approved",
          CONDITIONED: "Conditioned",
          REJECTED: "Rejected",
          WITHDRAWN: "Withdrawn",
          CONVERSION: "Conversion",
          DOCUMENTS_MISSING: "Documents Missing",
          REC_APPROVAL: "Recommend Approval",
          REC_REJECTION: "Recommend Rejection",
          REVIEW_REQUIRED: "Review Required",
          AUTO_APPROVED: "Auto Approved",
          AUTO_REJECTED: "Auto Rejected",
          FLAT_CANCEL: "Flat Cancel",
          OVERRIDE_REQUIRED: "Override Required",
          VERIFIED: "Verified"

        },
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
  return new applicationsummaryLocale();
});