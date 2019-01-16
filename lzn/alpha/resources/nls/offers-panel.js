define([
  "ojL10n!lzn/alpha/resources/nls/origination-generic"
], function(Generic) {
  "use strict";
  var dashboardLocale = function() {
    return {
      root: {
        more: "More",
        less:"Less",
        ptOffers: "{productType} Offers",
        pgOffers: "{productGroup} Offers",
        offerId: "Offer Id : {offerId}",
        mouseOverClick: "Click For Mouse Mover",
        offerName: "{offerName}",
        applyAccountOnline: "Apply for this account online",
        productType: {
          SAVINGS: "Savings",
          TERM_DEPOSIT: "Term Deposits",
          LOANS: "Loans",
          CREDIT_CARD: "Credit Cards",
          CHECKING: "Current Account"
        },
        productGroups: {
          CASA: "Savings",
          TERM_DEPOSITS: "Term Deposits",
          LOANS: "Loans",
          CREDIT_CARD: "Credit Cards"
        },
        currency: "Allowed Currency : {currency}",
        casa: {
          minimumInitialDepositAmount: "Minimum Initial Deposit",
          minimumBalanceAmount: "Minimum Balance",
          checkBookAllowed: "Check Book Allowed",
          overdraftAllowed: "Overdraft Allowed",
          principalOffsetAllowed: "Principal Offset Allowed",
          facilities: "Facilities",
          atmAccess: "ATM Access",
          allowed: "Allowed",
          notAllowed: "Not Allowed",
          dailyWithdrawalLimitForAtm: "Daily Withdrawal Limit for ATM"
        },
        creditCard: {
          minCreditLimit: "Minimum Credit Limit",
          maxCreditLimit: "Maximum Credit Limit",
          maxAddOnCardAllowed: "Maximum Add-On Cards",
          cardOfferType: "Credit Card Type",
          balanceTransferAllowed: "Balance Transfer Allowed",
          addOnCardAllowed: "Add-On Card Allowed",
          pictureCardAllowed: "Picture Card Allowed"
        },
        td: {
          minDepositAmount: "Minimum Deposit Amount",
          maxDepositAmount: "Maximum Deposit Amount",
          prematureRedemptionAllowed: "Premature Redemption Allowed",
          maxTerm: "Maximum Term",
          minTerm: "Minimum Term",
          partRedemptionAllowed: "Part Redemption Allowed",
          lienAllowed: "Lien Allowed",
          term: "{years} Years(s), <br>{months} Month(s), <br>{days} Days(s)"
        },
        applyForLoan: "Click here to Apply for {offer}",
        alt: {
          offerImageAlt: "{offer} Image",
          moreDetails: "Click here for more details"
        },
        title: {
          moreDetails: "Click here for more details"
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
  return new dashboardLocale();
});
