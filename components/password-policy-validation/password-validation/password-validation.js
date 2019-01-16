define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "framework/js/constants/constants",
  "ojL10n!resources/nls/password-validation",
  "ojs/ojinputtext",
  "ojs/ojdatetimepicker",
  "ojs/ojcheckboxset",
  "ojs/ojselectcombobox",
  "ojs/ojdatetimepicker",
  "ojs/ojvalidation",
  "ojs/ojknockout-validation",
  "ojs/ojpopup"
], function(oj, ko, $, PasswordValidationModel, Constants, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    rootParams.baseModel.registerElement("modal-window");
    rootParams.baseModel.registerElement("page-section");
    if (rootParams.dashboard.userData.userLoginFlowDone) {
      rootParams.dashboard.headerName(self.nls.passwordValidation.messages.heading);
    }
    var validationResonse = self.response();
    self.showConfirmation = ko.observable(false);
    self.showConfirmLoginFlow = ko.observable(false);
    self.enterPassword = ko.observable(true);
    self.invalidTrackerOldPwd = ko.observable();
    self.invalidTrackerNewPwd = ko.observable();
    self.invalidTrackerCnfmPwd = ko.observable();
    self.pwdMinLength = ko.observable();
    self.validationTracker = ko.observable();
    self.pwdMaxLength = ko.observable();
    self.nbrUpperAlpha = ko.observable();
    self.nbrLowerAlpha = ko.observable();
    self.nbrNumeric = ko.observable();
    self.nbrSpecial = ko.observable();
    self.specialAllowed = ko.observableArray();
    self.message = ko.observable();
    self.mandatorySpecialChar = ko.observable();
    self.specialCharlist = ko.observableArray();
    self.response = ko.observable();
    self.confirmPassword = ko.observable();
    self.showPasswordRule1 = ko.observable();
    self.showPasswordRule4 = ko.observable();
    self.showPasswordRule5 = ko.observable();
    self.showPasswordRule6 = ko.observable();
    self.showPasswordRule7 = ko.observable();
    self.mandatoryUpper = ko.observableArray();
    self.mandatoryLower = ko.observableArray();
    self.mandatoryNumber = ko.observableArray();
    self.showPasswordRule2 = ko.observable();
    self.showPasswordRule3 = ko.observable();
    self.showPasswordRule8 = ko.observable();
    self.passwordRule1 = ko.observable();
    self.roles = ko.observableArray();
    self.isnbrAllowed = ko.observable();
    self.isUpperAllowed = ko.observable();
    self.isLowerAllowed = ko.observable();
    self.isSpecialCharAllowed = ko.observable();
    self.forcepasswordValidation = ko.observable(true);
    self.charIncluded = ko.observableArray();
    self.nbrCharIncluded = ko.observableArray();
    self.nbrSuccessiveChars = ko.observable();
    self.personalDetExclude = ko.observableArray();
    self.pwdHistorySize = ko.observable();
    self.policy1violated = ko.observable(false);
    self.policy2violated = ko.observable(false);
    self.policy3violated = ko.observable(false);
    self.policy5violated = ko.observable(false);
    self.policy7violated = ko.observable(false);
    self.policy8violated = ko.observable(false);
    self.policy4violated = ko.observable(false);
    self.policy6violated = ko.observable(false);
    self.excludedDictWords = ko.observableArray();
    self.pwdValidated = ko.observable(false);
    self.closeDisclaimer = ko.observable(false);
    rootParams.dashboard.helpComponent.componentName("change-password");
    rootParams.dashboard.helpComponent.params({
      "passwordPolicy": {
        "rule1": self.showPasswordRule1,
        "rule2": self.showPasswordRule2,
        "rule3": self.showPasswordRule3,
        "rule4": self.showPasswordRule4,
        "rule5": self.showPasswordRule5,
        "rule6": self.showPasswordRule6,
        "rule7": self.showPasswordRule7,
        "rule8": self.showPasswordRule8
      }
    });
    self.pwdPolicyChecked = ko.observable(false);
    if (rootParams.rootModel.userData && rootParams.rootModel.userData.userProfile) {
      ko.utils.arrayForEach(rootParams.rootModel.userData.userProfile.roles, function(item) {
        self.roles.push(item.toLowerCase());
      });
      self.forcepasswordValidation(false);
    }
    self.passwordpolicy = function() {
      $("#PasswordPolicy").trigger("openModal");
    };
    var data = validationResonse.passwordPolicyDTO;
    if (data) {
      self.pwdMinLength = ko.observable(data.pwdMinLength);
      self.pwdMaxLength = ko.observable(data.pwdMaxLength);
      self.nbrUpperAlpha = ko.observable(data.nbrUpperAlpha);
      self.nbrLowerAlpha = ko.observable(data.nbrLowerAlpha);
      self.nbrNumeric = ko.observable(data.nbrNumeric);
      self.nbrSpecial = ko.observable(data.nbrSpecial);
      self.isnbrAllowed = ko.observable(data.numericAllowed);
      self.isUpperAllowed = ko.observable(data.upperAlphaAllowed);
      self.isLowerAllowed = ko.observable(data.lowerAlphaAllowed);
      self.isSpecialCharAllowed = ko.observable(data.specialCharsAllowed);
      self.specialAllowed = ko.observableArray(data.specialCharAllowed);
      self.successiveChars = ko.observable(data.successiveAllowed);
      self.nbrRepeativeChars = ko.observable(data.nbrRepeatChars);
      self.nbrSuccessiveChars = ko.observable(data.nbrSuccessiveChars);
      self.personalDetExclude = ko.observable(data.personalDetExclude);
      self.pwdHistorySize = ko.observable(data.pwdHistorySize);
      self.excludedDictWords = ko.observable(data.excludedDictWords);
      self.showPasswordRule1(rootParams.baseModel.format(self.nls.passwordValidation.messages.showPasswordRule1, {
        pwdMinLength: self.pwdMinLength(),
        pwdMaxLength: self.pwdMaxLength()
      }));

      if (self.isUpperAllowed()) {
        if (self.nbrUpperAlpha() !== null && self.nbrUpperAlpha() !== 0) {
          self.mandatoryUpper().push(rootParams.baseModel.format(self.nls.passwordValidation.messages.mandatoryUpper, {
            nbrUpper: self.nbrUpperAlpha()
          }));
        }
        self.showPasswordRule2(rootParams.baseModel.format(self.nls.passwordValidation.messages.showPasswordRule2, {
          mandatoryUpper: self.mandatoryUpper()
        }));
      } else {
        self.showPasswordRule2(rootParams.baseModel.format(self.nls.passwordValidation.messages.showPasswordRule2, {
          mandatoryUpper: self.nls.passwordValidation.messages.notAllowed
        }));
      }
      if (self.isLowerAllowed()) {
        if (self.nbrLowerAlpha() !== null && self.nbrLowerAlpha() !== 0) {
          self.mandatoryLower(rootParams.baseModel.format(self.nls.passwordValidation.messages.mandatoryLower, {
            nbrLower: self.nbrLowerAlpha()
          }));
        }
        self.showPasswordRule3(rootParams.baseModel.format(self.nls.passwordValidation.messages.showPasswordRule3, {
          mandatoryLower: self.mandatoryLower()
        }));
      } else {
        self.showPasswordRule3(rootParams.baseModel.format(self.nls.passwordValidation.messages.showPasswordRule3, {
          mandatoryLower: self.nls.passwordValidation.messages.notAllowed
        }));
      }
      if (self.isnbrAllowed()) {
        if (self.nbrNumeric() !== null && self.nbrNumeric() !== 0) {
          self.mandatoryNumber(rootParams.baseModel.format(self.nls.passwordValidation.messages.mandatoryNumber, {
            nbrNumber: self.nbrNumeric()
          }));
        }
        self.showPasswordRule5(rootParams.baseModel.format(self.nls.passwordValidation.messages.showPasswordRule5, {
          mandatoryNumber: self.mandatoryNumber()
        }));
      } else {
        self.showPasswordRule5(rootParams.baseModel.format(self.nls.passwordValidation.messages.showPasswordRule5, {
          mandatoryNumber: self.nls.passwordValidation.messages.notAllowed
        }));
      }
      if (self.isSpecialCharAllowed()) {
        if (self.nbrSpecial() !== null && self.nbrSpecial() !== 0) {
          self.mandatorySpecialChar(rootParams.baseModel.format(self.nls.passwordValidation.messages.mandatorySpecialChar, {
            nbrSpecial: self.nbrSpecial()
          }));
          self.specialCharlist(rootParams.baseModel.format(self.nls.passwordValidation.messages.specialCharlist, {
            specialCharList: self.specialAllowed()
          }));
          self.showPasswordRule7(rootParams.baseModel.format(self.nls.passwordValidation.messages.showPasswordRule7, {
            mandatorySpecialChar: self.mandatorySpecialChar(),
            specialCharlist: self.specialCharlist()
          }));
        }
      } else {
        self.showPasswordRule7(rootParams.baseModel.format(self.nls.passwordValidation.messages.showPasswordRule7, {
          mandatorySpecialChar: self.nls.passwordValidation.messages.notAllowed
        }));
      }
      if (self.nbrSuccessiveChars() !== undefined) {
        self.showPasswordRule4(rootParams.baseModel.format(self.nls.passwordValidation.messages.showPasswordRule4, {
          nbrConsecutive: self.nbrSuccessiveChars()
        }));
      }
      if (self.nbrRepeativeChars() !== undefined) {
        self.showPasswordRule8(rootParams.baseModel.format(self.nls.passwordValidation.messages.showPasswordRule8, {
          nbrIdentical: self.nbrRepeativeChars()
        }));
      }

      self.showPasswordRule6(self.nls.passwordValidation.messages.showPasswordRule6);
      rootParams.dashboard.helpComponent.params({
        "passwordPolicy": {
          "rule1": self.showPasswordRule1,
          "rule2": self.showPasswordRule2,
          "rule3": self.showPasswordRule3,
          "rule4": self.showPasswordRule4,
          "rule5": self.showPasswordRule5,
          "rule6": self.showPasswordRule6,
          "rule7": self.showPasswordRule7,
          "rule8": self.showPasswordRule8
        }
      });
    }
    var getNewKoModel = function() {
      var KoModel = PasswordValidationModel.getNewModel();
      return KoModel;
    };
    self.payload = ko.observable(getNewKoModel());
    self.nullCheck = function() {
      if (rootParams.baseModel.showComponentValidationErrors(self.invalidTrackerOldPwd())) {
        rootParams.baseModel.showComponentValidationErrors(self.invalidTrackerNewPwd());
      }
    };
    var newPasswordSubscription = self.newPassword.subscribe(function() {
      if (!rootParams.baseModel.showComponentValidationErrors(self.invalidTrackerOldPwd())) {
        return;
      }
      if (!rootParams.baseModel.showComponentValidationErrors(self.invalidTrackerNewPwd())) {
        return;
      }
      self.specialCharPresent = ko.observableArray();
      self.policy1violated(false);
      self.policy2violated(false);
      self.policy3violated(false);
      self.policy5violated(false);
      self.policy7violated(false);
      self.policy4violated(false);
      self.policy6violated(false);
      self.policy8violated(false);

      if (self.newPassword() === null || self.newPassword().length < self.pwdMinLength() || self.newPassword().length > self.pwdMaxLength()) {
        self.policy1violated(true);
      }


      self.checkAlphaCount = function() {
        var uppercount = 0,
          lowercount = 0,
          specialcharcount = 0,
          numbercount = 0,
          i;
        for (i = 0; i < self.newPassword().length; i++) {
          if (!isNaN(self.newPassword().charAt(i))) {
            numbercount++;
          } else if (/^[a-zA-Z0-9- ]*$/.test(self.newPassword().charAt(i)) === false) {
            specialcharcount++;
            self.specialCharPresent.push(self.newPassword().charAt(i));
            for (var j = 0; j < self.specialCharPresent().length; j++) {
              if (!(self.specialAllowed().filter(function(e) {
                  return e === self.specialCharPresent()[j];
                }).length > 0)) {
                self.policy7violated(true);
              }
            }
          } else if (self.newPassword().charAt(i) === self.newPassword().charAt(i).toUpperCase())
            uppercount++;
          else if (self.newPassword().charAt(i) === self.newPassword().charAt(i).toLowerCase())
            lowercount++;
        }
        if ((!self.isUpperAllowed() && uppercount !== 0) || uppercount < self.nbrUpperAlpha()) {
          self.policy2violated(true);
        }
        if ((!self.isLowerAllowed() && lowercount !== 0) || lowercount < self.nbrLowerAlpha()) {
          self.policy3violated(true);
        }
        if ((!self.isnbrAllowed() && numbercount !== 0) || numbercount < self.nbrNumeric()) {
          self.policy5violated(true);
        }
        if ((!self.isSpecialCharAllowed() && specialcharcount !== 0) || specialcharcount < self.nbrSpecial()) {
          self.policy7violated(true);
        }
      };
      self.checkAlphaCount();


      self.checkSuccessiveChars = function() {
        var prevChar, currChar;
        var count = 0;
        var repeat = 0;
        for (var i = 1; i < self.newPassword().length; i++) {
          prevChar = self.newPassword().charCodeAt(i - 1);
          currChar = self.newPassword().charCodeAt(i);

          if (currChar - prevChar === 1) {
            count = count + 1;
          } else {
            count = 0;
          }
          if (currChar - prevChar === 0) {
            repeat = repeat + 1;
          } else {
            repeat = 0;
          }
          if (count === self.nbrSuccessiveChars()) {
            self.policy4violated(true);
          }
          if (count === self.nbrRepeativeChars()) {
            self.policy8violated(true);
          }
        }
      };
      self.checkSuccessiveChars();

      ko.utils.arrayForEach(self.excludedDictWords(), function(item) {
        if (self.newPassword() === item)
          self.policy6violated(true);
      });
      self.pwdPolicyChecked(true);
      if (self.policy1violated() || self.policy2violated() || self.policy3violated() || self.policy5violated() || self.policy7violated() || self.policy8violated() || self.policy4violated() || self.policy6violated()) {
        return;
      }
      self.pwdValidated(true);
    });
    self.passwordValidation = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        self.pwdValidated(false);
        return;
      }
      if (rootParams.baseModel.small() && !self.pwdValidated()) {
        $("#passwordPolicy").ojPopup("open", "#passwordPolicy");
        return;
      }
      self.payload().changedPassword = self.newPassword();
      self.payload().oldPassword = self.oldPassword();
      PasswordValidationModel.passwordValidation(ko.toJSON(self.payload())).done(function(data) {
        self.response(data);
        if (rootParams.dashboard.userData.firstLoginFlowDone === undefined || rootParams.dashboard.userData.firstLoginFlowDone) {
          self.showConfirmation(true);
        } else {
          self.loadNextComponent();
          self.showConfirmLoginFlow(true);
        }
        self.enterPassword(false);
      }).fail(function() {
        self.confirmPassword("");
        self.oldPassword("");
        self.newPassword("");
      });
    };
    self.doneClicked = function() {
      PasswordValidationModel.logOut();
    };
    self.okClicked = function() {
      $("#PasswordPolicy").trigger("closeModal");
    };
    self.equalToPassword = {
      validate: function(value) {
        var compareTo = self.newPassword();
        if (!value && !compareTo) {
          return true;
        } else if (value !== compareTo) {
          self.confirmPassword("");
          throw new Error(self.nls.passwordValidation.messages.passwordMatch);
        }
        return true;
      }
    };
    self.notEqualToOldPassword = {
      validate: function(value) {
        var oldPwd = self.oldPassword();
        if (value === oldPwd) {
          throw new Error(self.nls.passwordValidation.messages.passwordMissMatch);
        } else if (value !== oldPwd) {
          return true;
        }
        return true;
      }
    };
    self.showConfirmLoginFlow(false);
    self.closeSPopup = function() {
      self.closeDisclaimer(true);
      $("#disclaimer-container").fadeOut("slow");
    };
    self.dispose = function() {
      newPasswordSubscription.dispose();
    };
  };
});
