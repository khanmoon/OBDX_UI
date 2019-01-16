define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "framework/js/constants/constants",
  "ojL10n!resources/nls/forgot-password",
  "ojL10n!resources/nls/change-password",
  "ojs/ojinputtext",
  "ojs/ojdatetimepicker",
  "ojs/ojcheckboxset",
  "ojs/ojselectcombobox",
  "ojs/ojdatetimepicker",
  "ojs/ojvalidation",
  "ojs/ojvalidationgroup",
  "ojs/ojknockout-validation"
], function(oj, ko, $, ResetPasswordModel, Constants, resourceBundle, passwordPolicyResourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    if (Constants.module === "WALLET") {
      self.verificationResponse = ko.observable(rootParams.rootModel.verificationResponse());
      self.response = ko.observable(rootParams.rootModel.response());
    } else {
      self.verificationResponse = ko.observable(self.verificationResponse());
      self.response = ko.observable(self.response());
    }
    self.nls = resourceBundle;
    self.passwordPolicynls = passwordPolicyResourceBundle;
    self.showConfirmation = ko.observable(false);
    self.enteredNewPassword = ko.observable(true);
    self.pwshown = ko.observable(false);
    self.pwdMinLength = ko.observable();
    self.pwdMaxLength = ko.observable();
    self.nbrUpperAlpha = ko.observable();
    self.nbrLowerAlpha = ko.observable();
    self.nbrNumeric = ko.observable();
    self.nbrSpecial = ko.observable();
    self.specialAllowed = ko.observableArray();
    self.displaypasswordpolicy = ko.observable(false);
    self.newPassword = ko.observable();
    self.confirmPassword = ko.observable();
    self.pwdnullcheck = ko.observable();
    self.cnfmPwdNullCheck = ko.observable();
    self.showPasswordRule1 = ko.observable();
    self.showPasswordRule2 = ko.observable();
    self.showPasswordRule3 = ko.observable();
    rootParams.baseModel.registerComponent("password-validation", "password-policy-validation");
    rootParams.baseModel.registerElement("modal-window");
    rootParams.dashboard.headerName(self.nls.forgotPassword.details.resetPassword);
    $(document).on("focusout", function() {
      rootParams.baseModel.showComponentValidationErrors(self.pwdnullcheck());
    });
    var data = self.response().passwordPolicyDTO;

    self.pwdMinLength = ko.observable(data.pwdMinLength);
    self.pwdMaxLength = ko.observable(data.pwdMaxLength);
    self.nbrUpperAlpha = ko.observable(data.nbrUpperAlpha);
    self.nbrLowerAlpha = ko.observable(data.nbrLowerAlpha);
    self.nbrNumeric = ko.observable(data.nbrNumeric);
    self.nbrSpecial = ko.observable(data.nbrSpecial);
    self.specialAllowed = ko.observableArray(data.specialAllowed);
    self.showPasswordRule1(rootParams.baseModel.format(self.passwordPolicynls.changePassword.messages.showPasswordRule1, {
      pwdMinLength: self.pwdMinLength(),
      pwdMaxLength: self.pwdMaxLength()
    }));
    self.showPasswordRule2(rootParams.baseModel.format(self.passwordPolicynls.changePassword.messages.showPasswordRule2, {
      nbrNumeric: self.nbrNumeric(),
      nbrUpperAlpha: self.nbrUpperAlpha(),
      nbrLowerAlpha: self.nbrLowerAlpha(),
      nbrSpecial: self.nbrSpecial()
    }));
    self.showPasswordRule3(rootParams.baseModel.format(self.passwordPolicynls.changePassword.messages.showPasswordRule3, {
      specialAllowed: self.specialAllowed().join("")
    }));


    self.passwordpolicy = function() {
      self.displaypasswordpolicy(true);
      $("#PasswordPolicy").show();
    };
    self.okClicked = function() {
      $("#PasswordPolicy").hide();
    };
    var getNewKoModel = function() {
      var KoModel = ResetPasswordModel.getNewModel();
      return KoModel;
    };
    self.payload = ko.observable(getNewKoModel());
    self.reset = function() {
      var validationTracker = document.getElementById("validationTracker");
      if (!rootParams.baseModel.showComponentValidationErrors(validationTracker)) {
        return;
      }
      if (!rootParams.baseModel.showComponentValidationErrors(self.pwdnullcheck())) {
        return;
      }
      if (!rootParams.baseModel.showComponentValidationErrors(self.cnfmPwdNullCheck())) {
        return;
      }
      self.payload().userId = self.response().userId;
      self.payload().newPassword = self.newPassword();
      self.payload().registrationId = self.response().registrationId;
      ResetPasswordModel.changePassword(ko.toJSON(self.payload())).done(function(data) {
        self.response(data);
        self.showConfirmation(true);
        self.enteredNewPassword(false);
      });
    };
    var showPassword = function() {
      $("#pwd").prop({
        type: "text"
      });
    };
    var hidePassword = function() {
      $("#pwd").prop({
        type: "password"
      });
    };
    self.showHide = function() {
      if (!self.pwshown()) {
        self.pwshown(true);
        showPassword();
      } else {
        self.pwshown(false);
        hidePassword();
      }
    };
    self.logIn = function() {
      if (Constants.authenticator === "OBDXAuthenticator") {
        rootParams.baseModel.switchPage({
          module: "login"
        }, false);
      } else {
        rootParams.baseModel.switchPage({}, true);
      }
    };
    self.cancel = function() {
      location.replace("index.html");
    };
    self.equalToPassword = {
      validate: function(value) {
        var compareTo = self.newPassword.peek();
        if (!value && !compareTo) {
          return true;
        } else if (value !== compareTo) {
          self.confirmPassword("");
          throw new Error(self.nls.forgotPassword.messages.passwordMatch);
        }
        return true;
      }
    };
    self.getTemplate = function() {
      return Constants.module === "WALLET" ? "walletTemplate" : "templateDefault";
    };
    self.showPasswordPolicy = function() {
      $("#PasswordPolicy").show();
    };
  };
});
