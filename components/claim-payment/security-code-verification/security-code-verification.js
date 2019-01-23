define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "baseLogger",

  "ojL10n!resources/nls/security-code-verification",
  "ojs/ojinputnumber",
  "ojs/ojradioset"
], function (oj, ko, $, SecuritycodeModel, BaseLogger, ResourceBundle) {
  "use strict";
  return function (rootParams) {
    var self = this,
      getNewKoModel = function () {
        var KoModel = ko.mapping.fromJS(SecuritycodeModel.getNewModel());
        return KoModel;
      };
    ko.utils.extend(self, rootParams.rootModel);
    self.verificationModel = getNewKoModel().securitycodeVerificationModel;
    self.stageOne = ko.observable(true);
    self.stageTwo = ko.observable(false);
    self.validationTracker = ko.observable();
    self.showAliasValueAndAliasMode = ko.observable(true);
    self.isDisable = ko.observable(false);
    SecuritycodeModel.init();
    self.resource = ResourceBundle;
    rootParams.dashboard.headerName(self.resource.payments.peertopeer.claimPaymentHeader);
    rootParams.baseModel.registerComponent("social-media", "social-media");
    self.loadUserProfile = function (response) {
      self.verificationModel.aliasValue(response.id);
    };
    self.changeValue = function () {
      self.verificationModel.aliasValue(null);
    };
    self.verifySecurityCode = function (user) {
      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }
      var payload = ko.toJSON(self.verificationModel);
      self.aliasType(self.verificationModel.aliasType());
      self.aliasValue(self.verificationModel.aliasValue());
      SecuritycodeModel.verifySecurityCode(payload).done(function (data) {
        self.paymentId(data.paymentId);
        if (user === "existing") {
          rootParams.baseModel.switchPage({
            homeComponent: {
              component: "claim-payment-existing-user-dashboard",
              module: "claim-payment-existing-user",
              query: {
                value: self.aliasValue(),
                type: self.aliasType(),
                id: self.paymentId(),
                user: "existing",
                menuNavigationAvailable: false
              }
            }
          }, true);
        } else if (user === "new") {
          self.loadComp("user-onboarding");
        }
      });
    };
    self.transferToArray = [{
        id: "email",
        value: "EMAIL",
        label: self.resource.payments.peertopeer.EMAIL
      },
      {
        id: "mobile",
        value: "MOBILE",
        label: self.resource.payments.peertopeer.mobileno
      },
      {
        id: "facebook",
        value: "FACEBOOK",
        label: self.resource.payments.peertopeer.facebook
      }
    ];
    self.verificationModel.aliasType("EMAIL");
    self.existingUser = function () {
      self.verifySecurityCode("existing");
    };
    self.newUser = function () {
      self.verifySecurityCode("new");
    };
    self.back = function () {
      if (!rootParams.baseModel.cordovaDevice()) {
        window.location = "/index.html?module=home";
      } else {
        rootParams.baseModel.switchPage({
          module: "login",
          internal: true
        }, false);
      }
    };
  };
});