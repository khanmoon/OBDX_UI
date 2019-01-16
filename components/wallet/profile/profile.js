define([
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/profile",
    "ojs/ojknockout-validation"
], function (ko, $, PartyModel, ResourceBundle) {
    "use strict";
    return function viewModel(rootParams) {
        var self = this, getNewKoModel = function () {
                var KoModel = PartyModel.getNewModel();
                KoModel.editProfileDTO = ko.mapping.fromJS(KoModel.editProfileDTO);
                return KoModel;
            };
        ko.utils.extend(self, rootParams.rootModel);
        self.wallet = ResourceBundle.wallet;
        self.common = ResourceBundle.common;
        rootParams.dashboard.headerName(self.wallet.profile.heading);
        self.address = ko.observable();
        self.phoneNumber = ko.observable();
        self.details = new getNewKoModel();
        self.validationTracker = ko.observable();
        self.refreshWallet = ko.observable();
        self.readOnly = ko.observable(true);
        self.editDone = ko.observable(false);
        self.firstName = ko.observable("");
        self.lastName = ko.observable("");
        self.dateOfBirth = ko.observable();
        self.dataFetched = ko.observable(false);
        self.addressFetched = ko.observable(false);
        self.contactDetailsFetched = ko.observable(false);
        self.loginTimeFetched = ko.observable(false);
        rootParams.dashboard.userDataFromParent = self;
        self.showOkButton = ko.observable(true);
        rootParams.baseModel.registerElement("page-section");
        rootParams.baseModel.registerElement("row");
        self.loginTime = ko.observable();
        if (rootParams.showOk) {
            self.showOkButton(rootParams.showOk);
        }
        self.serializer = function (object) {
            var str = "";
            if (object.line1) {
                str += object.line1;
            }
            if (object.line2) {
                str += object.line2;
            }
            if (object.line3) {
                str += object.line3;
            }
            if (object.line4) {
                str += object.line4;
            }
            if (object.country) {
                str = str + "" + object.country;
            }
            return str;
        };
        self.editProfile = function () {
            self.readOnly(false);
        };
        self.saveProfile = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            if (self.details.editProfileDTO.firstName() !== "" && self.details.editProfileDTO.lastName() !== "") {
                PartyModel.getWallet().done(function (data1) {
                    self.refreshWallet(data1.walletId.value);
                    PartyModel.editProfile(self.refreshWallet(), ko.toJSON(ko.mapping.toJS(self.details.editProfileDTO))).done(function () {
                        self.user().firstName = self.details.editProfileDTO.firstName();
                        self.user().lastName = self.details.editProfileDTO.lastName();
                        self.readOnly(true);
                        self.editDone(true);
                    });
                });
            }
        };
        PartyModel.fetchLastLoginTime().done(function (data) {
            self.dataFetched(true);
            self.loginTime(new Date(data.userProfile.lastLoginTime).toUTCString());
            self.user(rootParams.dashboard.dataToBePassed());
            self.details.editProfileDTO.firstName(self.user().firstName);
            self.details.editProfileDTO.lastName(self.user().lastName);
            self.dataFetched(true);
        });
    };
});