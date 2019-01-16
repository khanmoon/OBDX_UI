define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "framework/js/constants/constants",
  "ojL10n!resources/nls/force-change-password",
  "platform",
  "ojs/ojinputtext",
  "ojs/ojcheckboxset",
  "ojs/ojselectcombobox",
  "ojs/ojdatetimepicker",
  "ojs/ojvalidation",
  "ojs/ojknockout-validation",
  "ojs/ojvalidationgroup",
  "ojs/ojpopup"
], function(oj, ko, $, ChangePasswordModel, Constants, resourceBundle, Platform) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    rootParams.baseModel.registerElement("modal-window");
    rootParams.baseModel.registerElement("page-section");
    self.showConfirmation = ko.observable(false);
    self.showConfirmLoginFlow = ko.observable(false);
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
    self.message = ko.observable();
    self.response = ko.observable();
    self.confirmPassword = ko.observable();
    self.newPassword = ko.observable();
    self.oldPassword = ko.observable();
    self.mandatoryUpper = ko.observableArray();
    self.mandatoryLower = ko.observableArray();
    self.mandatoryNumber = ko.observableArray();
    self.mandatorySpecialChar = ko.observableArray();
    self.specialCharlist = ko.observableArray();
    self.showPasswordRule1 = ko.observable();
    self.showPasswordRule2 = ko.observable();
    self.showPasswordRule3 = ko.observable();
    self.showPasswordRule4 = ko.observable();
    self.showPasswordRule8 = ko.observable();
    self.showPasswordRule6 = ko.observable();
    self.showPasswordRule7 = ko.observable();
    self.showPasswordRule5 = ko.observable();
    self.notNumber = ko.observable();
    self.passwordRule1 = ko.observable();
    self.roles = ko.observableArray();
    self.isnbrAllowed = ko.observable();
    self.isUpperAllowed = ko.observable();
    self.isLowerAllowed = ko.observable();
    self.isSpecialCharAllowed = ko.observable();
    self.forceChangePassword = ko.observable(true);
    self.charIncluded = ko.observableArray();
    self.nbrCharIncluded = ko.observableArray();
    self.nbrSuccessiveChars = ko.observable();
    self.nbrRepeativeChars = ko.observable();
    self.personalDetExclude = ko.observableArray();
    self.pwdHistorySize = ko.observable();
    self.policy1violated = ko.observable(false);
    self.policy5violated = ko.observable(false);
    self.policy3violated = ko.observable(false);
    self.policy2violated = ko.observable();
    self.policy7violated = ko.observable(false);
    self.policy4violated = ko.observable(false);
    self.policy8violated = ko.observable(false);
    self.policy6violated = ko.observable(false);
    self.excludedDictWords = ko.observableArray();
    self.pwdValidated = ko.observable(false);
    self.showLoginOptions = ko.observable(false);
    self.setNewPass = ko.observable(true);
    self.userName = ko.observable();
    self.afterRender = function(genericViewModel) {
      if (genericViewModel.queryMap.username) {
        self.userName(genericViewModel.queryMap.username);
      }
      var searchParameters = {
        "userId": self.userName()
      };
      ChangePasswordModel.fetchPasswordPolicy(searchParameters).done(function(data) {
        if (data) {
          self.pwdMinLength = ko.observable(data.passwordPolicyDTO.pwdMinLength);
          self.pwdMaxLength = ko.observable(data.passwordPolicyDTO.pwdMaxLength);
          self.nbrUpperAlpha = ko.observable(data.passwordPolicyDTO.nbrUpperAlpha);
          self.nbrLowerAlpha = ko.observable(data.passwordPolicyDTO.nbrLowerAlpha);
          self.nbrNumeric = ko.observable(data.passwordPolicyDTO.nbrNumeric);
          self.nbrSpecial = ko.observable(data.passwordPolicyDTO.nbrSpecial);
          self.isnbrAllowed = ko.observable(data.passwordPolicyDTO.numericAllowed);
          self.isUpperAllowed = ko.observable(data.passwordPolicyDTO.upperAlphaAllowed);
          self.isLowerAllowed = ko.observable(data.passwordPolicyDTO.lowerAlphaAllowed);
          self.isSpecialCharAllowed = ko.observable(data.passwordPolicyDTO.specialCharsAllowed);
          self.specialAllowed = ko.observableArray(data.passwordPolicyDTO.specialCharAllowed);
          self.successiveChars = ko.observable(data.passwordPolicyDTO.successiveAllowed);
          self.nbrSuccessiveChars = ko.observable(data.passwordPolicyDTO.nbrSuccessiveChars);
          self.nbrRepeativeChars = ko.observable(data.passwordPolicyDTO.nbrRepeatChars);
          self.personalDetExclude = ko.observable(data.passwordPolicyDTO.personalDetExclude);
          self.pwdHistorySize = ko.observable(data.passwordPolicyDTO.pwdHistorySize);
          self.excludedDictWords = ko.observable(data.passwordPolicyDTO.excludedDictWords);
          self.showPasswordRule1(rootParams.baseModel.format(self.nls.changePassword.showPasswordRule1, {
            pwdMinLength: self.pwdMinLength(),
            pwdMaxLength: self.pwdMaxLength()
          }));
          if (self.isUpperAllowed()) {
            if (self.nbrUpperAlpha() !== null && self.nbrUpperAlpha() !== 0) {
              self.mandatoryUpper().push(rootParams.baseModel.format(self.nls.changePassword.mandatoryUpper, {
                nbrUpper: self.nbrUpperAlpha()
              }));
            }
            self.showPasswordRule2(rootParams.baseModel.format(self.nls.changePassword.showPasswordRule2, {
              mandatoryUpper: self.mandatoryUpper()
            }));
          } else {
            self.showPasswordRule2(rootParams.baseModel.format(self.nls.changePassword.showPasswordRule2, {
              mandatoryUpper: self.nls.changePassword.notAllowed
            }));
          }
          if (self.isLowerAllowed()) {
            if (self.nbrLowerAlpha() !== null && self.nbrLowerAlpha() !== 0) {
              self.mandatoryLower(rootParams.baseModel.format(self.nls.changePassword.mandatoryLower, {
                nbrLower: self.nbrLowerAlpha()
              }));
            }
            self.showPasswordRule3(rootParams.baseModel.format(self.nls.changePassword.showPasswordRule3, {
              mandatoryLower: self.mandatoryLower()
            }));
          } else {
            self.showPasswordRule3(rootParams.baseModel.format(self.nls.changePassword.showPasswordRule3, {
              mandatoryLower: self.nls.changePassword.notAllowed
            }));
          }
          if (self.isnbrAllowed()) {
            if (self.nbrNumeric() !== null && self.nbrNumeric() !== 0) {
              self.mandatoryNumber(rootParams.baseModel.format(self.nls.changePassword.mandatoryNumber, {
                nbrNumber: self.nbrNumeric()
              }));
            }
            self.showPasswordRule5(rootParams.baseModel.format(self.nls.changePassword.showPasswordRule5, {
              mandatoryNumber: self.mandatoryNumber()
            }));
          } else {
            self.showPasswordRule5(rootParams.baseModel.format(self.nls.changePassword.showPasswordRule5, {
              mandatoryNumber: self.nls.changePassword.notAllowed
            }));
          }
          if (self.isSpecialCharAllowed()) {
            if (self.nbrSpecial() !== null && self.nbrSpecial() !== 0) {
              self.mandatorySpecialChar(rootParams.baseModel.format(self.nls.changePassword.mandatorySpecialChar, {
                nbrSpecial: self.nbrSpecial()
              }));
            }
            self.specialCharlist(rootParams.baseModel.format(self.nls.changePassword.specialCharlist, {
              specialCharList: self.specialAllowed()
            }));
            self.showPasswordRule7(rootParams.baseModel.format(self.nls.changePassword.showPasswordRule7, {
              mandatorySpecialChar: self.mandatorySpecialChar(),
              specialCharlist: self.specialCharlist()
            }));
          } else {
            self.showPasswordRule7(rootParams.baseModel.format(self.nls.changePassword.showPasswordRule7, {
              mandatorySpecialChar: self.nls.changePassword.notAllowed,
              specialCharlist: self.specialCharlist()

            }));
          }
          if (self.nbrSuccessiveChars() !== undefined) {
            self.showPasswordRule4(rootParams.baseModel.format(self.nls.changePassword.showPasswordRule4, {
              nbrConsecutive: self.nbrSuccessiveChars()
            }));
          }
          if (self.nbrRepeativeChars() !== undefined) {
            self.showPasswordRule8(rootParams.baseModel.format(self.nls.changePassword.showPasswordRule8, {
              nbrIdentical: self.nbrRepeativeChars()
            }));
          }
          self.showPasswordRule6(self.nls.changePassword.showPasswordRule6);
          rootParams.dashboard.helpComponent.params({
            "passwordPolicy": {
              "rule1": self.showPasswordRule1,
              "rule2": self.showPasswordRule2,
              "rule3": self.showPasswordRule3,
              "rule5": self.showPasswordRule5,
              "rule7": self.showPasswordRule7,
              "rule4": self.showPasswordRule4,
              "rule8": self.showPasswordRule8,
              "rule6": self.showPasswordRule6
            }
          });
        }
      });
    };
    rootParams.baseModel.registerComponent("login-options", "login");
    self.closeDisclaimer = ko.observable(false);
    rootParams.dashboard.helpComponent.componentName("change-password");
    rootParams.dashboard.helpComponent.params({
      "passwordPolicy": {
        "rule1": self.showPasswordRule1,
        "rule2": self.showPasswordRule2,
        "rule3": self.showPasswordRule3,
        "rule5": self.showPasswordRule5,
        "rule7": self.showPasswordRule7,
        "rule4": self.showPasswordRule4,
        "rule8": self.showPasswordRule8,
        "rule6": self.showPasswordRule6
      }
    });
    self.pwdPolicyChecked = ko.observable(false);
    if (rootParams.dashboard.userData && rootParams.dashboard.userData.userProfile) {
      ko.utils.arrayForEach(rootParams.dashboard.userData.userProfile.roles, function(item) {
        self.roles.push(item.toLowerCase());
      });
      self.forceChangePassword(false);
    }
    self.passwordpolicy = function() {
      $("#PasswordPolicy").trigger("openModal");
    };

    var getNewKoModel = function() {
      var KoModel = ChangePasswordModel.getNewModel();
      return KoModel;
    };
    self.payload = ko.observable(getNewKoModel());
    self.nullCheck = function() {
      if (rootParams.baseModel.showComponentValidationErrors(self.invalidTrackerOldPwd())) {
        rootParams.baseModel.showComponentValidationErrors(self.invalidTrackerNewPwd());
      }
    };
    self.newPassword.subscribe(function() {
      if (!rootParams.baseModel.showComponentValidationErrors(self.invalidTrackerOldPwd())) {
        return;
      }
      if (!rootParams.baseModel.showComponentValidationErrors(self.invalidTrackerNewPwd())) {
        return;
      }
      self.setNewPass(false);
      self.confirmPassword("");
      self.setNewPass(true);
      self.specialCharPresent = ko.observableArray();
      self.policy1violated(false);
      self.policy2violated(false);
      self.policy3violated(false);
      self.policy5violated(false);
      self.policy7violated(false);
      self.policy4violated(false);
      self.policy8violated(false);
      self.policy6violated(false);


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
        var i;
        for (i = 1; i < self.newPassword().length; i++) {
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

      if (self.excludedDictWords()) {
        ko.utils.arrayForEach(self.excludedDictWords(), function(item) {
          if (self.newPassword() === item)
            self.policy6violated(true);
        });
      }
      self.pwdPolicyChecked(true);
      if (self.policy1violated() || self.policy2violated() || self.policy3violated() || self.policy5violated() || self.policy7violated() || self.policy8violated() || self.policy4violated() || self.policy6violated()) {
        return;
      }
      self.pwdValidated(true);
    });


    self.changePassword = function() {
      var validationTracker = document.getElementById("validationTracker");
      if (!rootParams.baseModel.showComponentValidationErrors(validationTracker)) {
        self.pwdValidated(false);
        return;
      }
      if (rootParams.baseModel.small() && !self.pwdValidated()) {
        $("#passwordPolicy").trigger("openFloatingPanel");
        return;
      }
      self.payload().newPassword = self.newPassword();
      self.payload().oldPassword = self.oldPassword();
      self.payload().userId = self.userName();
      ChangePasswordModel.changePassword(ko.toJSON(self.payload())).done(function(data) {
        self.response(data);
        self.showConfirmation(true);
        self.enterPassword(false);
      }).fail(function() {
        self.confirmPassword("");
        self.oldPassword("");
        self.newPassword("");
      });
    };
    self.doneClicked = function() {
      if (Constants.authenticator === "OBDXAuthenticator") {
        ChangePasswordModel.logOutDBAuth();
      } else {
        ChangePasswordModel.logOut(function() {
          Platform.getInstance().then(function(platform) {
            platform("logOut");
          });
        });
      }
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
          throw new Error(self.nls.changePassword.passwordMatch);
        }
        return true;
      }
    };
    self.notEqualToOldPassword = {
      validate: function(value) {
        var oldPwd = self.oldPassword();
        if (value === oldPwd) {
          throw new Error(self.nls.changePassword.passwordMissMatch);
        } else if (value !== oldPwd) {
          return true;
        }
        return true;
      }
    };
    self.notEqualToNewPassword = {
      validate: function(value) {
        var newPwd = self.newPassword();
        if (newPwd && value === newPwd) {
          throw new Error(self.nls.changePassword.passwordMissMatch);
        }
        return true;
      }
    };
    self.showConfirmLoginFlow(false);
    self.closeSPopup = function() {
      self.closeDisclaimer(true);
      $("#disclaimer-container").fadeOut("slow");
    };
    self.hidePopup = function() {
      $("#disclaimer").fadeOut("slow");
    };
  };
});
