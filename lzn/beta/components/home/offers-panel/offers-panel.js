define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "baseLogger",
  "ojL10n!lzn/beta/resources/nls/offers-panel",
  "ojs/ojcheckboxset",
  "ojs/ojconveyorbelt",
  "ojs/ojbutton"
], function(oj, ko, $, OffersModel, BaseLogger, resourceBundle) {
  "use strict";
  /**
   * View Model for Offers screen. This page gives details about the flow like what all details would be required and how much time would be needed to complete the flow.
   *
   * @namespace Orientation~viewModel
   * @constructor OrientationViewModel
   */

  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    rootParams.dashboard.backAllowed(false);
    self.dataLoaded = ko.observable(false);
    self.productClass = ko.observable("");
    self.productClass(self.className().toLowerCase().replace(/#|_/g, "-"));
    self.label(self.resource.productGroups[self.className()]);
    /**
     * Flag indicating offer related additional details are loaded or not.
     */
    self.additionalOfferDetailsLoaded = ko.observable(false);
    /**
     * Object to store Credit card product types.
     */
    self.offers = ko.observableArray();
    /**
     * Object to store product related basic offers of the product currently selected in the filmstrip.
     * Contents are loaded from the map 'offerDetails'.
     */
    self.currentProductOffers = ko.observable();
    /**
     * Object to store product related additional details.
     */
    self.currentProductOfferDetails = ko.observable();
    /**
     * The number of offers that can be simultaneously compared.
     */
    self.maxOffersToCompare = 3;
    /**
     * Hashmap to store offer related basic data for products.
     */
    self.offerDetails = {};
    /**
     * First Offer
     */
    self.firstOffer = ko.observable();
    /**
     * Hashmap to store offer additional details.
     */
    self.offerAdditionalDetails = {};
    /**
     * Array to store the list of offerIds that are to be compared.
     */
    self.offerIdsToCompare = ko.observableArray();
    /**
     * Comparison array updated
     */
    self.comparisonArrayUpdated = ko.observable(false);
    self.isOfferLoaded = ko.observable(false);
    /**
     * Flag indicating whether the current offer in the filmstrip has been added to comparison.
     */
    self.wantsToCompare = ko.observable(false);
    /**
     * Observable to display additional details screen.
     */
    self.showAdditionalDetails = ko.observable(false);
    /**
     * Show comparison on screen
     */
    self.showComparison = ko.observable(false);
    var productType;
    switch (self.className()) {
      case "CREDIT_CARD":
        productType = "CC";
        break;
      case "CASA":
        productType = "CASA";
        break;
      case "TERM_DEPOSITS":
        productType = "TD";
        break;
      default:
        break;
    }
    self.sessionStorageOfferData = {};
    /**
     * Array to store additional details for comparison
     */
    self.offerDetailsToCompare = ko.observableArray();
    /**
     * Initialize offerModel with product category id for type Credit Card.
     */
    OffersModel.init(self.productGroupData().id);
    /**
     * Fetch list of products(offers) in Credit Card product category.
     */
    OffersModel.getOffers().done(function(data) {
      var productIndex, offerIndex;
      for (productIndex = 0; productIndex < data.products.length; productIndex++) {
        if (data.products[productIndex].offersList) {
          for (offerIndex = 0; offerIndex < data.products[productIndex].offersList.length; offerIndex++) {
            data.products[productIndex].offersList[offerIndex].isOfferDetails = ko.observable(false);
            data.products[productIndex].offersList[offerIndex].showOffers = ko.observable(self.resource.more);
            self.offers().push(data.products[productIndex].offersList[offerIndex]);
            self.offerDetails[data.products[productIndex].offersList[offerIndex].offerId] = data.products[productIndex].offersList[offerIndex];

          }
        }
      }

      self.currentProductOffers(self.offers()[0]);
      self.dataLoaded(true);
    });
    /**
     * Fetch Offers Basic Details.
     */
    self.fetchOfferDetails = function(event, data) {
      var offerId = self.offers()[data.value].offerId;
      self.currentProductOffers(self.offerDetails[offerId]);
      /**
       * Set Compare Checkbox status for filmstrip while traversing back and forth.
       */
      var indexOfOffer = self.offerIdsToCompare().indexOf(offerId);
      if (indexOfOffer >= 0) {
        self.wantsToCompare(true);
      } else {
        self.wantsToCompare(false);
      }
    };
    /**
     * Feth offers additional details. These details shall be used for display and comparison.
     */
    self.fetchOfferAdditionalDetails = function(offer, index) {

      self.additionalOfferDetailsLoaded(false);
      var offerDetailsAvailable = false;
      if (self.offerAdditionalDetails[offer.offerId]) {
        offerDetailsAvailable = true;
      }

      if (!offerDetailsAvailable) {
        OffersModel.fetchOffersAdditionalDetails(offer.offerId, productType).done(function(data) {
          self.offerAdditionalDetails[offer.offerId] = data;
          if (self.offerAdditionalDetails[offer.offerId].offerDetails[0].offerAdditionalDetails.demandDepositOfferDetails) {
            if (self.offerAdditionalDetails[offer.offerId].offerDetails[0].offerAdditionalDetails.demandDepositOfferDetails.allowedCurrencies) {
              self.sessionStorageOfferData.offerCurrencies = ko.toJSON(self.offerAdditionalDetails[offer.offerId].offerDetails[0].offerAdditionalDetails.demandDepositOfferDetails.allowedCurrencies);
            } else {
              self.sessionStorageOfferData.offerCurrencies = ko.toJSON(self.offerAdditionalDetails[offer.offerId].offerDetails[0].offerAdditionalDetails.demandDepositOfferDetails.demandDepositOfferCurrencyParameterResponseDTOs);
            }
          }
          if (self.offerAdditionalDetails[offer.offerId].offerDetails[0].offerAdditionalDetails.termDepositOfferDetails) {
            if (self.offerAdditionalDetails[offer.offerId].offerDetails[0].offerAdditionalDetails.termDepositOfferDetails.allowedCurrencies) {
              self.sessionStorageOfferData.offerCurrencies = ko.toJSON(self.offerAdditionalDetails[offer.offerId].offerDetails[0].offerAdditionalDetails.termDepositOfferDetails.allowedCurrencies);
            } else {
              self.sessionStorageOfferData.offerCurrencies = ko.toJSON(self.offerAdditionalDetails[offer.offerId].offerDetails[0].offerAdditionalDetails.termDepositOfferDetails.termDepositOfferCurrencyParameterResponseDTOs);
            }
          }
          if (self.offerAdditionalDetails[offer.offerId].offerDetails[0].offerAdditionalDetails.cardOfferDetails) {
            self.sessionStorageOfferData.minimumCreditLimit = ko.toJSON(self.offerAdditionalDetails[offer.offerId].offerDetails[0].offerAdditionalDetails.cardOfferDetails.creditCardLimitDetail[0].minimumCreditLimit);
          }
          self.currentProductOfferDetails(data);
          self.additionalOfferDetailsLoaded(true);
          if (self.isOfferLoaded()) {
            self.offers()[index].isOfferDetails(false);
            self.submitProductOffer(index, offer);
          } else {
            self.offers()[index].isOfferDetails(true);
          }
        });
      } else {
        if (self.offerAdditionalDetails[offer.offerId].offerDetails[0].offerAdditionalDetails.demandDepositOfferDetails) {
          if (self.offerAdditionalDetails[offer.offerId].offerDetails[0].offerAdditionalDetails.demandDepositOfferDetails.allowedCurrencies) {
            self.sessionStorageOfferData.offerCurrencies = ko.toJSON(self.offerAdditionalDetails[offer.offerId].offerDetails[0].offerAdditionalDetails.demandDepositOfferDetails.allowedCurrencies);
          } else {
            self.sessionStorageOfferData.offerCurrencies = ko.toJSON(self.offerAdditionalDetails[offer.offerId].offerDetails[0].offerAdditionalDetails.demandDepositOfferDetails.demandDepositOfferCurrencyParameterResponseDTOs);
          }
        }
        if (self.offerAdditionalDetails[offer.offerId].offerDetails[0].offerAdditionalDetails.termDepositOfferDetails) {
          if (self.offerAdditionalDetails[offer.offerId].offerDetails[0].offerAdditionalDetails.termDepositOfferDetails.allowedCurrencies) {
            self.sessionStorageOfferData.offerCurrencies = ko.toJSON(self.offerAdditionalDetails[offer.offerId].offerDetails[0].offerAdditionalDetails.termDepositOfferDetails.allowedCurrencies);
          } else {
            self.sessionStorageOfferData.offerCurrencies = ko.toJSON(self.offerAdditionalDetails[offer.offerId].offerDetails[0].offerAdditionalDetails.termDepositOfferDetails.termDepositOfferCurrencyParameterResponseDTOs);
          }
        }
        if (self.offerAdditionalDetails[offer.offerId].offerDetails[0].offerAdditionalDetails.cardOfferDetails) {
          self.sessionStorageOfferData.minimumCreditLimit = ko.toJSON(self.offerAdditionalDetails[offer.offerId].offerDetails[0].offerAdditionalDetails.cardOfferDetails.creditCardLimitDetail[0].minimumCreditLimit);
        }
        self.currentProductOfferDetails(self.offerAdditionalDetails[offer.offerId]);
        self.additionalOfferDetailsLoaded(true);
        if (self.isOfferLoaded()) {
          self.offers()[index].isOfferDetails(false);
          self.submitProductOffer(index, offer);
        } else {
          self.offers()[index].isOfferDetails(true);
        }
      }
    };

    /**
     * Add offers to be compared to an array. Fetch offer additional details that are required for comparison.
     * Update to this method is required if corresponding checkbox id pattern 'compare_offerId' is changed.
     */
    self.addOfferToCompare = function() {
      if (self.currentProductOffers()) {
        var offerId = self.currentProductOffers().offerId;
        if (self.wantsToCompare()) {
          if (self.offerIdsToCompare().length < self.maxOffersToCompare) {
            self.comparisonArrayUpdated(false);
            self.offerIdsToCompare().push(offerId);
            self.comparisonArrayUpdated(true);
          }
          self.fetchOfferAdditionalDetails(offerId);
        } else {
          var indexOfOfferToRemoveFromCompare = self.offerIdsToCompare().indexOf(offerId);
          if (indexOfOfferToRemoveFromCompare >= 0) {
            self.comparisonArrayUpdated(false);
            self.offerIdsToCompare().splice(indexOfOfferToRemoveFromCompare, 1);
            self.comparisonArrayUpdated(true);
          }
        }
      }
    };
    /**
     * jquery call to manage checkbox change event.
     */
    $(document).on("change", "input[name='compare']", function() {
      self.addOfferToCompare();
    });
    /**
     * Call this method when user has applied an offer to his application.
     * Save Offer details for review screen.
     * Save typeApplication for Submission Confirmation screen.
     */

    self.submitOffer = function(index, data) {
      if (!self.offers()[index].isOfferDetails()) {
        self.isOfferLoaded(true);
        self.fetchOfferAdditionalDetails(data, index);
      } else {
        self.submitProductOffer(index, data);
      }
    };

    self.submitProductOffer = function(index, data) {
      self.sessionStorageOfferData.offers = ko.toJSON(data);
      self.sessionStorageOfferData.selectedOfferId = data.offerId;
      if (self.currentProductOfferDetails() && self.currentProductOfferDetails().offerDetails[0].offerAdditionalDetails.termDepositOfferDetails) {
        self.sessionStorageOfferData.productCodeTD = self.currentProductOfferDetails().offerDetails[0].offerAdditionalDetails.termDepositOfferDetails.productCode;
      }
      if (self.currentProductOfferDetails() && self.currentProductOfferDetails().offerDetails[0].offerAdditionalDetails.demandDepositOfferDetails) {
        self.sessionStorageOfferData.productCodeCASA = self.currentProductOfferDetails().offerDetails[0].offerAdditionalDetails.demandDepositOfferDetails.productCode;
      }
      self.productGroupData().selectedOfferId = data.offerId;
      if (!self.userLoggedIn()) {
        OffersModel.createSession().done(function() {
          self.loadProduct(self.productGroupData());
        });
      } else {
        self.loadProduct(self.productGroupData());
      }
    };
    /**
     * Shows product additional details on the screen
     */
    self.showMoreDetails = function(data, index) {
      if (!self.showAdditionalDetails()) {
        self.additionalOfferDetailsLoaded(false);
        self.fetchOfferAdditionalDetails(data, index);
        self.showAdditionalDetails(true);
        self.offers()[index].showOffers(self.resource.less);
      } else {
        self.showAdditionalDetails(false);
        self.offers()[index].isOfferDetails(false);
        self.offers()[index].showOffers(self.resource.more);
      }
    };
    /**
     * Open comparison component on screen
     */
    self.compareOffers = function() {
      var index = 0,
        offerId;
      self.showComparison(false);
      self.offerDetailsToCompare = [];
      for (index = 0; index < self.offerIdsToCompare().length; index++) {
        offerId = self.offerIdsToCompare()[index];
        self.offerDetailsToCompare.push(self.offerAdditionalDetails[offerId]);
      }
      self.showComparison(true);
    };
    /**
     * Close comparison component on screen.
     */
    self.closeComparison = function() {
      /**
       * Set Compare Checkbox status for filmstrip while setting for first offer.
       */
      var indexOfOffer = self.offerIdsToCompare().indexOf(self.firstOffer());
      if (indexOfOffer >= 0) {
        self.wantsToCompare(true);
      } else {
        self.wantsToCompare(false);
      }
      self.showComparison(false);
    };
    /**
     * Remove offer from comparison array and comparison screen.
     */
    self.removeFromCompare = function(offerId) {
      var indexOfOfferToRemoveFromCompare = self.offerIdsToCompare().indexOf(offerId);
      if (indexOfOfferToRemoveFromCompare >= 0) {
        self.showComparison(false);
        self.comparisonArrayUpdated(false);
        self.offerIdsToCompare().splice(indexOfOfferToRemoveFromCompare, 1);
        self.comparisonArrayUpdated(true);
        self.compareOffers();
      }
    };
    /**
     * Remove offer from comparison array.
     */
    self.removeFromArray = function(offerId) {
      var indexOfOfferToRemoveFromCompare = self.offerIdsToCompare().indexOf(offerId);
      if (indexOfOfferToRemoveFromCompare >= 0) {
        self.comparisonArrayUpdated(false);
        self.offerIdsToCompare().splice(indexOfOfferToRemoveFromCompare, 1);
        self.comparisonArrayUpdated(true);
      }
      if (offerId === self.currentProductOffers().offerId) {
        self.wantsToCompare(false);
      }
    };
    /**
     * Call this method when user has applied an offer to his application.
     * Save Offer details for review screen.
     * Save typeApplication for Submission Confirmation screen.
     */
    self.submitProductOfferFromCompare = function(offerId) {
      self.productDetails().selectedOfferId = offerId;
      self.productDetails().typeApplication = "TD";
      self.productDetails().offers = self.currentProductOffers()[0];
      self.getNextStage();
    };

    self.showEffect = function(id) {
      $("#" + id).css("opacity", "0.7");
    };
    self.hideEffect = function(id) {
      $("#" + id).css("opacity", "1");
    };
    self.hoverMoreDetails = function(id) {
      $("#" + id).addClass("more-details-hover");
    };
    self.hoverOutMoreDetails = function(id) {
      $("#" + id).removeClass("more-details-hover");
    };
    document.body.style.backgroundImage = "url(" + self.constants.imageResourcePath + "/origination/BG/" + (rootParams.baseModel.medium() ? "medium/" : "/") + self.productHeaderImage() + ".jpg)";

  };
});
