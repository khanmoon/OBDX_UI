define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/quick-links",
  "ojL10n!resources/nls/bank-products"
], function(oj, ko, $, BankProductModel, resourceBundle, resourceBundleProducts) {
  "use strict";

  return function(Params) {
    var self = this;
    ko.utils.extend(self, Params.rootModel);
    self.nls = resourceBundle;
    self.resource = resourceBundleProducts;
    self.renderModuleData = ko.observable(false);
    self.productTiles = ko.observable();
    self.tiles = ko.observableArray([]);

    BankProductModel.fetchProductTiles().done(function(data) {
      self.productTiles(data.productTypes);
      self.renderModuleData(true);
    });
  };
});