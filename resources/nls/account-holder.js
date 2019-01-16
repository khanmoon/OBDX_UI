define([
  "ojL10n!resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var accountHolderLocale = function() {
    return {
      root: {
        activityProfile: "Activity Profile",
        noOfCashDeposits: "Quarterly Number of Cash Deposits",
        useofATM: "Will ATM be used in Multiple States?",
        debitCardPrefrences: "Debit Card Preferences for {name}",
        cardType: "Card Type",
        cardName: "Name on Card",
        debitCard: "Debit Card",
        cardDesign: "Card Design",
        cardImage: "Image on Card",
        docTypeIdForImageUpload: "Image on card",
        uploadPhoto: "Upload your Photo",
        debitCardInformation: "Your new Debit Card and Personal Identification Number(PIN) will arrive at your residential address within a few working days once your account has been opened. For added security, your Card and PIN will arrive separately in the mail.",
        accfeatures: "Set up your account features and identify activity specifications.",
        identifyBanking: "Identify your banking activity.Why we require this information.",
        chooseDebitCard: "Choose from among our extensive range of debit cards and select one that best suits your needs.",
        activityProfileRequirement: "We are legally obligated to ask you questions regarding your use of certain banking services. Based on your answers we are able to identify your regular banking patterns and are able to identify suspicious behavior early on, hence, protecting you from any criminal activity that might occur in your account. As always, everything you tell us is confidential, in accordance with the bank's privacy policy.",
        uploadedDoc: "You have already uploaded this image",
        MASTER_CARD: "Master Card",
        VISA: "Visa",
        success: "Success!",
        error: "Error",
        noFile: "No file selected. Please select a file to upload",
        errorContacting: "Error contacting the server. Please try again later",
        applicationForm: "Why we require Activity Profile information?",
        applicationFormTitle: "Why we require Activity Profile information? tooltip",
        applicationCardImage: "Application Card Image",
        applicationCardImageTitle: "Click for Application Card Image",
        accountHolderConfigClick: "Card image download",
        accountHolderConfigClickTitle: "Click for Card image download",
        isChequeBookNeeded: "Cheque Book",
        isStatementNeeded: "Account Statement",
        statementFrequency: "Statement Frequency",
        chequeBookRequest: {
          chequeBookLeaveOption: "Cheque Book with {leavesCount} Leaves",
          NumberOfLeaves: "Number of Leaves",
          select: "Please Select"
        },
        messages: {
          noOfCashDeposits: "Please enter a valid number of cash deposits",
          cardType: "Please select a card type",
          cardName: "Please enter a valid card name",
          noOfLeaves: "Please select number of cheque leaves",
          statementFrequency: "Please select the statement frequency",
          dob: "Please enter a valid date of birth",
          success: "Successfully uploaded the file",
          validNumber: "Please specify valid number"
        },
        submitAccount: "Click here to submit Features and Specifications",
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
  return new accountHolderLocale();
});