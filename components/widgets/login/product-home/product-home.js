define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "ojL10n!resources/nls/product-home"
], function(oj, ko, $, ProductHomeModel, resourceBundle) {
  "use strict";
  return function(Params) {
    var self = this;
    ko.utils.extend(self, Params.rootModel);
    self.resource = resourceBundle;
    self.showPage = ko.observable(false);
    Params.baseModel.registerComponent("layout", "login");
    Params.baseModel.registerComponent("bank-products", "home");
    self.compName = ko.observable();
    self.compName("bank-products");
    self.landingModule = null;
    self.landingComponent = null;
    self.productHeaderImage = ko.observable("");
    self.isLogin = ko.observable(false);
    Params.dashboard.backAllowed(false);
    Params.baseModel.registerComponent("login-form", "widgets/login");
    self.userLoggedIn = ko.observable(false);
    self.homePage = ko.observable(true);
    self.label = ko.observable();
    self.context = ko.observable();
    self.userProfile = ko.observable();
    self.userRoles = ko.observableArray();
    self.goToBack = function() {
      history.back();
    };
    self.actionCardData = ko.observable();
    self.type = ko.observable();
    self.className = ko.observable();
    self.productGroupData = ko.observable();
    self.showComponent = ko.observable(true);
    self.hideMobileLanding = ko.observable(false);
    if (self.params && self.params.hideMobileLanding) {
      self.hideMobileLanding(true);
    }
    if (self.params && self.params.landingModule && self.params.landingComponent) {
      self.landingModule = self.params.landingModule;
      self.landingComponent = self.params.landingComponent;
      self.hideMobileLanding(true);
    }
    Params.baseModel.registerComponent("tooltip", "login");
    Params.baseModel.registerComponent("login-carousal", "login");
    Params.baseModel.registerComponent("product-groups-carousal", "login");
    Params.baseModel.registerComponent("product-groups-list", "login");
    Params.baseModel.registerComponent("user-information", "recovery");
    Params.baseModel.registerComponent("reset-password", "recovery");
    Params.baseModel.registerComponent("user-credentials", "registration");
    Params.baseModel.registerComponent("locator", "location");
    Params.baseModel.registerComponent("branch-details", "location");
    Params.baseModel.registerComponent("otp-verification", "base-components");
    Params.baseModel.registerElement("modal-window");
    Params.baseModel.registerElement("row");
    Params.baseModel.registerComponent("product-groups", "login");
    Params.baseModel.registerElement("page-section");
    Params.baseModel.registerComponent("origination-header", "login");
    Params.baseModel.registerComponent("mobile-landing", "home");
    self.context = ko.observable();
    self.actionCardClick = function(data, cardData) {
      self.homePage(false);
      self.type(data);
      self.actionCardData(cardData.data);
      self.className(cardData.data.productClass);
      Params.dashboard.loadComponent("product-groups", {});
      self.compName("product-groups");
    };
    Params.baseModel.registerComponent("page-banner", "widgets/pre-login");
    Params.baseModel.registerComponent("tools-and-calculators", "home");
    Params.baseModel.registerComponent("loan-showcase", "home");
    Params.baseModel.registerComponent("goals", "home");
    Params.baseModel.registerComponent("company-links", "home");
    self.products = ko.observable("bank-products");
    self.sessionStorageData = {};
    self.loadProduct = function(productGroupData) {
      self.sessionStorageData.productCode = productGroupData.id;
      self.sessionStorageData.productDescription = productGroupData.description;
      self.sessionStorageData.productClassName = productGroupData.allowedProductClassName;
      self.sessionStorageData.isInPrincipleApproval = self.actionCardData().inPrincipleApproval;
      if (productGroupData.allowedProductClassName === "LOANS") {
        self.sessionStorageData.isCollateralRequired = productGroupData.isCollateralRequired;
      }
      if (productGroupData.productTypeConstants) {
        self.sessionStorageData.productType = productGroupData.productTypeConstants;
      }
      Params.baseModel.switchPage({
        module: "origination",
        context: "index"
      }, false, true, self.sessionStorageData);
    };
  };
});
