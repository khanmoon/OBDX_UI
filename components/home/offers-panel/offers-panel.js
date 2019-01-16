define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "baseLogger",
  "ojL10n!resources/nls/offers-panel",
  "ojs/ojcheckboxset",
  "ojs/ojconveyorbelt",
  "ojs/ojbutton"
], function(oj, ko, $, OffersModel, BaseLogger, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    rootParams.dashboard.backAllowed(false);
    self.dataLoaded = ko.observable(false);
    self.productClass = ko.observable("");
    self.productClass(self.className().toLowerCase().replace(/#|_/g, "-"));
    self.label(self.resource.productGroups[self.className()]);
    var productHeader = self.actionCardData().productClass;
    if (self.actionCardData().productType) {
      productHeader = self.actionCardData().productType;
    }
    self.productHeaderImage(productHeader + "-product-bg");
    self.additionalOfferDetailsLoaded = ko.observable(false);
    self.offers = ko.observableArray();
    self.currentProductOffers = ko.observable();
    self.currentProductOfferDetails = ko.observable();
    self.maxOffersToCompare = 3;
    self.offerDetails = {};
    self.firstOffer = ko.observable();
    self.offerAdditionalDetails = {};
    self.offerIdsToCompare = ko.observableArray();
    self.comparisonArrayUpdated = ko.observable(false);
    self.isOfferLoaded = ko.observable(false);
    self.wantsToCompare = ko.observable(false);
    self.showAdditionalDetails = ko.observable(false);
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
    self.offerDetailsToCompare = ko.observableArray();
    rootParams.dashboard.headerName(rootParams.baseModel.format(self.resource.ptOffers, {
      productType: self.resource.productType[self.productGroupData().productTypeConstants]
    }));
    OffersModel.init(self.productGroupData().id);
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
    self.fetchOfferDetails = function(event) {
      var offerCode = self.offers()[event.detail.value].offerCode;
      self.currentProductOffers(self.offerDetails[offerCode]);
      var indexOfOffer = self.offerIdsToCompare().indexOf(offerCode);
      if (indexOfOffer >= 0) {
        self.wantsToCompare(true);
      } else {
        self.wantsToCompare(false);
      }
    };
    self.sessionStorageOfferData = {};
    self.fetchOfferAdditionalDetails = function(offer, index) {
      self.additionalOfferDetailsLoaded(false);
      var offerDetailsAvailable = false;
      if (self.offerAdditionalDetails[offer.offerCode]) {
        offerDetailsAvailable = true;
      }
      if (!offerDetailsAvailable) {
        OffersModel.fetchOffersAdditionalDetails(offer.offerCode, productType).done(function (data) {
          self.offerAdditionalDetails[offer.offerCode] = data;
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
        self.currentProductOfferDetails(self.offerAdditionalDetails[offer.offerCode]);
        self.additionalOfferDetailsLoaded(true);
        if (self.isOfferLoaded()) {
          self.offers()[index].isOfferDetails(false);
          self.submitProductOffer(index, offer);
        } else {
          self.offers()[index].isOfferDetails(true);
        }
      }
    };
    self.submitOffer = function(index, data1) {
      OffersModel.fetchOffersAdditionalDetails(data1.offerCode, productType).done(function(data) {
        data1.offerAdditionalDetails = data.offerDetailsDTO;
        self.submitProductOffer(index, data1);
      });
    };
    self.submitProductOffer = function(index, data) {
      self.sessionStorageOfferData = data;
      self.productGroupData().selectedOfferId = data.offerCode;
      if (!self.userLoggedIn()) {
        OffersModel.createSession().done(function() {
          self.loadProduct(self.productGroupData());
        });
      } else {
        self.loadProduct(self.productGroupData());
      }
    };
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
    document.body.style.backgroundImage = "url(" + self.constants.imageResourcePath + "/origination/BG/" + (rootParams.baseModel.medium() ? "medium/" : "/") + self.productHeaderImage() + ".jpg)";
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
  };
});
