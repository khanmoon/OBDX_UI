define([
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/password-policy",
    "ojs/ojcheckboxset"
], function (ko, $, PasswordPolicyReadModel, locale) {
    "use strict";
    return function (params) {
        var self = this, getNewKoModel = function () {
                var KoModel = ko.mapping.fromJS(PasswordPolicyReadModel.getNewModel());
                return KoModel;
            };
        ko.utils.extend(self, params.rootModel);
        self.nls = locale;
        self.checkboxValues = getNewKoModel().checkboxValues;
        params.dashboard.headerName(self.nls.pageTitle.header);
        params.baseModel.registerElement("action-header");
        params.baseModel.registerElement("row");
        params.baseModel.registerElement("confirm-screen");
        params.baseModel.registerComponent("update", "password-policy");
        self.transactionName = ko.observable(self.nls.header.transactionName);
        self.id = ko.observable();
        self.pwdPolicyName = ko.observable();
        self.pwdPolicyDesc = ko.observable();
        self.userType = ko.observableArray();
        self.minLength = ko.observable();
        self.maxLength = ko.observable();
        self.isUpperAlphaAllowed = ko.observable();
        self.isLowerAlphaAllowed = ko.observable();
        self.isSpecialCharAllowed = ko.observable();
        self.isNumericAllowed = ko.observable();
        self.repetitiveChar = ko.observable();
        self.successiveChar = ko.observable();
        self.nbrUpperAlpha = ko.observable();
        self.nbrLowerAlpha = ko.observable();
        self.nbrSpecialChar = ko.observable();
        self.nbrNumericAlpha = ko.observable();
        self.personalDetExclusion = ko.observableArray();
        self.restrictedPwdDetails = ko.observableArray();
        self.repetitiveCharAllowed = ko.observable();
        self.previousPwdDisallowed = ko.observable();
        self.successiveInvalid = ko.observable();
        self.pwdExpiryPeriod = ko.observable();
        self.firstPwdExpiry = ko.observable();
        self.pwdExpiryWarningPeriod = ko.observable();
        self.forcePwdChange = ko.observable();
        self.dataLoaded = ko.observable(false);
        self.upperAlphaMandatory = ko.observableArray();
        self.lowerAlphaMandatory = ko.observableArray();
        self.numberMandatory = ko.observableArray();
        self.specialCharMandatory = ko.observableArray();
        self.specialCharAllowed = ko.observableArray();
        self.version = ko.observable();
        self.userTypeEnums = ko.observableArray([]);
        self.userTypeEnumsLoaded = ko.observable(false);
        self.nbrUpperDisabled = ko.observable(false);
        self.nbrLowerDisabled = ko.observable(false);
        self.nbrNumericDisabled = ko.observable(false);
        self.nbrSpecialCharDisabled = ko.observable(false);
        PasswordPolicyReadModel.fetchUserGroupOptions().done(function (data) {
            self.userTypeEnums(data.enterpriseRoleDTOs);
            self.userTypeEnumsLoaded(true);
        });
        PasswordPolicyReadModel.fetchPasswordPolicyDetails(self.passwordPolicyDetails().policyId).done(function (data) {
            self.id(data.passwordPolicyDTO.policyId);
            self.pwdPolicyName(data.passwordPolicyDTO.pwdPolicyName);
            self.pwdPolicyDesc(data.passwordPolicyDTO.pwdPolicyDesc);
            self.userType(data.passwordPolicyDTO.enterpriseRoles);
            self.minLength(data.passwordPolicyDTO.pwdMinLength);
            self.maxLength(data.passwordPolicyDTO.pwdMaxLength);
            self.isUpperAlphaAllowed(data.passwordPolicyDTO.upperAlphaAllowed);
            self.isLowerAlphaAllowed(data.passwordPolicyDTO.lowerAlphaAllowed);
            self.isSpecialCharAllowed(data.passwordPolicyDTO.specialCharsAllowed);
            self.isNumericAllowed(data.passwordPolicyDTO.numericAllowed);
            self.repetitiveChar(data.passwordPolicyDTO.nbrRepeatChars);
            self.successiveChar(data.passwordPolicyDTO.nbrSuccessiveChars);
            self.nbrNumericAlpha(data.passwordPolicyDTO.nbrNumeric);
            self.nbrSpecialChar(data.passwordPolicyDTO.nbrSpecial);
            self.nbrLowerAlpha(data.passwordPolicyDTO.nbrLowerAlpha);
            self.nbrUpperAlpha(data.passwordPolicyDTO.nbrUpperAlpha);
            if (data.passwordPolicyDTO.personalDetExclude) {
                ko.utils.arrayForEach(data.passwordPolicyDTO.personalDetExclude, function (item) {
                    if (item === "dob") {
                        self.personalDetExclusion.push(self.nls.exclusionDetail.dob);
                    } else if (item === "firstname") {
                        self.personalDetExclusion.push(self.nls.exclusionDetail.firstname);
                    } else if (item === "lastname") {
                        self.personalDetExclusion.push(self.nls.exclusionDetail.lastname);
                    } else if (item === "userid") {
                        self.personalDetExclusion.push(self.nls.exclusionDetail.userid);
                    } else if (item === "partyid") {
                        self.personalDetExclusion.push(self.nls.exclusionDetail.partyid);
                    }
                });
            }
            self.restrictedPwdDetails(data.passwordPolicyDTO.excludedDictWords);
            self.previousPwdDisallowed(data.passwordPolicyDTO.pwdHistorySize);
            self.successiveInvalid(data.passwordPolicyDTO.pwdFailureCountInterval);
            self.pwdExpiryPeriod(data.passwordPolicyDTO.pwdMaxExpiryDays);
            self.firstPwdExpiry(data.passwordPolicyDTO.firstPwdExpiryPeriod);
            self.pwdExpiryWarningPeriod(data.passwordPolicyDTO.pwdMinExpiryDays);
            self.forcePwdChange(data.passwordPolicyDTO.pwdMustChange);
            self.specialCharAllowed(data.passwordPolicyDTO.specialCharAllowed);
            self.version(data.passwordPolicyDTO.version);
            self.dataLoaded(true);
            if (self.nbrUpperAlpha() >= 1) {
                self.upperAlphaMandatory.push(self.checkboxValues.upperMandatory());
                self.nbrUpperDisabled(true);
            }
            if (self.nbrLowerAlpha() >= 1) {
                self.lowerAlphaMandatory.push(self.checkboxValues.lowerCaseMandatory());
                self.nbrLowerDisabled(true);
            }
            if (self.nbrNumericAlpha() >= 1) {
                self.numberMandatory.push(self.checkboxValues.numericMandatory());
                self.nbrNumericDisabled(true);
            }
            if (self.nbrSpecialChar() >= 1) {
                self.specialCharMandatory.push(self.checkboxValues.specialCharMandatory());
                self.nbrSpecialCharDisabled(true);
            }
        });
        self.edit = function () {
            params.dashboard.loadComponent("update", {}, self);
        };
        self.showModalWindow = function () {
            $("#deletePasswordPolicy").trigger("openModal");
        };
        self.hideModalWindow = function () {
            $("#deletePasswordPolicy").hide();
        };
        self.deletePasswordPolicy = function () {
            PasswordPolicyReadModel.deletePasswordPolicy(self.passwordPolicyDetails().policyId).done(function (data, status, jqXhr) {
                params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.transactionName()
                }, self);
            });
        };
        self.back = function () {
            params.dashboard.loadComponent("policy-search", {}, self);
        };
    };
});