define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",

  "ojs/ojinputtext",
  "ojs/ojknockout-validation",
  "ojs/ojknockout",
  "ojs/ojbutton"
], function(oj, ko, $, WalletModel) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.verificationCode = ko.observable();
    self.validationTracker = ko.observable();
    self.resendCode = ko.observable(0);
    self.resendButtonMsg = ko.observable(false);
    self.codeResendMsg = ko.observable(false);
    self.resendConfirmation = ko.observable(false);
    self.buttonEnable = ko.observable(true);
    var getNewKoModel = function() {
        var KoModel = WalletModel.getNewModel();
        return KoModel;
      },
      getResendKoModel = function() {
        var KoModel = WalletModel.getResendModel();
        return KoModel;
      };
    self.details = new getNewKoModel();
    self.resendDetails = new getResendKoModel();
    self.save = function() {
      self.buttonEnable(false);
      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        self.buttonEnable(true);

        return;
      }
      WalletModel.saveModel(self.verificationCode(), ko.toJSON(self.details)).done(function(data) {

        if (data.tokenValid) {
          rootParams.rootModel.getNextStage();
          self.buttonEnable(true);
        }
      });
    };
    self.resend = function() {
      self.resendCode(self.resendCode() + 1);
      if (self.resendCode() <= 3) {
        self.codeResendMsg(true);
        self.verificationCode("");
      } else {
        self.codeResendMsg(false);
        self.resendButtonMsg(true);
        return;
      }
      WalletModel.resendModel(ko.toJSON(self.resendDetails));
    };
    var password = true;
    self.togglePassword = function() {
      password = !password;
      var eye = $("#eyecon");
      eye.removeClass("icon-eye icon-eye-slash");
      if (password) {
        eye.addClass("icon-eye-slash");
        $("#otp-validation-mobile").prop({
          type: "password"
        });
      } else {
        eye.addClass("icon-eye");
        $("#otp-validation-mobile").prop({
          type: "text"
        });
      }
    };
  };
});
