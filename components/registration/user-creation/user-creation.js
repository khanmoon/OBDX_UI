define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "framework/js/constants/constants",
  "ojL10n!resources/nls/registration-user-create",
  "ojL10n!resources/nls/change-password",
  "ojs/ojinputtext",
  "ojs/ojcheckboxset"
], function(oj, ko, $, UserCreationModel, Constants, resourceBundle, passwordPolicyResourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    ko.utils.extend(self, rootParams.data);
    self.response = ko.observable(self.response());
    self.agreement = ko.observable([""]);
    self.nls = resourceBundle;
    self.passwordPolicynls = passwordPolicyResourceBundle;
    self.clickedSignUp = ko.observable(true);
    self.showFinalMessage = ko.observable(false);
    self.pwdMinLength = ko.observable();
    self.pwdMaxLength = ko.observable();
    self.nbrUpperAlpha = ko.observable();
    self.nbrLowerAlpha = ko.observable();
    self.nbrNumeric = ko.observable();
    self.nbrSpecial = ko.observable();
    self.specialAllowed = ko.observableArray();
    self.displaypasswordpolicy = ko.observable();
    self.validationTracker = ko.observable();
    self.newPassword = ko.observable();
    self.confirmPassword = ko.observable();
    rootParams.baseModel.registerComponent("password-validation", "password-policy-validation");
    self.pwshown = ko.observable(false);
    self.usernameValidation = ko.observable();
    self.pwdValidation = ko.observable();
    self.cnfmPwdValidation = ko.observable();
    self.showPasswordRule1 = ko.observable();
    self.showPasswordRule2 = ko.observable();
    self.showPasswordRule3 = ko.observable();
    rootParams.dashboard.headerName(self.nls.registration.headerName);
    var data = self.response().passwordPolicyDTO;
    if (data) {
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
      var msg = "<html><ul><li>" + self.showPasswordRule1() + "<br><br></li><li>" + self.showPasswordRule2() + "<br><br></li><li>" + self.showPasswordRule3() + "</li></ul></html>";
      self.displaypasswordpolicy(msg);
    }

    var getNewKoModel = function() {
      var KoModel = UserCreationModel.getNewModel();
      return KoModel;
    };
    self.payload = ko.observable(getNewKoModel());
    $(document).on("focusout", function() {
      if (rootParams.baseModel.showComponentValidationErrors(self.usernameValidation())) {
        rootParams.baseModel.showComponentValidationErrors(self.pwdValidation());
      }
    });
    self.signUp = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(self.usernameValidation() && self.validationTracker())) {
        return;
      }
      if (!rootParams.baseModel.showComponentValidationErrors(self.pwdValidation())) {
        return;
      }
      if (!rootParams.baseModel.showComponentValidationErrors(self.cnfmPwdValidation())) {
        return;
      }
      self.payload().registrationId = self.response().registrationDTO.registrationId;
      self.payload().password = self.newPassword();
      if (self.agreement()[0]) {
        UserCreationModel.createLogIn(self.response().registrationDTO.registrationId, ko.toJSON(self.payload())).done(function(data) {
          self.response(data);
          self.clickedSignUp(false);
          self.showFinalMessage(true);
        });
      }
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
    self.cancel = function() {
      location.replace("index.html");
    };
    self.showPopup = function() {
      $("#popup").ojPopup("open", "#btnGo");
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
    self.equalToPassword = {
      validate: function(value) {
        var compareTo = self.newPassword.peek();
        if (!value && !compareTo) {
          return true;
        } else if (value !== compareTo) {
          self.confirmPassword("");
          throw new Error(self.nls.registration.logIn.passwordMatch);
        }
        return true;
      }
    };
  };
});
