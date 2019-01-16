define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "baseLogger",
  "ojL10n!lzn/beta/resources/nls/orientation",
  "ojL10n!lzn/beta/resources/nls/orientation-accessibility",
  "ojs/ojoffcanvas",
  "ojs/ojbutton"
], function(oj, ko, $, OrientationModelObject, BaseLogger, resourceBundle, accesibilityResourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;

    var OrientationModel = new OrientationModelObject();
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    self.accessibilityResource = accesibilityResourceBundle;
    rootParams.baseModel.registerComponent("requirements", "origination");
    self.showPrivacyPolicy = function() {
      $("#privacyPolicy").ojDialog("open");
    };
    self.showSecurityPolicy = function() {
      $("#securityPolicy").ojDialog("open");
    };

    self.loadNextStage = function() {
      if (self.productDetails().productClassName === "CREDIT_CARD") {
        require(["lzn/beta/components/origination/requirements"], function(RequirementViewModel) {
          rootParams = {
            rootModel: self,
            baseModel: rootParams.baseModel
          };
          new RequirementViewModel.viewModel(rootParams);
        });
      } else {
        self.getNextStage();
      }
    };
    self.orientationPartial = ko.observable();
    var className = self.productDetails().productClassName;
    self.orientationPartial(className.toLowerCase().replace(/#|_/g, "-"));
    self.showPrivacyPolicy = function() {
      $("#privacyPolicy").ojDialog("open");
    };
    self.showSecurityPolicy = function() {
      $("#securityPolicy").ojDialog("open");
    };
    self.exitApplication = function() {
      $("#EXITAPPLICATION").trigger("openModal");
    };
    self.sessionStorageData = {};
    self.sessionStorageOfferData = {};

    self.login = function() {
      self.sessionStorageData.productCode = self.productDetails().productCode;
      self.sessionStorageData.productDescription = self.productDetails().productDescription;
      self.sessionStorageData.isCollateralRequired = self.productDetails().isCollateralRequired;
      self.sessionStorageData.productClassName = self.productDetails().productClassName;
      if (self.productDetails().offers) {
        self.sessionStorageData.offers = ko.toJSON(self.productDetails().offers);
        self.sessionStorageData.selectedOfferId = self.productDetails().offerId;
        if (self.productDetails().offerCurrencies) {
          self.sessionStorageData.offerCurrencies = ko.toJSON(self.productDetails().offerCurrencies);
        }
      }
      if (self.productDetails().productType) {
        self.sessionStorageData.productType = self.productDetails().productType;
      }
      self.sessionStorageData.selectedState = self.productDetails().selectedState;
      self.sessionStorageData.productCodeTD = self.productDetails().productCodeTD;
      self.sessionStorageData.productCodeCASA = self.productDetails().productCodeCASA;
      self.sessionStorageData.isInPrincipleApproval = self.productDetails().isInPrincipleApproval;
      self.sessionStorageData.loginRedirection = true;
      // eslint-disable-next-line no-storage/no-browser-storage
      sessionStorage.sessionStorageData = JSON.stringify(self.sessionStorageData);
      OrientationModel.deleteSession().done(function() {
        rootParams.baseModel.switchPage({
          homeComponent: {
            component: "product-base",
            module: "origination",
            query: {
              context: "index"
            }
          }
        }, true, true);
      });
    };
  };
});
