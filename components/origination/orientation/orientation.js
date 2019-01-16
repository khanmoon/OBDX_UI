define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "baseLogger",
  "ojL10n!resources/nls/orientation",
  "framework/js/constants/constants",
  "ojs/ojoffcanvas",
  "ojs/ojbutton"
], function(oj, ko, $, OrientationModelObject, BaseLogger, resourceBundle, Constants) {
  "use strict";
  return function(rootParams) {
    var self = this,
      OrientationModel = new OrientationModelObject();
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    rootParams.baseModel.registerComponent("social-media", "social-media");
    self.initializeModel = function() {
      OrientationModel.init(self.productDetails().submissionId.value);
    };
    self.initializeModel();
    self.orientationPartial = ko.observable();
    var className = self.productDetails().productClassName;
    self.orientationPartial(className.toLowerCase().replace(/#|_/g, "-"));
    self.showPrivacyPolicy = function() {
      $("#privacyPolicy").ojDialog("open");
    };
    self.showSecurityPolicy = function() {
      $("#securityPolicy").ojDialog("open");
    };
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
        require(["components/origination/requirements/ko/bindings/requirements-bindings"], function() {
          rootParams = {
            rootModel: self
          };
        });
      } else {
        self.getNextStage();
      }
    };
    self.exitApplication = function() {
      $("#EXITAPPLICATION").show().trigger("openModal");
    };
    var payload = {
      productClass: self.productDetails().productClassName,
      currentStep: "ORIENTATION",
      cancellationReasonsDTOs: [{
        code: "OTHERS",
        description: self.resource.others
      }]
    };
    self.cancelApplication = function() {
      OrientationModel.saveModel(ko.toJSON(payload)).then(function() {
        rootParams.baseModel.registerComponent("product-home", "widgets/pre-login");
        rootParams.dashboard.switchModule("home", true);
      });
    };
    self.sessionStorageData = {};
    self.login = function() {
      self.sessionStorageData.productCode = self.productDetails().productCode;
      self.sessionStorageData.productDescription = self.productDetails().productDescription;
      self.sessionStorageData.isCollateralRequired = self.productDetails().isCollateralRequired;
      self.sessionStorageData.productClassName = self.productDetails().productClassName;
      if (self.productDetails().productType) {
        self.sessionStorageData.productType = self.productDetails().productType;
      }
      if (self.queryMap && self.queryMap.TransactionRefNumber) {
        self.sessionStorageData.transactionRefNumber = self.queryMap.TransactionRefNumber;
      }
      self.sessionStorageData.isCustomer = true;
      self.sessionStorageData.loginRedirection = true;
      self.sessionStorageData.entity = Constants.currentEntity;
      if (self.productDetails().offers) {
        self.sessionStorageData.offers = JSON.stringify(self.productDetails().offers);
      }
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
