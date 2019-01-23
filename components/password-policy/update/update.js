define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/password-policy",
    "ojs/ojselectcombobox",
    "ojs/ojinputtext",
    "ojs/ojcheckboxset",
    "ojs/ojvalidationgroup",
    "ojs/ojknockout-validation"
], function(oj, ko, $, PasswordPolicyEditModel, locale) {
    "use strict";
    return function(params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        self.nls = locale;
        params.baseModel.registerElement("page-section");
        self.validationTracker = ko.observable();
        self.isUpperCaseAllowed = ko.observable();
        self.specialChars = ko.observableArray([]);
        self.isUpperCaseMandatory = ko.observable();
        self.isLowerCaseMandatory = ko.observable();
        self.isSpecialCharMandatory = ko.observable();
        self.isNumericMandatory = ko.observable();
        self.numberUpperCaseAllowed = ko.observable(0);
        self.checkValues = ko.observableArray();
        self.upperCaseAllowed = ko.observableArray();
        self.upperCaseAllowed.push(self.isUpperAlphaAllowed().toString());
        self.lowerCaseAllowed = ko.observableArray();
        self.lowerCaseAllowed.push(self.isLowerAlphaAllowed().toString());
        self.specialCharsAllowed = ko.observableArray();
        self.specialCharsAllowed.push(self.isSpecialCharAllowed().toString());
        self.numericAllowed = ko.observableArray();
        self.numericAllowed.push(self.isNumericAllowed().toString());
        params.dashboard.headerName(self.nls.pageTitle.header);
        self.personalDetExclusionPayload = ko.observableArray([]);
        self.pwdExpiryPeriod = ko.observable(self.pwdExpiryPeriod());
        self.pwdExpiryWarningPeriod = ko.observable(self.pwdExpiryWarningPeriod());
        self.maxLength = ko.observable(self.maxLength());
        self.minLength = ko.observable(self.minLength());
        self.lowerAlphaMandatory = self.lowerAlphaMandatory ? self.lowerAlphaMandatory : ko.observableArray([]);
        self.specialCharMandatory = self.specialCharMandatory ? self.specialCharMandatory : ko.observableArray([]);
        self.numberMandatory = self.numberMandatory ? self.numberMandatory : ko.observableArray([]);
        params.baseModel.registerElement("action-header");
        params.baseModel.registerComponent("review-update", "password-policy");
        self.previousLength = 0;
        var specialCharAllowedSubscription = self.specialCharAllowed.subscribe(function(array) {
            var len = array.length;
            if (len < self.previousLength) {
                self.previousLength = len;

            } else {
                var a = array[len - 1];
                if (a.length > 1) {
                    self.specialCharAllowed().pop(a);
                    params.baseModel.showMessages(null, [self.nls.message.invalidEntry], "INFO");
                    return;
                }
                self.previousLength = self.previousLength + 1;
            }
        });
        var restrictedPasswordsSubscription = self.restrictedPwdDetails.subscribe(function(value) {
            for (var i = 0; i < value.length; i++) {
                if (value[i].length > 20) {
                    self.restrictedPwdDetails().pop(value[i]);
                    params.baseModel.showMessages(null, [self.nls.message.invalidTextLength], "INFO");
                }
            }
        });
        var validateExclusionPwdSubscription = self.personalDetExclusion.subscribe(function(value) {
            for (var i = 0; i < value.length; i++) {
                if (value[i] !== "User Id" && value[i] !== "Party Id" && value[i] !== "First Name" && value[i] !== "Last Name" && value[i] !== "Date of Birth" && value[i] !== "userid" && value[i] !== "partyid" && value[i] !== "firstname" && value[i] !== "lastname" && value[i] !== "dob") {
                    self.personalDetExclusion().pop(value[i]);
                    params.baseModel.showMessages(null, [self.nls.message.invalidListEntry], "INFO");
                }
            }
        });
        self.exclusionDetailList = ko.observableArray([{
                "id": "dob",
                "name": self.nls.exclusionDetail.dob
            },
            {
                "id": "firstname",
                "name": self.nls.exclusionDetail.firstname
            },
            {
                "id": "lastname",
                "name": self.nls.exclusionDetail.lastname
            },
            {
                "id": "userid",
                "name": self.nls.exclusionDetail.userid
            },
            {
                "id": "partyid",
                "name": self.nls.exclusionDetail.partyid
            }
        ]);
        var getNewKoModel = function() {
            var KoModel = ko.mapping.fromJS(PasswordPolicyEditModel.getNewModel());
            return KoModel;
        };
        self.checkboxValues = getNewKoModel().checkboxValues;
        self.payload = getNewKoModel().policyUpdatePayload;
        self.upperCaseAllowedChangeHandler = function(event) {
            if (event.detail.value) {
                if (event.detail.value.length !== 0) {
                    self.isUpperCaseAllowed($.parseJSON(event.detail.value));
                    params.rootModel.isUpperAlphaAllowed($.parseJSON(event.detail.value));
                } else {
                    self.isUpperCaseMandatory(false);
                    self.isUpperCaseAllowed(false);
                    self.nbrUpperDisabled(false);
                    self.nbrUpperAlpha("");
                    params.rootModel.upperAlphaMandatory([]);
                    params.rootModel.isUpperAlphaAllowed(false);
                }
            }
        };
        self.upperCaseMandatoryChangeHandler = function(event) {
            if (event.detail.value) {
                if (event.detail.value.length !== 0) {
                    self.nbrUpperDisabled(true);
                    self.nbrUpperAlpha("");
                    self.isUpperCaseMandatory(true);
                    params.rootModel.isUpperAlphaAllowed(true);
                } else {
                    self.nbrUpperAlpha("");
                    self.isUpperCaseMandatory(false);
                    self.nbrUpperDisabled(false);
                }
            }
        };
        self.lowerCaseAllowedChangeHandler = function(event) {
            if (event.detail.value) {
                if (event.detail.value.length !== 0) {
                    self.isLowerAlphaAllowed(event.detail.value);
                } else {
                    self.nbrLowerDisabled(false);
                    self.isLowerCaseMandatory(false);
                    self.nbrLowerAlpha("");
                    params.rootModel.lowerAlphaMandatory([]);
                    params.rootModel.isLowerAlphaAllowed(false);
                }
            }
        };
        self.lowerCaseMandatoryChangeHandler = function(event) {
            if (event.detail.value) {
                if (event.detail.value.length !== 0) {
                    self.nbrLowerDisabled(true);
                    self.isLowerCaseMandatory(true);
                    self.nbrLowerAlpha("");
                    self.lowerAlphaMandatory.push(self.checkboxValues.lowerCaseMandatory());
                } else {
                    self.nbrLowerAlpha("");
                    self.nbrLowerDisabled(false);
                    self.isLowerCaseMandatory(false);
                    self.lowerAlphaMandatory.remove(self.checkboxValues.lowerCaseMandatory());
                }
            }
        };
        self.specialCharAllowedChangeHandler = function(event) {
            if (event.detail.value) {
                if (event.detail.value.length !== 0) {
                    self.isSpecialCharAllowed($.parseJSON(event.detail.value));
                } else {
                    self.specialCharAllowed.removeAll();
                    self.nbrSpecialCharDisabled(false);
                    self.isSpecialCharMandatory(false);
                    self.nbrSpecialChar("");
                    params.rootModel.specialCharMandatory([]);
                    params.rootModel.isSpecialCharAllowed(false);
                }
            }
        };
        self.specialCharMandatoryChangeHandler = function(event) {
            if (event.detail.value) {
                if (event.detail.value.length !== 0) {
                    self.nbrSpecialCharDisabled(true);
                    self.isSpecialCharMandatory(true);
                    self.nbrSpecialChar("");
                    self.specialCharMandatory.push(self.checkboxValues.specialCharMandatory());
                } else {
                    self.nbrSpecialChar("");
                    self.nbrSpecialCharDisabled(false);
                    self.isSpecialCharMandatory(false);
                    self.specialCharMandatory.remove(self.checkboxValues.specialCharMandatory());
                }
            }
        };
        self.numberAllowedChangeHandler = function(event) {
            if (event.detail.value) {
                if (event.detail.value.length !== 0) {
                    self.isNumericAllowed($.parseJSON(event.detail.value));
                } else {
                    self.nbrNumericDisabled(false);
                    self.isNumericMandatory(false);
                    self.nbrNumericAlpha("");
                    params.rootModel.numberMandatory([]);
                    params.rootModel.isNumericAllowed(false);
                }
            }
        };
        self.passwordExpiryPeriodChangeHandler = function(event) {
          if(event.detail.value < self.pwdExpiryWarningPeriod()){
              params.baseModel.showMessages(null, [self.nls.message.pwdExpiryPeriodCheck], "ERROR");
          }
        };
        self.numberMandatoryChangeHandler = function(event) {
            if (event.detail.value) {
                if (event.detail.value.length !== 0) {
                    self.nbrNumericDisabled(true);
                    self.isNumericMandatory(true);
                    self.nbrNumericAlpha("");
                    self.numberMandatory.push(self.checkboxValues.numericMandatory());
                } else {
                    self.nbrNumericAlpha("");
                    self.nbrNumericDisabled(false);
                    self.isNumericMandatory(false);
                    self.numberMandatory.remove(self.checkboxValues.numericMandatory());
                }
            }
        };
        self.save = function() {
          if (!params.baseModel.showComponentValidationErrors(document.getElementById("tracker"))) {
            return;
          }
            if (!self.isUpperCaseAllowed() && !self.isLowerAlphaAllowed() && !self.isNumericAllowed() && !self.isSpecialCharAllowed()) {
                params.baseModel.showMessages(null, [self.nls.message.allowedChar], "ERROR");
                return;
            }
            if (self.isUpperCaseMandatory() && self.nbrUpperAlpha() < 1) {
                params.baseModel.showMessages(null, [self.nls.message.upperMandatoryCount], "ERROR");
                return;
            }
            if (self.isLowerCaseMandatory() && self.nbrLowerAlpha() < 1) {
                params.baseModel.showMessages(null, [self.nls.message.lowerMandatoryCount], "ERROR");
                return;
            }
            if (self.isNumericMandatory() && self.nbrNumericAlpha() < 1) {
                params.baseModel.showMessages(null, [self.nls.message.numberMandatoryCount], "ERROR");
                return;
            }
            if (self.isSpecialCharMandatory() && self.nbrSpecialChar() < 1) {
                params.baseModel.showMessages(null, [self.nls.message.specialCharMandatoryCount], "ERROR");
                return;
            }
            if (self.isSpecialCharAllowed() && (self.specialCharAllowed() === undefined || self.specialCharAllowed().length===0)) {
                params.baseModel.showMessages(null, [self.nls.message.specialCharListError], "ERROR");
                return;
            }
            if (self.pwdExpiryPeriod()<self.pwdExpiryWarningPeriod()) {
               params.baseModel.showMessages(null, [self.nls.message.pwdExpiryPeriodCheck], "ERROR");
                return;
            }

            self.payload.policyId(self.id());
            self.payload.pwdPolicyName(self.pwdPolicyName());
            self.payload.pwdPolicyDesc(self.pwdPolicyDesc());
            self.payload.enterpriseRoles(self.userType());
            self.payload.pwdMinLength(self.minLength());
            self.payload.pwdMaxLength(self.maxLength());
            self.payload.nbrRepeatChars(self.repetitiveChar());
            self.payload.nbrSuccessiveChars(self.successiveChar());
            self.payload.pwdHistorySize(self.previousPwdDisallowed());
            self.payload.pwdFailureCountInterval(self.successiveInvalid());
            self.payload.excludedDictWords(self.restrictedPwdDetails());
            self.payload.pwdMinExpiryDays(self.pwdExpiryWarningPeriod());
            self.payload.pwdMaxExpiryDays(self.pwdExpiryPeriod());
            self.payload.pwdMustChange(self.forcePwdChange());
            self.payload.upperAlphaAllowed(self.isUpperAlphaAllowed());
            self.payload.lowerAlphaAllowed(self.isLowerAlphaAllowed());
            self.payload.numericAllowed(self.isNumericAllowed());
            self.payload.specialCharsAllowed(self.isSpecialCharAllowed());
            self.payload.nbrUpperAlpha(self.nbrUpperAlpha());
            self.payload.nbrLowerAlpha(self.nbrLowerAlpha());
            self.payload.nbrNumeric(self.nbrNumericAlpha());
            self.payload.nbrSpecial(self.nbrSpecialChar());
            ko.utils.arrayForEach(self.personalDetExclusion(), function(item) {
                if (item === "dob" || item === "Date of Birth") {
                    self.personalDetExclusionPayload.push(self.nls.exclusionDetail.dobDisplay);
                } else if (item === "firstname" || item === "First Name") {
                    self.personalDetExclusionPayload.push(self.nls.exclusionDetail.firstnameDisplay);
                } else if (item === "lastname" || item === "Last Name") {
                    self.personalDetExclusionPayload.push(self.nls.exclusionDetail.lastnameDisplay);
                } else if (item === "userid" || item === "User Id") {
                    self.personalDetExclusionPayload.push(self.nls.exclusionDetail.useridDisplay);
                } else if (item === "partyid" || item === "Party Id") {
                    self.personalDetExclusionPayload.push(self.nls.exclusionDetail.partyidDisplay);
                }
            });
            self.payload.personalDetExclude(self.personalDetExclusionPayload());
            self.payload.specialCharAllowed(self.specialCharAllowed());
            self.payload.firstPwdExpiryPeriod(self.firstPwdExpiry());
            self.payload.version(self.version());
            params.dashboard.loadComponent("review-update", {
                data: self.payload
            }, self);
        };
        self.dispose = function() {
            specialCharAllowedSubscription.dispose();
            validateExclusionPwdSubscription.dispose();
            restrictedPasswordsSubscription.dispose();
        };
    };
});
