define([
  "ojL10n!resources/nls/generic",
  "ojL10n!resources/nls/payments-common"
], function(Generic, Common) {
  "use strict";
  var FavoritesLocale = function() {
    return {
      root: {
        payments: {
          favoritesDetails: {
            labels: {
              title: "Favorites",
              accounts: "Money Transfer",
              dd: "Demand Drafts",
              bill: "Bill Payments",
              nofavorites: "No Records Found",
              tableheader: "Favorites List",
              paymenttyp: "Payment Type",
              self: "Self",
              paynow: "Pay Now",
              remove: "Remove",
              menuLabel: "Menu options",
              deletefavorite: "Delete Favorite",
              menuAlt: "Click here for more options",
              menuTitle: "Click here for more options"
            }
          },
          messages: {
            deleteSuccessMsg: "Favorite removed successfully",
            deleteFavoriteMsg: "Are you sure you want to delete favorite for {name}"
          },
          tableHeaders: {
            payeeName: "Payee",
            beneficiaryName: "Beneficiary Name",
            transactionType: "Transfer Type",
            paymentDetails: "Account Details",
            nickName: "Nickname",
            draftFavouring: "Draft Favouring",
            amount: "Amount",
            billerName: "Biller Name",
            relationshipnum: "Relationship Number",
            draftFavour: "Draft Favouring",
            billerCategory: "Category",
            draftType: "Draft Type",
            cancel: "Cancel",
            alt: "Click here for more details",
            title: "Click here for more details"
          },
          msgtype: {
            DOMESTICFT: "Domestic Transfer",
            INTERNALFT: "Internal Transfer",
            INTERNATIONALFT: "International Transfer",
            UKDOMESTICFT: "Domestic Transfer",
            SEPADOMESTICFT: "Domestic Transfer",
            SELFFT: "Self Transfer",
            DOMESTICFT_PAYLATER: "Domestic Transfer Instruction",
            INTERNALFT_PAYLATER: "Internal Transfer Instruction",
            INTERNATIONALFT_PAYLATER: "International Transfer Instruction",
            INTERNATIONALDRAFT_PAYLATER: "International Instruction",
            DOMESTICDRAFT_PAYLATER: "Domestic Instruction",
            DOMESTICDRAFT: "Domestic",
            INTERNATIONALDRAFT: "International",
            SELFFT_PAYLATER: "Self Transfer Instruction",
            myaddress: "My Address",
            BILLPAYMENT: "Bill Payment",
            branchaddress: "Branch Address"
          },
          navBarDescription: "Favorites"
        },
        generic: Generic,
        common: Common.payments.common
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
  return new FavoritesLocale();
});