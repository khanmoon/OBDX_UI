define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",

    "ojL10n!resources/nls/user-onboarding",
    "ojs/ojinputtext"
], function (oj, ko, $, GlobalPayeeModel, BaseLogger, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this, getNewKoModel = function () {
                var KoModel = ko.mapping.fromJS(GlobalPayeeModel.getNewModel());
                return KoModel;
            };
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = ResourceBundle;
        self.onBoardingModel = getNewKoModel().onBoardingModel;
        self.bankdetailsModel = getNewKoModel().bankdetailsModel;
        self.verifyModel = getNewKoModel().verifyModel;
        self.validationTracker = ko.observable();
        self.confirmPassword = ko.observable();
        self.otp = ko.observable();
        self.stageOne = ko.observable(true);
        self.stageTwo = ko.observable(false);
        self.otpVerification = ko.observable(false);
        self.stageThree = ko.observable(false);
        self.branchList = ko.observableArray();
        self.globalPayeeData = ko.observable();
        self.ifsc = ko.observable();
        self.version = ko.observable();
        self.etagArray = ko.observableArray();
        self.partyId = ko.observable();
        self.uid = ko.observable();
        self.displaypasswordpolicy = ko.observable();
        rootParams.dashboard.headerName(self.resource.payments.peertopeer.registration);
        GlobalPayeeModel.init(self.aliasValue, self.aliasType);
        self.createUser = function () {
            rootParams.dashboard.headerName(self.resource.payments.peertopeer.globalpayee.review);
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            self.onBoardingModel.aliasValue(self.aliasValue().toLowerCase());
            self.onBoardingModel.aliasType(self.aliasType());
            self.onBoardingModel.userId(self.onBoardingModel.emailId());
            var payload = ko.toJSON(self.onBoardingModel);
            GlobalPayeeModel.createUser(payload).done(function (data) {
                self.globalPayeeData(data);
                self.stageOne(false);
                self.stageTwo(true);
            });
        };
        self.verifyUser = function () {
            rootParams.dashboard.headerName(self.resource.payments.peertopeer.registration);
            self.onBoardingModel.uId(self.globalPayeeData().uId);
            var payload = ko.toJSON(self.onBoardingModel);
            GlobalPayeeModel.verifyUser(payload).done(function () {
                self.stageTwo(false);
                self.stageThree(true);
            });
        };
        GlobalPayeeModel.fetchPasswordPolicy().done(function (data) {
            if (data) {
                self.pwdMinLength = ko.observable(data.passwordPolicyDTO.pwdMinLength);
                self.pwdMaxLength = ko.observable(data.passwordPolicyDTO.pwdMaxLength);
                self.nbrUpperAlpha = ko.observable(data.passwordPolicyDTO.nbrUpperAlpha);
                self.nbrLowerAlpha = ko.observable(data.passwordPolicyDTO.nbrLowerAlpha);
                self.nbrNumeric = ko.observable(data.passwordPolicyDTO.nbrNumeric);
                self.nbrSpecial = ko.observable(data.passwordPolicyDTO.nbrSpecial);
                self.specialAllowed = ko.observableArray(data.passwordPolicyDTO.specialAllowed);
            }
        });
        self.cancel = function () {
            self.loadComp("security-code-verification");
        };
        self.equalToPassword = {
            validate: function (value) {
                if (self.onBoardingModel.password() === value) {
                    return true;
                }
                self.confirmPassword("");
                    throw new Error(self.resource.payments.peertopeer.globalpayee.passwordMatch);

            }
        };
        self.cancelUser = function () {
            self.stageOne(true);
            self.stageTwo(false);
        };
        self.done = function () {
            rootParams.baseModel.switchPage({
                homeComponent: {
                    component: "claim-payment-existing-user-dashboard",
                    module: "claim-payment-existing-user",
                    query: {
                        value: self.aliasValue(),
                        type: self.aliasType(),
                        id: self.paymentId(),
                        user: "ldap"
                    }
                }
            }, true);
        };
    };
});
