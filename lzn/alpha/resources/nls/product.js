define([
  "ojL10n!lzn/alpha/resources/nls/origination-generic",
  "ojL10n!lzn/alpha/resources/nls/accordion-names"
], function(Generic, AccordionNames) {
  "use strict";
  var productLocale = function() {
    return {
      root: {
        pageTitle: "ZigBank - Product",
        balanceTransferText: "You can save the amount of interest paid on the outstanding balances of other bank's credit cards by simply transferring the balances to your new card.",
        whatisThisTextDebit: "Your security code is the 3 digit number printed on the back of your card in the signature line.",
        whatisThisTextCredit: "Your security code is the 3 digit number printed on the back of your card in the signature line. On your American Express card, the 4 digit security code is printed on the front of the card just above the embossed card number.",
        emailRequirementText: "We need your valid email address so we can communicate important information to you regarding your application. <br> Your email address is also required to register online.<br> You will be able to use our online services by entering your email address as login ID and the password you specify in the password field in this section.",
        citizenshipRequirement: "We need your citizenship information to determine eligibility for our products and also to comply with the USA PATRIOT Act.",
        activityProfileRequirement: "We are legally obligated to ask you questions regarding your use of certain banking services. Based on your answers we are able to identify your regular banking patterns and are able to identify suspicious behavior early on, hence, protecting you from any criminal activity that might occur in your account. As always, everything you tell us is confidential, in accordance with the bank's privacy policy.",
        privacyAndSecurityPolicyText: "We will not sell, distribute or lease your personal information to third parties unless we have your permission or are required by law. We may use your personal information to send you promotional information about third parties which we think you may find interesting if you tell us that you wish this to happen. We are committed to ensuring that your information is secure. In order to prevent unauthorized access or disclosure we have put in place suitable physical, electronic and managerial procedures to safeguard and secure the information we collect online.",
        previousAddressRequiredText: "To properly verify your identity, we need details of all addresses that you have resided in for the past two years.",
        vehicleNumRequirement: "A 17 character identifier unique to each vehicle. The Vehicle Identification Number (VIN) can be found on the lower-left corner of the dashboard or instrument panel.",
        mileageRequirement: "The total distance covered by the vehicle in miles",
        landingtext: "Track your Application",
        beforeWeGoAhead: "Before we go ahead..",
        offerHeadOfferName: "You are applying for {offerName}",
        offerHeadProductDescription: "You are applying for {productDescription}",
        offerHeadAmountTenure: "You are applying for {productGroup} <span class='{class1}'> of amount <span class='{class2}'>{amount}</span> for tenure <span class='{class2}'>{years} year(s) {months} month(s)</span></span>",
        submisionOfferHeadAmountTenure: "You have applied for {productGroup} <span class='{class1}'> of amount <span class='{class2}'>{amount}</span> for tenure <span class='{class2}'>{years} year(s) {months} month(s)</span></span>",
        submisionOfferHeadOfferName: "You have applied for {offerName}",
        submisionOfferHeadProductDescription: "You have applied for {productDescription}",
        productAmount: "You are applying for {productGroup} <span class='{class1}'> of amount <span class='{class2}'>{amount}</span>",
        submissionProductAmount: "You have applied for {productGroup} <span class='{class1}'> of amount <span class='{class2}'>{amount}</span>",
        paydayLoan: "Payday Loan",
        applicationCancelled: "Application Cancelled",
        amountTenure: "{productGroup} <span class='{class1}'> of amount <span class='{class2}'>{amount}</span> for tenure <span class='{class2}'>{years} year(s) {months} month(s)</span></span>",
        amountHeader: "{productGroup} <span class='{class1}'> of amount <span class='{class2}'>{amount}</span>",
        CASA: "Savings",
        TERM_DEPOSITS: "Term Deposits",
        LOANS: "Loans",
        ipa: "IPA",
        CREDIT_CARD: "Credit Cards",
        tncLine1: "By accepting this Agreement, we will lend you and you will borrow the amount of credit",
        tncLine2: "By signing this Agreement, you agree to repay the amount of credit and the total charge of credit by monthly repayments on the due date each month",
        tncLine3: "If any monthly repayment is not received by its due date, we may charge interest on it, until it is paid, at the rate equivalent to the Interest Rate applicable to your Personal Loan. In addition, a late payment fee (as specified in the Personal Loan Important Information Document signed by you) will apply.",
        privacyAndSecurityPolicyTitle: "Keep your information private and secure",
        alreadyRegisteredMsg: "Please log out first or open the link in another window",
        wrongStateSelection: "We cannot open your account as your state of residence does not match the state you have selected. Please contact the bank for further information.",
        productGroupsHeader: {
          productGroupsHeaderSavings: "Explore our Savings products",
          productGroupsHeaderCheckings: "Explore our Checkings products",
          productGroupsHeaderCD: "Explore our Term Deposits products",
          productGroupsHeaderCC: "Explore our Credit Cards products",
          productGroupsHeaderSPL: "Explore our Auto Loans products",
          productGroupsHeaderUPL: "Explore our Personal Loans products"
        },
        applicationForm: {
          years: "year(s)",
          months: "month(s)"
        },
        financialTemplate: {
          financialProfile: "Financial Profile",
          name: "Financial Profile {index}"
        },
        cardPreferences: {
          updateDelPreferences: "Update delivery preferences"
        },
        personalDetails: {
          iconClick: "Expand",
          iconClickTitle: "Click to expand"
        },
        click: {
          submitProductOfferIdClick: "Click For Offer On Product",
          submitProductOfferId: "Click For Offer Id on Product"
        },
        image: "{accordionLogo} Logo",
        generic: Generic,
        accordionNames: AccordionNames

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
  return new productLocale();
});