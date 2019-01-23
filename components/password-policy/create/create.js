define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/password-policy-create",
    "ojs/ojselectcombobox",
    "ojs/ojinputtext",
    "ojs/ojcheckboxset",
    "ojs/ojknockout-validation"
], function(oj, ko, $, PasswordPolicyCreateModel, locale) {
    "use strict";
    return function(params) {
        var self = this,
            getNewKoModel = function() {
                var KoModel = ko.mapping.fromJS(PasswordPolicyCreateModel.getNewModel());
                return KoModel;
            };
        /**
         * setObservable - Define an observable if variable is undefined.
         *
         * @param  {type} value variable to be set
         * @param  {String|Boolean|Number} param defult value of variable
         * @return {Function}       observable returned
         */
        function setObservable(value, param) {
            if (!value) {
                return ko.observable(param);
            }
            return value;
        }

        /**
         * setObservableArray - Define an observableArray if variable is undefined.
         *
         * @param  {type} value variable to be set
         * @return {Function}       observableArray returned
         */
        function setObservableArray(value) {
            if (!value) {
                return ko.observableArray([]);
            }
            return value;
        }

        ko.utils.extend(self, params.rootModel);
        self.nls = locale;
        self.createPayload = getNewKoModel().passwordPolicyCreateModel;
        self.checkboxValues = getNewKoModel().checkboxValues;
        self.exclusionDetailListValues = getNewKoModel().exclusionDetailListValues;
        params.dashboard.headerName(self.nls.pageTitle.header);
        params.baseModel.registerElement("page-section");
        params.baseModel.registerComponent("review-create", "password-policy");
        params.baseModel.registerElement("confirm-screen");
        self.validationTracker = ko.observable();
        self.policyName = setObservable(self.policyName);
        self.policyDesc = setObservable(self.policyDesc);
        self.userTypeEnums = ko.observableArray([]);
        self.userTypeEnumsLoaded = ko.observable(false);
        self.repetitiveCharAllowedNumber = setObservable(self.repetitiveCharAllowedNumber);
        self.successiveCharAllowedNumber = setObservable(self.successiveCharAllowedNumber);
        self.previousPwdDisallowed = setObservable(self.previousPwdDisallowed);
        self.failedLoginAttempts = setObservable(self.failedLoginAttempts);
        self.passwordExpiryPeriod = setObservable(self.passwordExpiryPeriod);
        self.passwordExpiryWarningPeriod = setObservable(self.passwordExpiryWarningPeriod);
        self.firstPasswordExpiryPeriod = setObservable(self.firstPasswordExpiryPeriod);
        self.maximumLength = setObservable(self.maximumLength);
        self.minimumLength = setObservable(self.minimumLength);
        self.isUpperCaseAllowed = setObservable(self.isUpperCaseAllowed, false);
        self.isUpperCaseMandatory = setObservable(self.isUpperCaseMandatory, false);
        self.numberUpperCaseAllowed = setObservable(self.numberUpperCaseAllowed);
        self.upperCaseAllowedSelectedValues = setObservableArray(self.upperCaseAllowedSelectedValues);
        self.isLowerCaseAllowed = setObservable(self.isLowerCaseAllowed, false);
        self.isLowerCaseMandatory = setObservable(self.isLowerCaseMandatory, false);
        self.numberLowerCaseAllowed = setObservable(self.numberLowerCaseAllowed);
        self.lowerCaseAllowedSelectedValues = setObservableArray(self.lowerCaseAllowedSelectedValues);
        self.isSpecialCharAllowed = setObservable(self.isSpecialCharAllowed, false);
        self.isSpecialCharMandatory = setObservable(self.isSpecialCharMandatory, false);
        self.numberSpecialCharAllowed = setObservable(self.numberSpecialCharAllowed);
        self.specialCharSelectedValues = setObservableArray(self.specialCharSelectedValues);
        self.specialCharList = setObservable(self.specialCharList);
        self.isNumericAllowed = setObservable(self.isNumericAllowed, false);
        self.isNumericMandatory = setObservable(self.isNumericMandatory, false);
        self.numberAllowed = setObservable(self.numberAllowed);
        self.numericSelectedValues = setObservableArray(self.numericSelectedValues);
        self.selectedExclusionList = setObservable(self.selectedExclusionList);
        self.restrictedPasswords = setObservable(self.restrictedPasswords);
        self.selectedUserType = setObservableArray(self.selectedUserType);
        self.passwordMustChange = setObservable(self.passwordMustChange, false);
        self.upperAllowed = setObservableArray(self.upperAllowed);
        self.lowerAllowed = setObservableArray(self.lowerAllowed);
        self.specialAllowed = setObservableArray(self.specialAllowed);
        self.numAllowed = setObservableArray(self.numAllowed);

        self.exclusionDetailList = ko.observableArray([{
                "id": self.exclusionDetailListValues.dob,
                "name": self.nls.exclusionDetail.dob
            },
            {
                "id": self.exclusionDetailListValues.firstname,
                "name": self.nls.exclusionDetail.firstname
            },
            {
                "id": self.exclusionDetailListValues.lastname,
                "name": self.nls.exclusionDetail.lastname
            },
            {
                "id": self.exclusionDetailListValues.userid,
                "name": self.nls.exclusionDetail.userid
            },
            {
                "id": self.exclusionDetailListValues.partyid,
                "name": self.nls.exclusionDetail.partyid
            }
        ]);
        params.baseModel.registerElement("action-header");
        PasswordPolicyCreateModel.fetchUserGroupOptions().done(function(data) {
            self.userTypeEnums(data.enterpriseRoleDTOs);
            self.userTypeEnumsLoaded(true);
        });
        var restrictedPasswordsSubscription = self.restrictedPasswords.subscribe(function(value) {
            for (var i = 0; i < value.length; i++) {
                if (value[i].length > 20) {
                    self.restrictedPasswords().pop(value[i]);
                    params.baseModel.showMessages(null, [self.nls.hintMessages.invalidTextLength], "INFO");
                }
            }
        });
        self.previousLength = 0;
        var specialCharListSubscription = self.specialCharList.subscribe(function(array) {
            var len = array.length;
            if (len < self.previousLength) {
                self.previousLength = len;

            } else if (len > 0) {
                var a = array[len - 1];
                if (a.length > 1) {
                    self.specialCharList().pop(a);
                    params.baseModel.showMessages(null, [self.nls.hintMessages.invalidEntry], "INFO");
                    return;
                }
                self.previousLength = self.previousLength + 1;
            }
        });
        var validateExclusionPwdSubscription = self.selectedExclusionList.subscribe(function(value) {
            for (var i = 0; i < value.length; i++) {
                if (value[i] !== self.exclusionDetailListValues.firstname() && value[i] !== self.exclusionDetailListValues.lastname() && value[i] !== self.exclusionDetailListValues.partyid() && value[i] !== self.exclusionDetailListValues.userid() && value[i] !== self.exclusionDetailListValues.dob()) {
                    self.selectedExclusionList().pop(value[i]);
                    params.baseModel.showMessages(null, [self.nls.hintMessages.invalidListEntry], "INFO");
                }
            }
        });
        /**
         * This function is used to update maximumLength to blank if minimumLength is changed.
         *
         * @return {void}
         */
        self.passwordChangeHandler = function() {
            self.maximumLength("");
        };

        /**
         * This function is used to update passwordExpiryWarningPeriod to blank if passwordExpiryPeriod is changed.
         *
         * @return {void}
         */
        self.passwordExpiryPeriodChangeHandler = function(event) {
          if(event.detail.value < self.passwordExpiryWarningPeriod()){
              params.baseModel.showMessages(null, [self.nls.error.pwdExpiryPeriodCheck], "ERROR");
          }
        };
        self.upperCaseAllowedChangeHandler = function(event) {
            if (event.detail.value[0]) {
                self.isUpperCaseAllowed($.parseJSON(event.detail.value[0]));
                self.upperAllowed.push(self.checkboxValues.upperAllowed());
            } else {
                self.isUpperCaseMandatory(false);
                self.isUpperCaseAllowed(false);
                self.upperCaseAllowedSelectedValues.remove(self.checkboxValues.upperMandatory());
                self.numberUpperCaseAllowed("");
            }
        };
        self.upperCaseMandatoryChangeHandler = function(event) {
            if (event.detail.value[0]) {
                self.isUpperCaseMandatory(true);
                self.upperCaseAllowedSelectedValues.push(self.checkboxValues.upperMandatory());
            } else {
                self.upperCaseAllowedSelectedValues.remove(self.checkboxValues.upperMandatory());
                self.isUpperCaseMandatory(false);
                self.numberUpperCaseAllowed("");
            }
        };
        self.lowerCaseAllowedChangeHandler = function(event) {
            if (event.detail.value[0]) {
                self.isLowerCaseAllowed(event.detail.value[0]);
                self.lowerAllowed.push(self.checkboxValues.lowerAllowed());
            } else {
                self.isLowerCaseMandatory(false);
                self.isLowerCaseAllowed(false);
                self.lowerCaseAllowedSelectedValues.remove(self.checkboxValues.lowerCaseMandatory());
                self.numberLowerCaseAllowed("");
            }
        };
        self.lowerCaseMandatoryChangeHandler = function(event) {
            if (event.detail.value[0]) {
                self.isLowerCaseMandatory(true);
                self.lowerCaseAllowedSelectedValues.push(self.checkboxValues.lowerCaseMandatory());
            } else {
                self.isLowerCaseMandatory(false);
                self.lowerCaseAllowedSelectedValues.remove(self.checkboxValues.lowerCaseMandatory());
                self.numberLowerCaseAllowed("");
            }
        };
        self.specialCharAllowedChangeHandler = function(event) {
            if (event.detail.value[0]) {
                self.isSpecialCharAllowed($.parseJSON(event.detail.value[0]));
                self.specialAllowed.push(self.checkboxValues.specialAllowed());
            } else {
                self.isSpecialCharAllowed(false);
                self.isSpecialCharMandatory(false);
                self.specialCharSelectedValues.remove(self.checkboxValues.specialCharMandatory());
                self.numberSpecialCharAllowed("");
                self.specialCharList([]);
            }
        };
        self.specialCharMandatoryChangeHandler = function(event) {
            if (event.detail.value[0]) {
                self.isSpecialCharMandatory(true);
                self.specialCharSelectedValues.push(self.checkboxValues.specialCharMandatory());
            } else {
                self.isSpecialCharMandatory(false);
                self.specialCharSelectedValues.remove(self.checkboxValues.specialCharMandatory());
                self.numberSpecialCharAllowed("");
            }
        };
        self.numberAllowedChangeHandler = function(event) {
            if (event.detail.value[0]) {
                self.isNumericAllowed($.parseJSON(event.detail.value[0]));
                self.numAllowed.push(self.checkboxValues.numAllowed());
            } else {
                self.isNumericMandatory(false);
                self.isNumericAllowed(false);
                self.numericSelectedValues.remove(self.checkboxValues.numericMandatory());
                self.numberAllowed("");
            }
        };
        self.numberMandatoryChangeHandler = function(event) {
            if (event.detail.value[0]) {
                self.isNumericMandatory(true);
                self.numericSelectedValues.push(self.checkboxValues.numericMandatory());
            } else {
                self.isNumericMandatory(false);
                self.numericSelectedValues.remove(self.checkboxValues.numericMandatory());
                self.numberAllowed("");
            }
        };
        self.saveForReview = function() {
            if (!self.isUpperCaseAllowed() && !self.isLowerCaseAllowed() && !self.isNumericAllowed() && !self.isSpecialCharAllowed()) {
                params.baseModel.showMessages(null, [self.nls.error.allowedChar], "ERROR");
                return;
            }
            if (!params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            if (self.isUpperCaseMandatory() && self.numberUpperCaseAllowed() === undefined) {
                params.baseModel.showMessages(null, [self.nls.error.upperMandatoryCount], "ERROR");
                return;
            }
            if (self.isLowerCaseMandatory() && self.numberLowerCaseAllowed() === undefined) {
                params.baseModel.showMessages(null, [self.nls.error.lowerMandatoryCount], "ERROR");
                return;
            }
            if (self.isNumericMandatory() && self.numberAllowed() === undefined) {
                params.baseModel.showMessages(null, [self.nls.error.numberMandatoryCount], "ERROR");
                return;
            }
            if (self.isSpecialCharMandatory() && self.numberSpecialCharAllowed() === undefined) {
                params.baseModel.showMessages(null, [self.nls.error.specialCharMandatoryCount], "ERROR");
                return;
            }
            if (self.isSpecialCharAllowed() && (self.specialCharList() === undefined || self.specialCharList().length===0)) {
                params.baseModel.showMessages(null, [self.nls.error.specialCharListError], "ERROR");
                return;
            }
            if (self.passwordExpiryPeriod()<self.passwordExpiryWarningPeriod()) {
               params.baseModel.showMessages(null, [self.nls.error.pwdExpiryPeriodCheck], "ERROR");
                return;
            }
            self.createPayload.pwdPolicyName(self.policyName());
            self.createPayload.pwdPolicyDesc(self.policyDesc());
            self.createPayload.pwdMinLength(self.minimumLength());
            self.createPayload.pwdMaxLength(self.maximumLength());
            self.createPayload.nbrRepeatChars(self.repetitiveCharAllowedNumber());
            self.createPayload.nbrSuccessiveChars(self.successiveCharAllowedNumber());
            self.createPayload.pwdHistorySize(self.previousPwdDisallowed());
            self.createPayload.pwdMinExpiryDays(self.passwordExpiryWarningPeriod());
            self.createPayload.pwdMaxExpiryDays(self.passwordExpiryPeriod());
            self.createPayload.firstPwdExpiryPeriod(self.firstPasswordExpiryPeriod());
            self.createPayload.pwdMustChange(self.passwordMustChange());
            self.createPayload.upperAlphaAllowed(self.isUpperCaseAllowed());
            self.createPayload.lowerAlphaAllowed(self.isLowerCaseAllowed());
            self.createPayload.numericAllowed(self.isNumericAllowed());
            self.createPayload.specialCharsAllowed(self.isSpecialCharAllowed());
            self.createPayload.nbrUpperAlpha(self.numberUpperCaseAllowed());
            self.createPayload.nbrLowerAlpha(self.numberLowerCaseAllowed());
            self.createPayload.nbrNumeric(self.numberAllowed());
            self.createPayload.nbrSpecial(self.numberSpecialCharAllowed());
            self.createPayload.enterpriseRoles(self.selectedUserType());
            self.createPayload.excludedDictWords(self.restrictedPasswords());
            self.createPayload.personalDetExclude(self.selectedExclusionList());
            self.createPayload.specialCharAllowed(self.specialCharList());
            self.createPayload.pwdFailureCountInterval(self.failedLoginAttempts());
            params.dashboard.loadComponent("review-create", {
                data: self.createPayload
            }, self);
        };
        self.create = function() {
            PasswordPolicyCreateModel.createPasswordPolicy(ko.toJSON(self.createPayload)).done(function(data, status, jqXhr) {
                params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.nls.header.transactionName
                }, self);
            });
        };
        self.dispose = function() {
            specialCharListSubscription.dispose();
            validateExclusionPwdSubscription.dispose();
            restrictedPasswordsSubscription.dispose();
        };
    };
});
