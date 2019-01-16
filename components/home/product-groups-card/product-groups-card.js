define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "ojL10n!resources/nls/product-groups-card"

], function(oj, ko, $, ProductGroupCardModel, resourceBundle) {
  "use strict";

  return function(Params) {
    var self = this;
    ko.utils.extend(self, Params.rootModel);
    self.resource = resourceBundle;

    self.showCard = ko.observable(false);
    self.data = Params.data;

    if (self.data) {
      self.showCard(true);
    }

    self.selectProduct = function(data) {
      self.thisData = data;

      if (!self.userLoggedIn()) {
        if (self.className() === "LOANS") {
          ProductGroupCardModel.createSession().done(function() {
            self.loadProduct(self.thisData);
          });
        } else {
          self.loadOffers(self.thisData);
        }
      } else if (self.className() === "LOANS") {
          self.loadProduct(self.thisData);
        } else {
          self.loadOffers(self.thisData);
        }

    };
    self.loadOffers = function(data) {
      self.productGroupData(data);
      Params.baseModel.registerComponent("offers-panel", "home");
      self.showComponent(false);
      Params.dashboard.loadComponent("offers-panel", {}, self);
    };

  };
});
