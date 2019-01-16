define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "ojL10n!resources/nls/wallet-user-details",
  "./model",

  "ojs/ojknockout",
  "ojs/ojdatetimepicker",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojselectcombobox",
  "ojs/ojcheckboxset",
  "ojs/ojpopup",
  "ojs/ojknockout-validation"
], function(oj, ko, $, ResourceBundle, WalletModel) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.data);
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = ResourceBundle;
    self.gender = ko.observableArray();
    self.salutation = ko.observableArray();
    self.securityQuestions = ko.observableArray();
    self.selectedSalutation = ko.observable();
    self.selectedGender = ko.observable();
    self.selectedSecurityQuestion = ko.observable();
    self.userDefinedSalutation = ko.observable(false);
    self.confirmPassword = ko.observable();
    self.displaypasswordpolicy = ko.observable();
    self.agreement = ko.observable();
    self.dateString = ko.observable();
    self.dateValue1 = ko.observable();
    self.dateValue2 = ko.observable();
    self.msg = ko.observable();
    self.resendCode = ko.observable(0);
    self.resendButtonMsg = ko.observable(false);
    self.codeResendMsg = ko.observable(false);
    self.today = ko.observable(rootParams.baseModel.getDate());
    self.registrationId = ko.observable();
    self.emailverificationCode = ko.observable();
    self.pass = ko.observable();
    self.stageOne = ko.observable(true);
    self.stageVerify = ko.observable(false);
    self.stageTwo = ko.observable(false);
    self.stageThree = ko.observable(false);
    self.stageFour = ko.observable(false);
    self.emaillock = ko.observable(false);
    self.v_salutation = ko.observable();
    self.v_firstName = ko.observable();
    self.v_lastName = ko.observable();
    self.v_mobileNumber = ko.observable();
    self.v_emailId = ko.observable();
    self.pwdNoMatch = ko.observable(false);
    self.todayIsoDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(rootParams.baseModel.getDate()));
    self.milleniumStartIsoDate = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date(1900, 0, 1)));
    self.validationTracker = ko.observable();
    self.birthDate = ko.observable();
    self.newSalutation = ko.observable("");
    self.marketingConsent = ko.observable();
    self.showDropDown = ko.observable(false);
    self.showDropDown2 = ko.observable(false);
    var getNewKoModel = function() {
      var KoModel = WalletModel.getNewModel();
      KoModel.partyOnBoardingDTO.individualDTO.firstName = ko.observable(KoModel.partyOnBoardingDTO.individualDTO.firstName);
      KoModel.partyOnBoardingDTO.individualDTO.lastName = ko.observable(KoModel.partyOnBoardingDTO.individualDTO.lastName);
      KoModel.partyOnBoardingDTO.individualDTO.birthDate = ko.observable(self.birthDate());
      KoModel.walletDTO.emailId = ko.observable(KoModel.walletDTO.emailId);
      KoModel.credentialsDTO.username = KoModel.walletDTO.emailId;
      KoModel.credentialsDTO.password = ko.observable(KoModel.credentialsDTO.password);
      return KoModel;
    };
    self.details = new getNewKoModel();
    WalletModel.fetchGender().done(function(data) {
      self.showDropDown(false);
      self.gender(data.enumRepresentations[0].data);
      self.selectedGender(self.gender()[0].code);
      self.showDropDown(true);
    });
    WalletModel.fetchSalutation().done(function(data) {
      self.showDropDown2(false);
      self.salutation(data.enumRepresentations[0].data);
      self.selectedSalutation(self.salutation()[1].code);
      self.showDropDown2(true);
    });
    self.selectedSalutation.subscribe(function(newValue) {
      if (newValue === "145") {
        self.userDefinedSalutation(true);
      } else {
        self.userDefinedSalutation(false);
      }
    });
    WalletModel.fetchPasswordPolicy().done(function(data) {
      if (data) {
        self.pwdMinLength = ko.observable(data.passwordPolicyDTO.pwdMinLength);
        self.pwdMaxLength = ko.observable(data.passwordPolicyDTO.pwdMaxLength);
        self.nbrUpperAlpha = ko.observable(data.passwordPolicyDTO.nbrUpperAlpha);
        self.nbrLowerAlpha = ko.observable(data.passwordPolicyDTO.nbrLowerAlpha);
        self.nbrNumeric = ko.observable(data.passwordPolicyDTO.nbrNumeric);
        self.nbrSpecial = ko.observable(data.passwordPolicyDTO.nbrSpecial);
        self.specialAllowed = ko.observableArray(data.passwordPolicyDTO.specialAllowed);
        var msg1 = self.formatMessage(self.resource.messages.msg1, {
          pwdMinLength: self.pwdMinLength(),
          pwdMaxLength: self.pwdMaxLength()
        });
        var msg2 = self.formatMessage(self.resource.messages.msg2, {
          nbrNumeric: self.nbrNumeric(),
          nbrUpperAlpha: self.nbrUpperAlpha(),
          nbrLowerAlpha: self.nbrLowerAlpha(),
          nbrSpecial: self.nbrSpecial()
        });
        var msg3 = self.formatMessage(self.resource.messages.msg3, {
          specialAllowed: self.specialAllowed()
        });
        self.showPasswordRule1(msg1);
        self.showPasswordRule2(msg2);
        self.showPasswordRule3(msg3);
      }
    });
    self.showConfirmation = ko.observable(false);
    self.enterPassword = ko.observable(true);
    self.invalidTrackerOldPwd = ko.observable();
    self.invalidTrackerNewPwd = ko.observable();
    self.invalidTrackerCnfmPwd = ko.observable();
    self.pwdMinLength = ko.observable();
    self.pwdMaxLength = ko.observable();
    self.nbrUpperAlpha = ko.observable();
    self.nbrLowerAlpha = ko.observable();
    self.nbrNumeric = ko.observable();
    self.nbrSpecial = ko.observable();
    self.specialAllowed = ko.observableArray();
    self.displaypasswordpolicy = ko.observable(false);
    self.message = ko.observable();
    self.response = ko.observable();
    self.confirmPassword = ko.observable();
    self.newPassword = ko.observable();
    self.oldPassword = ko.observable();
    self.showPasswordRule1 = ko.observable();
    self.showPasswordRule2 = ko.observable();
    self.showPasswordRule3 = ko.observable();
    rootParams.baseModel.registerElement("modal-window");
    self.passwordpolicy = function() {
      self.displaypasswordpolicy(true);
      $("#PasswordPolicy").trigger("openModal");
    };
    self.equalToPassword = {
      validate: function(value) {
        var compareTo = self.details.credentialsDTO.password();
        if (!value && !compareTo) {
          self.pass(compareTo);
          return true;
        } else if (value !== compareTo) {
          self.confirmPassword("");
          throw new oj.ValidatorError("", oj.Translations.getTranslatedString("messages.wallet.passwordmismatch"));
        }
        return true;
      }
    };
    self.cancelOption = function() {
      window.location.assign("wallet-signup.html");
    };
    self.cancelReview = function() {
      self.stageOne(true);
      self.stageTwo(false);
      self.stageThree(false);
    };
    self.verifyEMail = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {

        return;
      }
      WalletModel.verifyEmail(ko.toJSON(self.details.walletDTO)).done(function() {
        self.stageOne(true);
        self.stageTwo(true);
        self.emaillock(true);
      });
    };
    self.confirmSignUp = function() {
      WalletModel.confirmSignUp(self.registrationId()).done(function() {

        self.stageTwo(false);
        self.stageThree(true);
        self.label(self.resource.wallet.origination.label.emailverification);
      });
    };
    self.authenticateEMail = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {

        return;
      }
      WalletModel.authenticateEMail(self.emailverificationCode(), ko.toJSON(self.details.walletDTO)).done(function() {
        self.stageOne(true);
        self.stageTwo(false);
        self.stageThree(true);
      });
    };
    self.authenticateSignUp = function() {

      self.stageOne(true);
      self.stageTwo(false);
      self.stageThree(true);
    };
    self.signUp = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {

        return;
      }
      if (self.confirmPassword() !== self.details.credentialsDTO.password()) {
        self.pwdNoMatch(true);
        self.showDialog("Error", self.resource.messages.passwordmismatch);
        self.confirmPassword("");
        self.details.credentialsDTO.password("");
        return;
      }
      if (self.marketingConsent()) {
        self.details.partyOnBoardingDTO.individualDTO.isMarketingConsent = self.marketingConsent()[0];
      }
      self.details.partyOnBoardingDTO.individualDTO.salutation = self.selectedSalutation();
      self.dateString(self.birthDate());
      self.dateString(self.dateString() + "000000");
      self.dateString(self.dateString().replace("-", ""));
      self.dateString(self.dateString().replace("-", ""));
      self.details.partyOnBoardingDTO.individualDTO.birthDate(self.dateString());
      self.details.partyOnBoardingDTO.individualDTO.gender = self.selectedGender();
      if (self.newSalutation() !== "") {
        self.details.partyOnBoardingDTO.individualDTO.salutation = self.newSalutation();
      }
      WalletModel.saveModel(ko.toJSON(self.details)).done(function(data) {

        self.registrationId(data.registrationId);
        WalletModel.claimMoney(data.walletId.value);
        self.isBackAllowed(false);
        self.getNextStage();
      });
    };
    self.resend = function() {
      self.resendCode(self.resendCode() + 1);
      if (self.resendCode() <= 3) {
        self.codeResendMsg(true);
        self.emailverificationCode("");
      } else {
        self.codeResendMsg(false);
        self.resendButtonMsg(true);
        return;
      }
      WalletModel.resend_verifyEmail(ko.toJSON(self.details.walletDTO));
    };
    var password = true;
    self.togglePassword = function() {
      password = !password;
      var eye = $("#eyecon");
      eye.removeClass("icon-eye icon-eye-slash");
      if (password) {
        eye.addClass("icon-eye-slash");
        $("#verificationcodemsg").prop({
          type: "password"
        });
      } else {
        eye.addClass("icon-eye");
        $("#verificationcodemsg").prop({
          type: "text"
        });
      }
    };
  };
});
