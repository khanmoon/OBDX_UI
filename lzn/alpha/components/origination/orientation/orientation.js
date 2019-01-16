define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "baseLogger",
  "ojL10n!lzn/alpha/resources/nls/orientation",
  "ojs/ojoffcanvas",
  "ojs/ojbutton"
], function(oj, ko, $, OrientationModelObject, BaseLogger, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    var OrientationModel = new OrientationModelObject();
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    rootParams.baseModel.registerComponent("social-media", "social-media");
    self.loadNextStage = function(socialMediaResponse) {
      self.socialMediaResponse({});
      if (socialMediaResponse.values) {
        self.socialMediaResponse().firstName = socialMediaResponse.values[0].firstName;
        self.socialMediaResponse().lastName = socialMediaResponse.values[0].lastName;
        self.socialMediaResponse().email = socialMediaResponse.values[0].emailAddress;
        self.socialMediaResponse().location = socialMediaResponse.values[0].location;
      } else {
        self.socialMediaResponse().firstName = socialMediaResponse.first_name;
        self.socialMediaResponse().lastName = socialMediaResponse.last_name;
        self.socialMediaResponse().email = socialMediaResponse.email;
        self.socialMediaResponse().gender = socialMediaResponse.gender;
      }
      if (self.productDetails().productClassName === "CREDIT_CARD") {
        require(["lzn/alpha/components/origination/requirements"], function(RequirementViewModel) {
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
    self.login = function() {
      self.sessionStorageData.productCode = self.productDetails().productCode;
      self.sessionStorageData.productType = self.productDetails().productType;
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
