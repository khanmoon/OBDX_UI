define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",

    "ojL10n!resources/nls/receive-payment",
    "ojs/ojinputnumber"
], function (oj, ko, $, GlobalPayeeModel, BaseLogger, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this, getNewKoModel = function () {
                var KoModel = ko.mapping.fromJS(GlobalPayeeModel.getNewModel());
                return KoModel;
            };
        self.resource = ResourceBundle;
        ko.utils.extend(self, rootParams.rootModel);
        self.onBoardingModel = getNewKoModel().onBoardingModel;
        self.bankdetailsModel = getNewKoModel().bankdetailsModel;
        self.verifyModel = getNewKoModel().verifyModel;
        self.validationTracker = ko.observable();
        self.stageOne = ko.observable(true);
        self.stageTwo = ko.observable(false);
        GlobalPayeeModel.init(self.aliasValue, self.aliasType);
        self.onLogin = function () {
            self.showLoadingIcon(true);
            self.loginErrorPresent(false);
            $(".login-error").empty();
            $(".login_button").attr("disabled", "disabled");
            $(".login-auth-msg").show();
            self.request.requestId = "login-info";
            self.request.fldPassword = self.getEncryptedPassword();
            function loginSuccessHandler(data) {
                self.showLoadingIcon(false);
                self.request.fldLoginUserId("");
                self.fldPlainPassword("");
                var userDetail = {}, errorDto;
                if (data.faml.returncode === "0") {
                    userDetail.menu = data.faml.response.menu;
                    userDetail.userDet = data.faml.response.userdetail;
                    userDetail.pref = data.faml.response.pref.favoritetransactiondto;
                    userDetail.sessioninfo = data.faml.response.sessioninfo;
                    window.location.replace("index.html");
                } else {
                    self.loginErrorPresent(true);
                    errorDto = data.faml.response.result.resultdto.errors.errordto;
                    $(".login-error").html(errorDto.errormsg);
                }
                $(".login_button").removeAttr("disabled");
                $(".login-auth-msg").hide();
            }
            self.fireRequest(self.request, loginSuccessHandler);
        };
    };
});