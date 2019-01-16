define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "baseLogger",
  "ojL10n!resources/nls/search-vehicle",
  "framework/js/constants/constants",
  "ojs/ojfilmstrip",
  "ojs/ojcheckboxset",
  "ojs/ojconveyorbelt",
  "ojs/ojbutton"
], function(oj, ko, $, SearchVehicleModel, BaseLogger, resourceBundle, Constants) {
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
    self.filteredProducts = ko.observable([]);
    self.constants = Constants;
    var productType = self.actionCardData().productClass;
    if (self.actionCardData().productType) {
      productType = self.actionCardData().productType;
    }
    self.productHeaderImage(productType + "-product-bg");
    var productGroupData = {
        "AUTOLOANFLL": {
          allowedProductClassName: "LOANS",
          creditPolicyTemplate: "USCP03",
          description: self.resource.productGroupDescription[self.actionCardData().productType],
          id: "USPG03",
          isCollateralRequired: true,
          maxTerm: 84,
          minTerm: 12,
          productTypeConstants: "AUTOLOANFLL"
        },
        "AUTOMOBILE": {
          allowedProductClassName: self.actionCardData().productClass,
          creditPolicyTemplate: "USCP01",
          description: self.resource.productGroupDescription[self.actionCardData().productType],
          id: "LOAN-UN",
          isCollateralRequired: true,
          maxTerm: 84,
          minTerm: 12,
          productTypeConstants: self.actionCardData().productType,
          productHostId: self.actionCardData().id
        }
      },
      url;
    if (self.className() === "LOANS") {
      url = "productClass/LOANS/productGroups?isCollateralRequired=" + self.actionCardData().isCollateralRequired + "&productType=" + self.actionCardData().productType;
    } else if (self.className() === "CASA") {
      url = "productClass/CASA/productGroups?productType=" + self.actionCardData().productType;
    } else {
      url = "productClass/" + self.className() + "/productGroups";
    }
    self.applyNow = function() {
      SearchVehicleModel.fetchProductGroups(url).done(function(data) {
        if (data && data.productGroups && data.productGroups[0]) {
          productGroupData[self.actionCardData().productType].id = data.productGroups[0].id;
          productGroupData[self.actionCardData().productType].maxTerm = data.productGroups[0].maxTerm;
          productGroupData[self.actionCardData().productType].minTerm = data.productGroups[0].minTerm;
        }
        if (!self.userLoggedIn()) {
          SearchVehicleModel.createSession().done(function() {
            self.loadProduct(productGroupData[self.actionCardData().productType]);
          });
        } else {
          self.loadProduct(productGroupData[self.actionCardData().productType]);
        }
        self.filteredProducts(data.productGroups);
      });
    };

    self.sessionStorageData = {};
    self.storeProductData = function(productGroupData) {
      self.sessionStorageData.productCode = productGroupData.id;
      self.sessionStorageData.productDescription = productGroupData.description;
      self.sessionStorageData.productClassName = productGroupData.allowedProductClassName;
      self.sessionStorageData.productGroupMaxTerm = productGroupData.maxTerm;
      if (self.selectedState && self.selectedState()) {
        self.sessionStorageData.selectedState = self.selectedState();
        self.selectedState("");
      }
      if (productGroupData.allowedProductClassName === "LOANS") {
        self.sessionStorageData.isCollateralRequired = productGroupData.isCollateralRequired;
      }
      if (productGroupData.productTypeConstants) {
        self.sessionStorageData.productType = productGroupData.productTypeConstants;
      }
    };
    self.searchVehicle = function() {
      SearchVehicleModel.fetchProductGroups(url).done(function(data) {
        if (data && data.productGroups && data.productGroups[0]) {
          productGroupData[self.actionCardData().productType].id = data.productGroups[0].id;
          productGroupData[self.actionCardData().productType].maxTerm = data.productGroups[0].maxTerm;
          productGroupData[self.actionCardData().productType].minTerm = data.productGroups[0].minTerm;
        }
        self.storeProductData(productGroupData[self.actionCardData().productType]);
        if (!self.userLoggedIn()) {
          SearchVehicleModel.createSession().done(function() {
            // eslint-disable-next-line no-storage/no-browser-storage
            var entity=sessionStorage.getItem("entity")?sessionStorage.getItem("entity"):Constants.defaultEntity;
            window.location.href = self.dealerDetails[0].url+"?productCode="+productGroupData[self.actionCardData().productType].id+"&productDescription"+productGroupData[self.actionCardData().productType].description+"&productClassName="+productGroupData[self.actionCardData().productType].allowedProductClassName+"&productGroupMaxTerm="+productGroupData[self.actionCardData().productType].maxTerm+"&selectedState"+self.sessionStorageData.selectedState+"&isCollateralRequired="+productGroupData[self.actionCardData().productType].isCollateralRequired+"&productType="+self.actionCardData().productType+"&entity="+entity+"&dealerId="+self.dealerDetails[0].dealerId;
          });
        } else {
          window.location.href = self.dealerDetails[0].url;
        }
      });
    };
  };
});
