define([
  "ojL10n!lzn/alpha/resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var submissionConfirmationLocale = function() {
    return {
      root: {
        homepage: "Go to Homepage",
        thankNote: "Thank you for submitting your application.",
        thankNoteName: "Thank you for submitting your application, {name}",
        appRefNo: "Application Reference Number : <span class='{applicationStatusText}'>{applicationRefNo}</span>",
        refstatus: "Status&#58; Your application has been conditionally approved subject to verification of the information you have provided",
        refStatusSuccess: "Status&#58; Your application has been successfully submitted and is being reviewed.",
        nxtSteps: "Next Steps",
        nextSteps1: "You will receive your new account kit at your mailing address within a few working days. Your account kit will include your cheque book if you have applied for one.",
        nextSteps2: "If you have opted to fund your new account at a later date, or if you are a first time customer, you will need to deposit money into your new account within 30 days in order to activate it.",
        nextSteps3: "If you have applied for a debit card, your new debit card and Personal Identification Number (PIN) will arrive at your mailing address within a few working days. For added security, your Card and PIN will arrive separately in the mail.",
        nextSteps4: "Once your information has been verified, we will send you an Email containing the status of your application. We will follow up will a letter, sent to your mailing address, within the next few days of having made our decision.",
        nextSteps5: "A copy of all important documents, including the loan agreement will be mailed to you and will arrive at your mailing address within a few working days.",
        msg2: "A copy of all important documents, including the disclosures and notices, will be mailed to you and will arrive at your residential address within a few working days.",
        msg3: "Your new debit card and Personal Identification Number (PIN) will arrive at your residential address within a few working days once your account has been opened. For added security, your card and PIN will arrive separately in the mail",
        refMsg1: "Once your information has been verified, we will send you an Email containing the status of your application. We will follow up will a letter, sent to your residential address, within the next few days of having made our decision.",
        refMsg2: "You will be able to access your account when your account has been approved and your opening deposit has been processed. We will intimate you via email and post when your opening deposit has been successfully processed.",
        loanMsg1: "We will keep you updated about the status of your application either by sending you emails or by calling you over the phone.",
        loanMsg2: "You can also track the status of your application through ‘My Applications’. You will need to register with us in order to access the ‘My Applications’ feature. Registration is easy – Simply click on the ‘Register’ button provided on this screen and specify a login ID and password of choice.",
        loanMsg3: "We may need certain documents to help us process your loan as quickly as possible. The list of these documents will be made available to you through email and you can upload them in ‘My Applications.",
        loanMsg4: "If approved, your new credit card/s will be mailed to you within the next few working days at the address of your specification.",
        congratsMsg: "Congratulations, your new {offerName} Account has been opened!",
        congratsMsgTD: "Congratulations, your new {offerName} Account has been opened!",
        accNo: "Account Number : <span class='{applicationStatusText}'>{identificationTypeAcc}</span>",
        status: "<span class='{bold}'>Status</span>: Your account has been opened. However, you will be able to access your account only once your opening deposit has been processed.",
        msg1: "We will intimate you via email when your opening deposit has been successfully processed.",
        trackApplication: "Track your Application",
        coAppregister: "Register the co-applicant",
        sendlink: "Send Link",
        coApplinkMsg: "Send a link to the co-applicant so that they may register with us. They can then view and track the application themselves.",
        primaryAppregister: "Register the primary applicant",
        primaryApplinkMsg: "Send a link to the primary applicant so that they may register with us.They can then view and track the application themselves.",
        successfullyRegistered: "You have been successfully registered.",
        messages: {
          email: "Please enter a valid email ID",
          coAppMsg: "Registration link has been sent successfully to the specified email ID"
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
  return new submissionConfirmationLocale();
});