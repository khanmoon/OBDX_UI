define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!lzn/alpha/resources/nls/product-home",
  "framework/js/constants/constants"
], function(oj, ko, $, ProductHomeModel, resourceBundle, Constants) {
  "use strict";
  return function(Params) {
    var self = this;
    ko.utils.extend(self, Params.rootModel);
    self.resource = resourceBundle;
    self.showPage = ko.observable(false);
    Params.baseModel.registerComponent("layout", "home");
    Params.baseModel.registerComponent("bank-products", "home");
    self.compName = ko.observable();
    self.compName("bank-products");
    self.productHeaderImage = ko.observable("");
    self.isLogin = ko.observable(false);
    Params.dashboard.backAllowed(false);
    self.userLoggedIn = ko.observable(false);
    self.homePage = ko.observable(true);
    self.label = ko.observable();
    self.context = ko.observable();
    self.userProfile = ko.observable();
    self.userRoles = ko.observableArray();
    self.constants = Constants;
    self.actionCardData = ko.observable();
    self.type = ko.observable();
    self.className = ko.observable();
    self.productGroupData = ko.observable();
    self.showComponent = ko.observable(true);
    Params.baseModel.registerComponent("tooltip", "home");
    Params.baseModel.registerComponent("login-carousal", "home");
    Params.baseModel.registerComponent("product-groups-carousal", "home");
    Params.baseModel.registerComponent("product-groups-list", "home");
    Params.baseModel.registerComponent("user-information", "forgot-password");
    Params.baseModel.registerComponent("reset-password", "forgot-password");
    Params.baseModel.registerComponent("user-credentials", "registration");
    Params.baseModel.registerComponent("locator", "atm-branch-locator");
    Params.baseModel.registerComponent("branch-details", "location");
    Params.baseModel.registerComponent("otp-verification", "base-components");
    Params.baseModel.registerElement("modal-window");
    Params.baseModel.registerElement("row");
    Params.baseModel.registerComponent("product-groups", "home");
    Params.baseModel.registerElement("page-section");
    Params.baseModel.registerComponent("mobile-landing", "home");
    Params.baseModel.registerComponent("search-vehicle", "home");
    document.body.style.backgroundImage = "none";
    self.switchPageProduct = function() {
      Params.dashboard.loadComponent("product-groups", {}, self);
      self.compName("product-groups");
    };


    self.actionCardClick = function(data, cardData) {
      self.homePage(false);
      self.type(data);
      self.actionCardData(cardData);
      self.className(cardData.productClass);
      self.switchPageProduct(ProductHomeModel);
    };
    if (Params.dashboard.userData && Params.dashboard.userData.userProfile) {
      self.userProfile(Params.dashboard.userData.userProfile);
      self.userLoggedIn(true);
    }
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
      self.sessionStorageData.productGroupMaxTerm = productGroupData.maxTerm;
      self.sessionStorageData.selectedOfferId = productGroupData.selectedOfferId;
      if (productGroupData.allowedProductClassName === "LOANS") {
        self.sessionStorageData.isCollateralRequired = productGroupData.isCollateralRequired;
      }
      if (productGroupData.productTypeConstants) {
        self.sessionStorageData.productType = productGroupData.productTypeConstants;
      }
      Params.baseModel.switchPage({
        homeComponent: {
          component: "product-base",
          module: "origination",
          query: {
            context: "index"
          }
        }
      }, false, true, self.sessionStorageData);
    };
    self.exitApplication = function() {
      $("#EXITAPPLICATION").show().trigger("openModal");
    };
    self.cancelApplication = function() {
      Params.dashboard.switchModule("home", true);
    };
  };
});
