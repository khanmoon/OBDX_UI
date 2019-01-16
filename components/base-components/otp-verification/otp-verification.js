define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "baseLogger",
    "./model",
    "framework/js/constants/constants",
    "ojL10n!resources/nls/otp-verification",
    "ojs/ojknockout",
    "ojs/ojinputtext",
    "ojs/ojbutton"
], function(oj, ko, $, BaseLogger, OTPverificationModel, Constants, locale) {
    "use strict";
    return function(Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.locale = locale;
        self.verificationCode = ko.observable();
        self.invalidTracker = ko.observable();
        self.exceedResendMsg = ko.observable(false);
        self.resendMsg = ko.observable(false);
        self.resendCode = ko.observable(0);
        /**
         * This function is used to submit the OTP entered by the user.
         * If the OTP entered is valid it will call the callback function sent by the parent component.
         * @function submitOTP
         */
        self.submitOTP = function() {
            if (!Params.baseModel.showComponentValidationErrors(self.invalidTracker())) {
                return;
            }
            OTPverificationModel.submitOTP(Params.baseUrl, self.verificationCode()).done(function(data, status, jqXHR) {
                Params.baseModel.characterEncoding(data);
                if(self.response)
                self.response().passwordPolicyDTO = data.passwordPolicyDTO;
                Params.callback(data, status, jqXHR);
            }).fail(function(data) {
                if (Params.callbackFailure) {
                    Params.callbackFailure(data);
                }
            });
        };
        /**
         * This function is used to resend the OTP to the user.
         * @function resendOTP
         */
        self.resendOTP = function() {
            self.resendCode(self.resendCode() + 1);
            if (self.resendCode() > 3) {
                self.resendMsg(false);
                self.exceedResendMsg(true);

            } else if (self.resendCode() <= 3) {
                self.resendMsg(true);
                OTPverificationModel.resendOTP(Params.baseUrl);
            }
        };
        var password = true;
        /**
         * This function is the toggle the password entered by the user in visible or password format.
         * @function togglePassword
         */
        self.togglePassword = function() {
            password = !password;
            var eye = $("#eyecon");
            eye.removeClass("icon-eye icon-eye-slash");
            if (password) {
                eye.addClass("icon-eye-slash");
                $("#otp input").prop({
                    type: "password"
                });
            } else {
                eye.addClass("icon-eye");
                $("#otp input").prop({
                    type: "text"
                });
            }
        };
        /**
         * This function is called on the click of the cancel button.
         * It calls the callback function passed as an argument by the parent component.
         * @function cancel
         */
        self.cancel = function() {
            if (Params.cancelCallback) {
                Params.cancelCallback();
            } else {
                history.back();
            }
        };
        self.getTemplate = function() {
            if (Constants.module === "WALLET") {
                return "walletTemplate";
            } else if (Constants.module === "ORIGINATION") {
                return "popupTemplate";
            }
            return "templateDefault";

        };
    };
});
