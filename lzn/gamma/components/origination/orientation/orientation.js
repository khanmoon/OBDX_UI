define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "baseLogger",
  "ojL10n!lzn/gamma/resources/nls/orientation",
  "ojs/ojoffcanvas",
  "ojs/ojbutton"
], function(oj, ko, $, OrientationModelObject, BaseLogger, resourceBundle) {
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
      self.getNextStage();
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
      if (self.queryMap && self.queryMap.TransactionRefNumber) {
        self.sessionStorageData.transactionRefNumber = self.queryMap.TransactionRefNumber;
      }
      if (self.productDetails().productType) {
        self.sessionStorageData.productType = self.productDetails().productType;
      }
      self.sessionStorageData.selectedState = self.selectedState();
      self.sessionStorageData.isCustomer = true;
      self.sessionStorageData.loginRedirection = true;
      OrientationModel.deleteSession().done(function() {
        rootParams.baseModel.switchPage({
          homeComponent: {
            module: "application-tracking",
            component: "application-tracking-base",
            query: {
              context: "index"
            }
          }
        }, true, true, self.sessionStorageData);
      });
    };
  };
});
