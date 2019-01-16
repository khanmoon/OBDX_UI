define([
  "ojL10n!lzn/gamma/resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var depositRequirementsLocale = function() {
    return {
      root: {
        compName: "requirements",
        requirements:"Requirements",
        coApplicant: "Would you like to add a co-applicant ?",
        relation: "Specify relationship with primary applicant",
        isExistingUser: "Is Co-applicant an existing user ?",
        verify: "Verify",
        userIdOfCoApplicant: "Co-applicant Customer ID",
        modeOfPreference: "Send Verification Code via",
        email: "Co-applicant's registered email address",
        sms: "Co-applicant's registered phone number",
        verified: "Verified",
        verifyCoApp: "Co-applicant Customer ID needs to be verified using Verification Code",
        UserVerifyEmailClick: "Click to verify email",
        header: "Help us understand your requirements",
        checkingHeader: "Help us understand your requirements",
        confirmRequirements: "Before we go ahead, please confirm your requirements",
        selectCurrency: "Which currency should this account have ?",
        accountType: "Specify Account Type",
        individual: "Individual",
        joint: "Joint",
        tncLine1: "By accepting this Agreement, we will lend you and you will borrow the amount of credit",
        tncLine2: "By signing this Agreement, you agree to repay the amount of credit and the total charge of credit by monthly repayments on the due date each month",
        tncLine3: "If any monthly repayment is not received by its due date, we may charge interest on it, until it is paid, at the rate equivalent to the Interest Rate applicable to your Personal Loan. In addition, a late payment fee (as specified in the Personal Loan Important Information Document signed by you) will apply.",
        coAppConsent: "Note : You must have the co-applicant's consent to apply for joint credit",
        offertitle: "Offer",
        offerName: "Offer Name",
        features: "Features",
        promoCode: "Promo Code",
        militaryDisclosure: "Military Disclosure",
        militaryDisclosureText: "Federal law provides protections to active duty members of the Armed Forces and their dependents. To ensure that these protections are provided to eligible applicants, we require you to choose one of the following statements as applicable",
        militaryDisclosures: {
          "0": "I am a regular or reserve member of the Army, Navy, Marine Corps, Air Force, or Coast Guard, serving on active duty under a call or order that does not specify a period of 30 days or fewer.<br>-- Or --<br>I am a dependent of a member of the Armed Forces on active duty as described above, because I am the member’s spouse, the member’s child under the age of eighteen years old, or I am an individual for whom the member provided more than one-half of my financial support for 180 days immediately preceding today’s date.",
          "1": "I am not a regular or reserve member of the Army, Navy, Marine Corps, Air Force, or Coast Guard, serving on active duty under a call or order that does not specify a period of 30 days or fewer (or a dependent of such a member)."
        },
        selectMilitaryDisclosure: "Military Disclosures",
        selectMilitaryDisclosureTitle: "Click for Military Disclosures",
        scraDate: "SCRA Effective Date",
        scraRefNo: "SCRA Reference No.",
        termYears: "{years} Year(s)",
        termMonths: "{months} Month(s)",
        messages: {
          currency: "Please select a currency",
          coappId: "Please enter Co-applicant Customer ID",
          modeOfPreference: "Please select the preferred mode to send OTP",
          years: "Please select no of year(s)",
          months: "Please select no of month(s)",
          scraDate: "Please enter a valid SCRA effective date",
          scraRefNo: "Plesae enter a valid SCRA Reference number"
        },
        loan: {
          title: "Loan Requirements",
          header: "Help us understand your loan requirements",
          loanAmount: "Loan Amount",
          purpose: "Loan Purpose",
          tenure_year: "Tenure Years",
          tenure: "Tenure",
          term: "Loan Term",
          years: "Years",
          year: "Year",
          months: "Months",
          month: "Month",
          minAmount: "Not less than &#36 {amount}",
          loanPurpose: "{purposeType}-{description}",
          purchasePrice: "Estimated Value",
          downPaymentRequired: "Down payment towards Vehicle Purchase",
          downPaymentAmount: "Down payment Amount",
          loanAmountError: "Downpayment amount cannot be greater than or equal to purchase price"
        },
        generic: Generic

      },
      "ar": true,
      "fr": true,
      "cs": true,
      "sv": true,
      "en": false,
      "en-us": false,
      "el": true
    };
  };
  return new depositRequirementsLocale();
});
